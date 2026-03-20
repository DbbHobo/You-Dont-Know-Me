# diff算法

研究一下两大框架的核心`diff`算法，同层比较的部分，看看分别用了什么样的方式，有什么样的特点。`diff`算法的核心点在于判断是否有节点可复用需要移动，以及应该如何移动和寻找出那些需要被添加或移除的节点。

## Vue2的diff算法

关键词：**双端比较**

### Vue2的VNode

`Vue2`中的VNode类：

```js
export default class VNode {
  tag: string | void;
  data: VNodeData | void;
  children: ?Array<VNode>;
  text: string | void;
  elm: Node | void;
  ns: string | void;
  context: Component | void; // rendered in this component's scope
  key: string | number | void;
  componentOptions: VNodeComponentOptions | void;
  componentInstance: Component | void; // component instance
  parent: VNode | void; // component placeholder node

  // strictly internal
  raw: boolean; // contains raw HTML? (server only)
  isStatic: boolean; // hoisted static node
  isRootInsert: boolean; // necessary for enter transition check
  isComment: boolean; // empty comment placeholder?
  isCloned: boolean; // is a cloned node?
  isOnce: boolean; // is a v-once node?
  asyncFactory: Function | void; // async component factory function
  asyncMeta: Object | void;
  isAsyncPlaceholder: boolean;
  ssrContext: Object | void;
  fnContext: Component | void; // real context vm for functional nodes
  fnOptions: ?ComponentOptions; // for SSR caching
  fnScopeId: ?string; // functional scope id support

  constructor (
    tag?: string,
    data?: VNodeData,
    children?: ?Array<VNode>,
    text?: string,
    elm?: Node,
    context?: Component,
    componentOptions?: VNodeComponentOptions,
    asyncFactory?: Function
  ) {
    this.tag = tag
    this.data = data
    this.children = children
    this.text = text
    this.elm = elm
    this.ns = undefined
    this.context = context
    this.fnContext = undefined
    this.fnOptions = undefined
    this.fnScopeId = undefined
    this.key = data && data.key
    this.componentOptions = componentOptions
    this.componentInstance = undefined
    this.parent = undefined
    this.raw = false
    this.isStatic = false
    this.isRootInsert = true
    this.isComment = false
    this.isCloned = false
    this.isOnce = false
    this.asyncFactory = asyncFactory
    this.asyncMeta = undefined
    this.isAsyncPlaceholder = false
  }

  // DEPRECATED: alias for componentInstance for backwards compat.
  /* istanbul ignore next */
  get child (): Component | void {
    return this.componentInstance
  }
}
```

`Vue2` 中区分 `VNode` 是 `html` 元素还是组件亦或是普通文本，是这样做的：

1. 拿到 `VNode` 后先尝试把它当作组件去处理，如果成功地创建了组件，那说明该 `VNode` 就是组件的 `VNode`
2. 如果没能成功地创建组件，则检查 `vnode.tag` 是否有定义，如果有定义则当作普通标签处理
3. 如果 `vnode.tag` 没有定义则检查是否是注释节点
4. 如果不是注释节点，则会把它当作文本节点对待

以上这些判断都是在 `mount` 或 `patch` 阶段进行的，换句话说，一个 `VNode` 到底描述的是什么是在 `mount` 或 `patch` 的时候才知道的。这就带来了两个难题：无法从 AOT 的层面优化、开发者无法手动优化。

### Vue2中判断是否相同节点

```js
function sameVnode(a, b) {
  return (
    a.key === b.key &&
    ((a.tag === b.tag &&
      a.isComment === b.isComment &&
      isDef(a.data) === isDef(b.data) &&
      sameInputType(a, b)) ||
      (isTrue(a.isAsyncPlaceholder) &&
        a.asyncFactory === b.asyncFactory &&
        isUndef(b.asyncFactory.error)))
  );
}
```

### Vue2的diff核心算法

`Vue2`中采用的是**双端比较**的方式，`diff`算法核心代码如下：

