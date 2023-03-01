## 任务队列和nextTick

### nextTick 定义
等待下一次 `DOM` 更新刷新的工具方法。

当你在 `Vue` 中更改响应式状态时，最终的 `DOM` 更新并不是同步生效的，而是由 `Vue` 将它们缓存在一个队列中，直到下一个`tick`才一起执行。这样是为了确保每个组件无论发生多少状态改变，都仅执行一次更新。`nextTick()` 可以在状态改变后立即使用，以等待 `DOM` 更新完成。你可以传递一个回调函数作为参数，或者 `await` 返回的 `Promise`。

### nextTick 实现
`nextTick()`实现在`runtime-core/scheduler.ts`，可以看到Vue3中使用的是Promise方法微任务回调用户的内容，Vue2中则是判断当前环境是否能使用几种方法，最差就降级到setTimeout方法：
```js
const resolvedPromise = /*#__PURE__*/ Promise.resolve() as Promise<any>
let currentFlushPromise: Promise<void> | null = null
// 【如果当前正在执行Flush更新，则在currentFlushPromise执行resolve以后再执行用户Fn】
// 【如果当前没有正在执行的内容，直接用Promise.resolve()执行then操作调用用户Fn】
export function nextTick<T = void>(
  this: T,
  fn?: (this: T) => void
): Promise<void> {
  const p = currentFlushPromise || resolvedPromise
  return fn ? p.then(this ? fn.bind(this) : fn) : p
}
```

### Vue3中的任务队列执行机制
Vue3中有三个任务队列：
- Pre队列：组件更新前置任务队列
- queue队列：组件更新时的任务队列，允许插队，按任务id从小大排列执行	
- Post队列：组件更新后置任务队列，按任务id从小大排列执行

从加入job队列到执行整个过程如下：**queueJob -> queueFlush -> flushJobs -> nextTick的fn回调**

基础数据定义如下，可以看到定义了一个主任务队列和后置任务队列，前置任务也用了主任务队列，只不过放在最前面：
```ts
export interface SchedulerJob extends Function {
  id?: number
  pre?: boolean
  active?: boolean
  computed?: boolean
  /**
   * Indicates whether the effect is allowed to recursively trigger itself
   * when managed by the scheduler.
   *
   * By default, a job cannot trigger itself because some built-in method calls,
   * e.g. Array.prototype.push actually performs reads as well (#1740) which
   * can lead to confusing infinite loops.
   * The allowed cases are component update functions and watch callbacks.
   * Component update functions may update child component props, which in turn
   * trigger flush: "pre" watch callbacks that mutates state that the parent
   * relies on (#1801). Watch callbacks doesn't track its dependencies so if it
   * triggers itself again, it's likely intentional and it is the user's
   * responsibility to perform recursive state mutation that eventually
   * stabilizes (#1727).
   */
  allowRecurse?: boolean
  /**
   * Attached by renderer.ts when setting up a component's render effect
   * Used to obtain component information when reporting max recursive updates.
   * dev only.
   */
  ownerInstance?: ComponentInternalInstance
}

export type SchedulerJobs = SchedulerJob | SchedulerJob[]

let isFlushing = false
let isFlushPending = false

//【核心-主任务队列】
const queue: SchedulerJob[] = []
let flushIndex = 0

// 【后置任务队列】
const pendingPostFlushCbs: SchedulerJob[] = []
let activePostFlushCbs: SchedulerJob[] | null = null
let postFlushIndex = 0

// 【执行任务队列的Promise实例】
const resolvedPromise = /*#__PURE__*/ Promise.resolve() as Promise<any>
let currentFlushPromise: Promise<void> | null = null

const RECURSION_LIMIT = 100
type CountMap = Map<SchedulerJob, number>
```