```js
function updateChildren(
    parentElm,
    oldCh,
    newCh,
    insertedVnodeQueue,
    removeOnly
  ) {
    let oldStartIdx = 0;
    let newStartIdx = 0;
    let oldEndIdx = oldCh.length - 1;
    let newEndIdx = newCh.length - 1;

    let oldStartVnode = oldCh[0];
    let oldEndVnode = oldCh[oldEndIdx];
    let newStartVnode = newCh[0];
    let newEndVnode = newCh[newEndIdx];
    let oldKeyToIdx, idxInOld, vnodeToMove, refElm;

    // removeOnly is a special flag used only by <transition-group>
    // to ensure removed elements stay in correct relative positions
    // during leaving transitions
    const canMove = !removeOnly;

    if (process.env.NODE_ENV !== "production") {
      checkDuplicateKeys(newCh);
    }

    //【新旧节点序列都还没遍历完】
    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        //【头旧节点是undefined情况，说明前面的步骤此节点被复用已被置为undefined，看下一个节点】
        oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
      } else if (isUndef(oldEndVnode)) {
        //【尾旧节点是undefined情况，说明前面的步骤此节点被复用已被置为undefined，看前一个节点】
        oldEndVnode = oldCh[--oldEndIdx];
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        //【旧头和新头相同】
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
        oldStartVnode = oldCh[++oldStartIdx];
        newStartVnode = newCh[++newStartIdx];
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        //【旧尾和新尾相同】
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
        oldEndVnode = oldCh[--oldEndIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldStartVnode, newEndVnode)) {
        //【旧头和新尾相同，将旧头挪到旧序列的尾部】
        // Vnode moved right
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
        canMove &&
          nodeOps.insertBefore(
            parentElm,
            oldStartVnode.elm,
            nodeOps.nextSibling(oldEndVnode.elm)
          );
        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldEndVnode, newStartVnode)) {
        //【旧尾和新头相同，将旧尾挪到旧序列头部】
        // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
        canMove &&
          nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = newCh[++newStartIdx];
      } else {
        //【旧头尾和新头尾都不同，就从新节点序列的第一个开始寻找旧节点中是否存在可复用的旧节点】
        if (isUndef(oldKeyToIdx))
        //【给旧节点构造一个对象，key是旧节点的key，value是旧节点的索引】
          oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
        // 【如果key存在，寻找newStartVnode在旧节点的索引；否则，遍历旧节点序列通过sameVnode一一对比，寻找是否存在可复用的旧节点】
        idxInOld = isDef(newStartVnode.key)
          ? oldKeyToIdx[newStartVnode.key]
          : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);
        //【如果没找到可复用的旧节点，说明当前新节点需要重新创建】
        if (isUndef(idxInOld)) {
          // New element
          createElm(
            newStartVnode,
            insertedVnodeQueue,
            parentElm,
            oldStartVnode.elm,
            false,
            newCh,
            newStartIdx
          );
        } else {
          //【如果通过key找到了可能可以复用的旧节点vnodeToMove】
          vnodeToMove = oldCh[idxInOld];
          //【用sameVnode方法检查这个旧节点是否确实可以用】
          // function sameVnode(a, b) {
          //   return (
          //     a.key === b.key &&
          //     ((a.tag === b.tag &&
          //       a.isComment === b.isComment &&
          //       isDef(a.data) === isDef(b.data) &&
          //       sameInputType(a, b)) ||
          //       (isTrue(a.isAsyncPlaceholder) &&
          //         a.asyncFactory === b.asyncFactory &&
          //         isUndef(b.asyncFactory.error)))
          //   );
          // }
          if (sameVnode(vnodeToMove, newStartVnode)) {
            //【该旧节点可复用，但是需要移动到旧节点头部，并且将当前旧节点位置所在节点设为undefined，后续遍历遇到这个undefined说明此节点已被复用，则直接挪动指针去下一个节点】
            patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue);
            oldCh[idxInOld] = undefined;
            canMove &&
              nodeOps.insertBefore(
                parentElm,
                vnodeToMove.elm,
                oldStartVnode.elm
              );
          } else {
            //【该旧节点不可复用，仅仅是key相同，那就创建新节点】
            // same key but different element. treat as new element
            createElm(
              newStartVnode,
              insertedVnodeQueue,
              parentElm,
              oldStartVnode.elm,
              false,
              newCh,
              newStartIdx
            );
          }
        }
        newStartVnode = newCh[++newStartIdx];
      }
    }
    if (oldStartIdx > oldEndIdx) {
      refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
      addVnodes(
        parentElm,
        refElm,
        newCh,
        newStartIdx,
        newEndIdx,
        insertedVnodeQueue
      );
    } else if (newStartIdx > newEndIdx) {
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
    }
}
```

---

## Vue3的diff算法

关键词：**最长递增子序列**

### Vue3的VNode

`Vue3`中的VNode类：