对`SchedulerJob`的使用有如下场景：
1. 可以看到在`mountComponent`组件挂载/更新过程中调用的`setupRenderEffect`方法里这样一段：
```ts
// 【定义一个名叫update的SchedulerJob类型job】
const update: SchedulerJob = (instance.update = () => effect.run())
update.id = instance.uid

// create reactive effect for rendering
const effect = (instance.effect = new ReactiveEffect(
  componentUpdateFn,
  () => queueJob(update),
  instance.scope // track it in component's effect scope
))

const update: SchedulerJob = (instance.update = () => effect.run())
update.id = instance.uid //组件实例的uid作为job的id，用于后序排序，按先父后子顺序执行（父先建uid更小）
```

2. 在`render`中调用`flushPreFlushCbs()`、`flushPostFlushCbs()`方法：
```ts
const render: RootRenderFunction = (vnode, container, isSVG) => {
  if (vnode == null) {
    if (container._vnode) {
      unmount(container._vnode, null, null, true)
    }
  } else {
    patch(container._vnode || null, vnode, container, null, null, null, isSVG)
  }
  flushPreFlushCbs()
  flushPostFlushCbs()
  container._vnode = vnode
}
```

#### `queueJob()`
该方法负责维护主任务队列，接受一个函数作为参数，为待入队任务，会将参数 push 到 queue 队列中，会判断是否唯一。会在当前宏任务执行结束后，清空队列。
```ts
// 【加入主任务队列-queue】
const queue: SchedulerJob[] = []//任务队列
let flushIndex = 0

export function queueJob(job: SchedulerJob) {
  // the dedupe search uses the startIndex argument of Array.includes()
  // by default the search index includes the current job that is being run
  // so it cannot recursively trigger itself again.
  // if the job is a watch() callback, the search will start with a +1 index to
  // allow it recursively trigger itself - it is the user's responsibility to
  // ensure it doesn't end up in an infinite loop.
  // 【当queue队列中没有job时或者queue队列中不包含当前job时】
  // 【当前job没有id直接加入队列，当前job有id则用splice方法替换相同id的job(更新这个job)】
  if (
    !queue.length ||
    !queue.includes(
      job,
      isFlushing && job.allowRecurse ? flushIndex + 1 : flushIndex
    )
  ) {
    if (job.id == null) {
      queue.push(job)
    } else {
      queue.splice(findInsertionIndex(job.id), 0, job)//【二分查找某id的job】
    }
    queueFlush()
  }
}

```

#### `queuePostFlushCb`
该方法负责维护后置任务队列，接受一个函数作为参数，为待入队任务，会将参数 push 到 pendingPostFlushCbs 队列中。会在主任务队列执行结束后，清空队列。
```ts
const pendingPostFlushCbs: SchedulerJob[] = []
let activePostFlushCbs: SchedulerJob[] | null = null
let postFlushIndex = 0

//【加入后置任务队列-pendingPostFlushCbs】
export function queuePostFlushCb(cb: SchedulerJobs) {
  if (!isArray(cb)) {
    if (
      !activePostFlushCbs ||
      !activePostFlushCbs.includes(
        cb,
        cb.allowRecurse ? postFlushIndex + 1 : postFlushIndex
      )
    ) {
      pendingPostFlushCbs.push(cb)
    }
  } else {
    // if cb is an array, it is a component lifecycle hook which can only be
    // triggered by a job, which is already deduped in the main queue, so
    // we can skip duplicate check here to improve perf
    pendingPostFlushCbs.push(...cb)
  }
  queueFlush()
}
```

#### `queueFlush()`
该方法负责进行准备工作，尝试创建`Promise`微任务，将`flushJobs`用`Promise`包装，等待主、后置两个任务队列的执行。
```ts
let isFlushing = false //【】
let isFlushPending = false //【】

const resolvedPromise = /*#__PURE__*/ Promise.resolve() as Promise<any>
let currentFlushPromise: Promise<void> | null = null

function queueFlush() {
  if (!isFlushing && !isFlushPending) {
    isFlushPending = true
    currentFlushPromise = resolvedPromise.then(flushJobs)
  }
}
```