```ts
const vnode = {
    __v_isVNode: true,
    __v_skip: true,
    type,
    props,
    key: props && normalizeKey(props),
    ref: props && normalizeRef(props),
    scopeId: currentScopeId,
    slotScopeIds: null,
    children,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag,
    patchFlag,
    dynamicProps,
    dynamicChildren: null,
    appContext: null
} as VNode
```

**`patchFlags`**：

```ts
export const enum PatchFlags {
  /**
   * Indicates an element with dynamic textContent (children fast path)
   */
  TEXT = 1,

  /**
   * Indicates an element with dynamic class binding.
   */
  CLASS = 1 << 1,

  /**
   * Indicates an element with dynamic style
   * The compiler pre-compiles static string styles into static objects
   * + detects and hoists inline static objects
   * e.g. `style="color: red"` and `:style="{ color: 'red' }"` both get hoisted
   * as:
   * ```js
   * const style = { color: 'red' }
   * render() { return e('div', { style }) }
   * ```
   */
  STYLE = 1 << 2,

  /**
   * Indicates an element that has non-class/style dynamic props.
   * Can also be on a component that has any dynamic props (includes
   * class/style). when this flag is present, the vnode also has a dynamicProps
   * array that contains the keys of the props that may change so the runtime
   * can diff them faster (without having to worry about removed props)
   */
  PROPS = 1 << 3,

  /**
   * Indicates an element with props with dynamic keys. When keys change, a full
   * diff is always needed to remove the old key. This flag is mutually
   * exclusive with CLASS, STYLE and PROPS.
   */
  FULL_PROPS = 1 << 4,

  /**
   * Indicates an element with event listeners (which need to be attached
   * during hydration)
   */
  HYDRATE_EVENTS = 1 << 5,

  /**
   * Indicates a fragment whose children order doesn't change.
   */
  STABLE_FRAGMENT = 1 << 6,

  /**
   * Indicates a fragment with keyed or partially keyed children
   */
  KEYED_FRAGMENT = 1 << 7,

  /**
   * Indicates a fragment with unkeyed children.
   */
  UNKEYED_FRAGMENT = 1 << 8,

  /**
   * Indicates an element that only needs non-props patching, e.g. ref or
   * directives (onVnodeXXX hooks). since every patched vnode checks for refs
   * and onVnodeXXX hooks, it simply marks the vnode so that a parent block
   * will track it.
   */
  NEED_PATCH = 1 << 9,

  /**
   * Indicates a component with dynamic slots (e.g. slot that references a v-for
   * iterated value, or dynamic slot names).
   * Components with this flag are always force updated.
   */
  DYNAMIC_SLOTS = 1 << 10,

  /**
   * Indicates a fragment that was created only because the user has placed
   * comments at the root level of a template. This is a dev-only flag since
   * comments are stripped in production.
   */
  DEV_ROOT_FRAGMENT = 1 << 11,

  /**
   * SPECIAL FLAGS -------------------------------------------------------------
   * Special flags are negative integers. They are never matched against using
   * bitwise operators (bitwise matching should only happen in branches where
   * patchFlag > 0), and are mutually exclusive. When checking for a special
   * flag, simply check patchFlag === FLAG.
   */

  /**
   * Indicates a hoisted static vnode. This is a hint for hydration to skip
   * the entire sub tree since static content never needs to be updated.
   */
  HOISTED = -1,
  /**
   * A special flag that indicates that the diffing algorithm should bail out
   * of optimized mode. For example, on block fragments created by renderSlot()
   * when encountering non-compiler generated slots (i.e. manually written
   * render functions, which should always be fully diffed)
   * OR manually cloneVNodes
   */
  BAIL = -2
}
/**
 * dev only flag -> name mapping
 */
export const PatchFlagNames = {
  [PatchFlags.TEXT]: `TEXT`,
  [PatchFlags.CLASS]: `CLASS`,
  [PatchFlags.STYLE]: `STYLE`,
  [PatchFlags.PROPS]: `PROPS`,
  [PatchFlags.FULL_PROPS]: `FULL_PROPS`,
  [PatchFlags.HYDRATE_EVENTS]: `HYDRATE_EVENTS`,
  [PatchFlags.STABLE_FRAGMENT]: `STABLE_FRAGMENT`,
  [PatchFlags.KEYED_FRAGMENT]: `KEYED_FRAGMENT`,
  [PatchFlags.UNKEYED_FRAGMENT]: `UNKEYED_FRAGMENT`,
  [PatchFlags.NEED_PATCH]: `NEED_PATCH`,
  [PatchFlags.DYNAMIC_SLOTS]: `DYNAMIC_SLOTS`,
  [PatchFlags.DEV_ROOT_FRAGMENT]: `DEV_ROOT_FRAGMENT`,
  [PatchFlags.HOISTED]: `HOISTED`,
  [PatchFlags.BAIL]: `BAIL`
}
```

**`shapeFlags`**：

```ts
export const enum ShapeFlags {
  ELEMENT = 1,  // html 和 svg 都是标签元素，可以用 ELEMENT 表示
  FUNCTIONAL_COMPONENT = 1 << 1,  // 函数式组件
  STATEFUL_COMPONENT = 1 << 2,  // 普通有状态组件
  TEXT_CHILDREN = 1 << 3,
  ARRAY_CHILDREN = 1 << 4,
  SLOTS_CHILDREN = 1 << 5,
  TELEPORT = 1 << 6,
  SUSPENSE = 1 << 7,
  COMPONENT_SHOULD_KEEP_ALIVE = 1 << 8,// 需要被keepAlive的有状态组件 
  COMPONENT_KEPT_ALIVE = 1 << 9,  // 已经被keepAlice的有状态组件
  COMPONENT = ShapeFlags.STATEFUL_COMPONENT | ShapeFlags.FUNCTIONAL_COMPONENT
  // “有状态组件”，统一用 COMPONENT_STATEFUL 表示
}
```

一个`VNode`实例：

```json
{
    "__v_isVNode": true,
    "__v_skip": true,
    "type": {
        "directives": {},
        "template": "\n  <section class=\"todoapp\">\n    <header class=\"header\">\n      <h1>todos{{ count.num }}</h1>\n      <input class=\"new-todo\" autofocus=\"\" autocomplete=\"off\" placeholder=\"What needs to be done?\" v-model=\"state.newTodo\" @keyup.enter=\"addTodo\">\n    </header>\n    <section class=\"main\" v-show=\"state.todos.length\">\n      <input id=\"toggle-all\" class=\"toggle-all\" type=\"checkbox\" v-model=\"state.allDone\">\n      <label for=\"toggle-all\">Mark all as complete</label>\n      <ul class=\"todo-list\">\n        <li v-for=\"todo in state.filteredTodos\" class=\"todo\" :key=\"todo.id\" :class=\"{ completed: todo.completed, editing: todo === state.editedTodo }\">\n          <div class=\"view\">\n            <input class=\"toggle\" type=\"checkbox\" v-model=\"todo.completed\">\n            <label @dblclick=\"editTodo(todo)\">{{ todo.title }}</label>\n            <button class=\"destroy\" @click=\"removeTodo(todo)\"></button>\n          </div>\n          <input class=\"edit\" type=\"text\" v-model=\"todo.title\" v-todo-focus=\"todo === state.editedTodo\" @blur=\"doneEdit(todo)\" @keyup.enter=\"doneEdit(todo)\" @keyup.escape=\"cancelEdit(todo)\">\n        </li>\n      </ul>\n    </section>\n    <footer class=\"footer\" v-show=\"state.todos.length\">\n        <span class=\"todo-count\">\n          <strong>{{ state.remaining }}</strong>\n          <span>{{ state.remainingText }}</span>\n        </span>\n      <ul class=\"filters\">\n        <li><a href=\"#/all\" :class=\"{ selected: state.visibility === 'all' }\">All</a></li>\n        <li><a href=\"#/active\" :class=\"{ selected: state.visibility === 'active' }\">Active</a></li>\n        <li><a href=\"#/completed\" :class=\"{ selected: state.visibility === 'completed' }\">Completed</a></li>\n      </ul>\n\n      <button class=\"clear-completed\" @click=\"removeCompleted\" v-show=\"state.todos.length > state.remaining\">\n        Clear completed\n      </button>\n    </footer>\n  </section>\n"
    },
    "props": null,
    "key": null,
    "ref": null,
    "scopeId": null,
    "slotScopeIds": null,
    "children": null,
    "component": null,
    "suspense": null,
    "ssContent": null,
    "ssFallback": null,
    "dirs": null,
    "transition": null,
    "el": null,
    "anchor": null,
    "target": null,
    "targetAnchor": null,
    "staticCount": 0,
    "shapeFlag": 4,
    "patchFlag": 0,
    "dynamicProps": null,
    "dynamicChildren": null,
    "appContext": null
}
```

### Vue3中判断是否相同节点