#### `flushPreFlushCbs()`
该方法负责处理执行前置队列任务。
```ts
// 【执行前置任务队列-queue】
export function flushPreFlushCbs(
  seen?: CountMap,
  // if currently flushing, skip the current job itself
  i = isFlushing ? flushIndex + 1 : 0
) {
  if (__DEV__) {
    seen = seen || new Map()
  }
  for (; i < queue.length; i++) {
    const cb = queue[i]
    if (cb && cb.pre) {
      if (__DEV__ && checkRecursiveUpdates(seen!, cb)) {
        continue
      }
      // 【从queue队列中删除第i个job并执行】
      queue.splice(i, 1)
      i--
      cb()
    }
  }
}
```

#### `flushPostFlushCbs`
该方法负责处理执行后置队列任务。
```ts
// 【执行后置任务队列-pendingPostFlushCbs】
export function flushPostFlushCbs(seen?: CountMap) {
  if (pendingPostFlushCbs.length) {
    const deduped = [...new Set(pendingPostFlushCbs)]
    pendingPostFlushCbs.length = 0

    //【获取当前需要执行的后置任务队列并赋值给activePostFlushCbs，这一步是因为pendingPostFlushCbs可能还会动态增加】
    // #1947 already has active queue, nested flushPostFlushCbs call
    if (activePostFlushCbs) {
      activePostFlushCbs.push(...deduped)
      return
    }

    activePostFlushCbs = deduped
    if (__DEV__) {
      seen = seen || new Map()
    }
    //【当前正在执行的job队列进行排序】
    activePostFlushCbs.sort((a, b) => getId(a) - getId(b))

    //【遍历执行job】
    for (
      postFlushIndex = 0;
      postFlushIndex < activePostFlushCbs.length;
      postFlushIndex++
    ) {
      if (
        __DEV__ &&
        checkRecursiveUpdates(seen!, activePostFlushCbs[postFlushIndex])
      ) {
        continue
      }
      activePostFlushCbs[postFlushIndex]()
    }
    //【执行完毕后回复初始状态】
    activePostFlushCbs = null
    postFlushIndex = 0
  }
}
```

#### `flushJobs()`
该方法负责处理执行队列任务，主要逻辑如下：
1. 根据id给主队列中的任务进行排序
2. 遍历执行主队列任务
3. 执行完毕后清空并重置队列
4. 执行后置队列任务
```ts
let isFlushing = false //flushJobs中
let isFlushPending = false //queueFlush中

function flushJobs(seen?: CountMap) {
  isFlushPending = false
  isFlushing = true
  if (__DEV__) {
    seen = seen || new Map()
  }

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child so its render effect will have smaller
  //    priority number)
  // 2. If a component is unmounted during a parent component's update,
  //    its update can be skipped.
  //【排序保证了：组件更新先父后子(父组件的id小于子组件因为父组件先创建)，如果子组件unmount了话就无需执行update】
  queue.sort(comparator)

  // conditional usage of checkRecursiveUpdate must be determined out of
  // try ... catch block since Rollup by default de-optimizes treeshaking
  // inside try-catch. This can leave all warning code unshaked. Although
  // they would get eventually shaken by a minifier like terser, some minifiers
  // would fail to do that (e.g. https://github.com/evanw/esbuild/issues/1610)
  const check = __DEV__
    ? (job: SchedulerJob) => checkRecursiveUpdates(seen!, job)
    : NOOP

  //【遍历执行job，放在try、catch中执行】
  try {
    for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
      const job = queue[flushIndex]
      if (job && job.active !== false) {
        if (__DEV__ && check(job)) {
          continue
        }
        // console.log(`running:`, job.id)
        callWithErrorHandling(job, null, ErrorCodes.SCHEDULER)
      }
    }
  } finally {
    //【清空任务队列】
    flushIndex = 0
    queue.length = 0

    //【主任务队列执行完了，执行后置任务队列】
    flushPostFlushCbs(seen)

    isFlushing = false
    currentFlushPromise = null
    // some postFlushCb queued jobs!
    // keep flushing until it drains.
    //【如果中途又有jobs进入队列仍要继续执行清空掉】
    if (queue.length || pendingPostFlushCbs.length) {
      flushJobs(seen)
    }
  }
}
```