```ts
export function isSameVNodeType(n1: VNode, n2: VNode): boolean {
  if (
    __DEV__ &&
    n2.shapeFlag & ShapeFlags.COMPONENT &&
    hmrDirtyComponents.has(n2.type as ConcreteComponent)
  ) {
    // HMR only: if the component has been hot-updated, force a reload.
    return false
  }
  return n1.type === n2.type && n1.key === n2.key
}
```

### Vue3的diff核心算法

`Vue3`中diff算法核心代码如下：

```ts
const patchKeyedChildren = (
    c1: VNode[],
    c2: VNodeArrayChildren,
    container: RendererElement,
    parentAnchor: RendererNode | null,
    parentComponent: ComponentInternalInstance | null,
    parentSuspense: SuspenseBoundary | null,
    isSVG: boolean,
    slotScopeIds: string[] | null,
    optimized: boolean
  ) => {
    let i = 0
    const l2 = c2.length
    let e1 = c1.length - 1 // prev ending index
    let e2 = l2 - 1 // next ending index

    // 1. sync from start
    // (a b) c
    // (a b) d e
    while (i <= e1 && i <= e2) {
      const n1 = c1[i]
      const n2 = (c2[i] = optimized
        ? cloneIfMounted(c2[i] as VNode)
        : normalizeVNode(c2[i]))
      if (isSameVNodeType(n1, n2)) {
        patch(
          n1,
          n2,
          container,
          null,
          parentComponent,
          parentSuspense,
          isSVG,
          slotScopeIds,
          optimized
        )
      } else {
        break
      }
      i++
    }

    // 2. sync from end
    // a (b c)
    // d e (b c)
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1]
      const n2 = (c2[e2] = optimized
        ? cloneIfMounted(c2[e2] as VNode)
        : normalizeVNode(c2[e2]))
      if (isSameVNodeType(n1, n2)) {
        patch(
          n1,
          n2,
          container,
          null,
          parentComponent,
          parentSuspense,
          isSVG,
          slotScopeIds,
          optimized
        )
      } else {
        break
      }
      e1--
      e2--
    }

    // 3. common sequence + mount
    // (a b)
    // (a b) c
    // i = 2, e1 = 1, e2 = 2
    // (a b)
    // c (a b)
    // i = 0, e1 = -1, e2 = 0
    if (i > e1) {
      if (i <= e2) {
        const nextPos = e2 + 1
        const anchor = nextPos < l2 ? (c2[nextPos] as VNode).el : parentAnchor
        while (i <= e2) {
          patch(
            null,
            (c2[i] = optimized
              ? cloneIfMounted(c2[i] as VNode)
              : normalizeVNode(c2[i])),
            container,
            anchor,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized
          )
          i++
        }
      }
    }

    // 4. common sequence + unmount
    // (a b) c
    // (a b)
    // i = 2, e1 = 2, e2 = 1
    // a (b c)
    // (b c)
    // i = 0, e1 = 0, e2 = -1
    else if (i > e2) {
      while (i <= e1) {
        unmount(c1[i], parentComponent, parentSuspense, true)
        i++
      }
    }

    // 5. unknown sequence
    // [i ... e1 + 1]: a b [c d e] f g
    // [i ... e2 + 1]: a b [e d c h] f g
    // i = 2, e1 = 4, e2 = 5
    else {
      const s1 = i // prev starting index
      const s2 = i // next starting index

      // 5.1 build key:index map for newChildren
      const keyToNewIndexMap: Map<string | number | symbol, number> = new Map()
      for (i = s2; i <= e2; i++) {
        const nextChild = (c2[i] = optimized
          ? cloneIfMounted(c2[i] as VNode)
          : normalizeVNode(c2[i]))
        if (nextChild.key != null) {
          if (__DEV__ && keyToNewIndexMap.has(nextChild.key)) {
            warn(
              `Duplicate keys found during update:`,
              JSON.stringify(nextChild.key),
              `Make sure keys are unique.`
            )
          }
          keyToNewIndexMap.set(nextChild.key, i)
        }
      }

      // 5.2 loop through old children left to be patched and try to patch
      // matching nodes & remove nodes that are no longer present
      let j
      let patched = 0
      const toBePatched = e2 - s2 + 1
      let moved = false
      // used to track whether any node has moved
      let maxNewIndexSoFar = 0
      // works as Map<newIndex, oldIndex>
      // Note that oldIndex is offset by +1
      // and oldIndex = 0 is a special value indicating the new node has
      // no corresponding old node.
      // used for determining longest stable subsequence
      const newIndexToOldIndexMap = new Array(toBePatched)
      for (i = 0; i < toBePatched; i++) newIndexToOldIndexMap[i] = 0

      for (i = s1; i <= e1; i++) {
        const prevChild = c1[i]
        if (patched >= toBePatched) {
          // all new children have been patched so this can only be a removal
          unmount(prevChild, parentComponent, parentSuspense, true)
          continue
        }
        let newIndex
        if (prevChild.key != null) {
          newIndex = keyToNewIndexMap.get(prevChild.key)
        } else {
          // key-less node, try to locate a key-less node of the same type
          for (j = s2; j <= e2; j++) {
            if (
              newIndexToOldIndexMap[j - s2] === 0 &&
              isSameVNodeType(prevChild, c2[j] as VNode)
            ) {
              newIndex = j
              break
            }
          }
        }
        if (newIndex === undefined) {
          unmount(prevChild, parentComponent, parentSuspense, true)
        } else {
          newIndexToOldIndexMap[newIndex - s2] = i + 1
          if (newIndex >= maxNewIndexSoFar) {
            maxNewIndexSoFar = newIndex
          } else {
            moved = true
          }
          patch(
            prevChild,
            c2[newIndex] as VNode,
            container,
            null,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized
          )
          patched++
        }
      }

      // 5.3 move and mount
      // generate longest stable subsequence only when nodes have moved
      const increasingNewIndexSequence = moved
        ? getSequence(newIndexToOldIndexMap)
        : EMPTY_ARR
      j = increasingNewIndexSequence.length - 1
      // looping backwards so that we can use last patched node as anchor
      for (i = toBePatched - 1; i >= 0; i--) {
        const nextIndex = s2 + i
        const nextChild = c2[nextIndex] as VNode
        const anchor =
          nextIndex + 1 < l2 ? (c2[nextIndex + 1] as VNode).el : parentAnchor
        if (newIndexToOldIndexMap[i] === 0) {
          // mount new
          patch(
            null,
            nextChild,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized
          )
        } else if (moved) {
          // move if:
          // There is no stable subsequence (e.g. a reverse)
          // OR current node is not among the stable sequence
          if (j < 0 || i !== increasingNewIndexSequence[j]) {
            move(nextChild, container, anchor, MoveType.REORDER)
          } else {
            j--
          }
        }
      }
    }
}
```

1. 预处理头部所有相同的节点，直接`patch`，无需进入`diff`流程
2. 预处理尾部所有相同的节点，直接`patch`，无需进入`diff`流程
3. 需要增加节点的情况，遍历完旧节点，新节点还剩下内容，也就是需要插入的节点
4. 需要删除节点的情况，遍历完新节点，旧节点还剩下内容，也就是需要删除的节点
5. 包含新增、删除、移动等多种情况的序列
  
  5-1. 首先为新节点建一个`keyToNewIndexMap`的Map用于存储【新节点key，新节点的索引】这样的一个结构
  
  5-2. 新建一个`newIndexToOldIndexMap`的Array长度等于剩余需要`patch`节点个数(去掉可复用的头尾部)，存储的是【旧节点（在新节点能找到复用的）在新节点序列中的索引】，并且判断旧节点序列是否需要移动操作，如果索引是完全递增的代表不需要移动，否则就是需要
  
  5-3. 找出`newIndexToOldIndexMap`中的最长递增子序列，这个序列是所有不需要移动的节点，剩下的节点就是需要移动的或者新增的，然后进行移动和新增操作


---

## React的diff算法

关键词：**与最大索引比较**
React的VNode节点组织结构不同于Vue，兄弟节点并非放在数组中，而是用sibling指针串联。同层比较的时候只能从前往后比较。细节见React源码解读。
<!-- 【TODO：看一下react的diff算法】 -->

## diff算法的比较和分析

- Vue3 对于 Vue2 的改进点在于，在 `VNode` 创建的时候就把该 `VNode` 的是否需要比较等特性通过 `patchFlags` 标明，这样在挂载或更新阶段通过 `patchFlags` 可以直接避免掉很多消耗性能的判断。
- Vue3 采用了**最长递增子序列**算法，规划了最多的可复用且无需挪动的节点，从而减少了节点挪动次数，增强了算法的效率。

## 参考资料

[A virtual DOM in 200 lines of JavaScript](https://lazamar.github.io/virtual-dom/)
