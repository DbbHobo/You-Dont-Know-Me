# CI/CD 流程

## CI/CD 概念

### 🎯 基本概念类

#### Q: CI/CD 分别指什么？主要解决什么问题？

A: CI（持续集成）指代码合并后自动构建、测试的流程，目的是快速发现问题并保证主干稳定性。CD（持续部署）指代码在通过测试后自动部署上线，确保发布流程自动化、可重复、快速稳定。

#### Q: 持续集成和持续部署的区别？

A: 持续集成强调代码集成频率和自动化测试，持续部署则进一步在通过测试后将构建产物自动部署到环境中。持续交付（Delivery）和持续部署的差别是后者包括了“上线”动作。

#### Q: 为什么前端项目也需要 CI/CD？

A: 前端项目构建流程复杂，包括代码构建、打包、部署、缓存控制、安全校验等步骤。CI/CD 能提升开发效率、减少人工操作失误、增强协作与质量保障。

### 🛠️ 实践应用类

#### Q: 你的项目使用了哪些 CI/CD 工具？为什么选择它？

A: 常用 GitHub Actions 和 GitLab CI。GitHub Actions 与 GitHub 仓库集成度高，适合开源项目；GitLab CI 在企业私有部署中使用广泛，权限控制强。

#### Q: CI 流程中你有哪些质量保障手段？

A: 包括：代码格式校验（ESLint）、类型检查（TypeScript）、单元测试（Jest/Vitest）、构建检查、依赖漏洞扫描等。

#### Q: CD 流程中你们是如何部署前端构建产物的？

A: 使用 GitHub Actions 构建产物后上传至 OSS（或 S3），然后刷新 CDN 缓存，使用 hash 文件名避免缓存污染。支持预发和正式环境的路径区分。

#### Q: 如何区分部署到预发布和生产环境？

A: 通过 CI 流程中环境变量区分：如 `DEPLOY_ENV=staging|production`，在构建脚本和上传路径中做分支控制。

#### Q: 是否做过灰度发布、蓝绿部署、回滚策略设计？

A: 做过灰度发布方案，使用 CDN 域名或 Cookie 分流方式进行流量控制。回滚策略包括构建版本备份、OSS 目录切换、自动降级脚本等。

### ⚙️ 工具与配置类

#### Q: 你了解 GitHub Actions 的运行机制吗？

A: GitHub Actions 使用 YAML 配置定义触发条件（如 push/pr）、job 阶段、runner 环境、执行脚本等，借助社区 Action 插件完成构建、部署等自动化任务。

#### Q: `.github/workflows` 的配置文件结构是怎样的？

A: 包括 `name`（流程名称）、`on`（触发事件）、`jobs`（任务定义，每个任务包含 `runs-on`、`steps`），每个 `step` 可以使用现成 Action 或执行 shell 命令。

#### Q: 如何优化 GitHub Actions 执行效率？

A: 可使用缓存机制（如 `actions/cache`）、pnpm 自动缓存依赖、按需触发构建（monorepo 变更检测），并使用 matrix 并行执行任务。

#### Q: 如何通过环境变量、密钥管理部署安全？

A: 敏感信息通过 GitHub Secrets 管理，在 workflow 中以 `${{ secrets.KEY }}` 形式引用。可设置权限范围、不同环境不同密钥隔离。

### 🔍 排查与优化类

#### Q: CI 构建失败你如何定位？

A: 通过 GitHub Actions 的日志追踪失败的步骤，特别是依赖安装、打包和测试阶段常见失败。必要时在本地复现构建逻辑定位问题。

#### Q: 如何缓存依赖加快构建速度？

A: 使用 `actions/setup-node` 内建缓存或手动 `actions/cache` 缓存 node_modules/pnpm-store。构建产物如 dist 也可缓存多阶段构建。

#### Q: 是否支持 monorepo 多子项目的独立部署？

A: 支持。可使用 `pnpm --filter` 检测变更子项目，按需构建并部署，提高效率，避免重复部署未修改的子包。

---

## 持续集成、持续部署

**CI 阶段（持续集成）**

使用 GitHub Actions 或 GitLab CI 进行自动化流程。

触发时机：PR 合并或 push 到主分支。

主要阶段包括：

- 代码规范检查（Lint、Prettier）；
- 单元测试（Vitest/Jest）；
- 代码覆盖率统计并上传（如 coveralls）；
- 构建产物校验（确保打包无误）。

**CD 阶段（持续部署）**

- 对 main 分支的构建产物自动上传到 CDN（如阿里云 OSS、七牛、S3）；
- 部署完成后自动刷新 CDN 缓存，确保最新资源可用；
- 通过环境变量（如 GitHub Secrets）区分和控制不同部署环境（预发/生产）；
- 灰度发布时自动打 tag，并通过 GitHub Release 发布对应版本，便于追踪和回滚；
- 部署失败时自动通知（如 Slack/企业微信），并支持一键回滚到历史构建版本。

下面是一个自定义 `GitHub Actions` 模板（含 `monorepo` 支持）：

```yaml
name: Monorepo Frontend CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  changed-packages:
    runs-on: ubuntu-latest
    outputs:
      changed: ${{ steps.set.outputs.changed }}

    steps:
      - uses: actions/checkout@v3

      - name: Detect changed packages
        id: set
        run: |
          changed=$(pnpm --filter ... changed)
          echo "changed=$changed" >> $GITHUB_OUTPUT

  build-and-deploy:
    needs: changed-packages
    runs-on: ubuntu-latest
    if: needs.changed-packages.outputs.changed != ''

    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: "pnpm"

      - name: Install dependencies
        run: pnpm install

      - name: Build only changed packages
        run: pnpm -r --filter [changed-packages] build

      - name: Upload to OSS
        run: npx oss-upload ./dist
        env:
          OSS_KEY: ${{ secrets.OSS_KEY }}
          OSS_SECRET: ${{ secrets.OSS_SECRET }}
```

---

## 实践

- 产物 `hash` 命名：避免 CDN 缓存问题；
- 自动 `CDN` 刷新：部署完成后调用阿里云刷新接口；
- 版本控制：可以生成 `release.json` 记录当前构建 hash；
- 灰度部署支持：可设灰度 bucket 或用 CDN A/B 流量切分；
- 失败回滚策略：保存旧构建版本至 OSS 特定目录，紧急回退。

### 自定义部署工具：oss-upload（可发布为 CLI）

```ts
// oss-upload.ts（可使用 ali-oss）
import OSS from "ali-oss"
import glob from "fast-glob"

const client = new OSS({
  region: "oss-cn-shanghai",
  accessKeyId: process.env.OSS_KEY!,
  accessKeySecret: process.env.OSS_SECRET!,
  bucket: "your-bucket-name",
})

async function uploadAll(localDir: string) {
  const files = await glob(`${localDir}/**/*.*`)
  for (const file of files) {
    const remotePath = file.replace(`${localDir}/`, "")
    await client.put(remotePath, file)
    console.log(`✅ Uploaded: ${remotePath}`)
  }
}

uploadAll("./dist")
```

### 多环境部署切换策略

可通过环境变量 + CI 参数区分部署环境：

```yaml
env:
  NODE_ENV: production
  DEPLOY_ENV: staging # or production
```

并在 `oss-upload` 中读取 ENV 决定上传路径：

```ts
const env = process.env.DEPLOY_ENV || "staging"
const remotePrefix = env === "production" ? "prod/" : "staging/"
await client.put(`${remotePrefix}${remotePath}`, file)
```

### CDN 缓存刷新机制

部署完成后调用 CDN API：

```ts
import { RefreshObjectCachesRequest } from "@alicloud/cdn20180510"

const client = new CdnClient({
  accessKeyId: "xxx",
  accessKeySecret: "xxx",
})

await client.refreshObjectCaches(
  new RefreshObjectCachesRequest({
    ObjectPath: "https://cdn.xxx.com/prod/*",
    ObjectType: "Directory",
  })
)
```

### 灰度发布 A/B 流量方案

使用阿里云 CDN 的访问规则或流量分流策略，将部分请求转发到灰度 bucket，例如：

- 设置 `灰度CDN域名`，绑定灰度目录，如 `gray.xxx.com` ➝ `oss://your-bucket/gray/`
- 在业务系统或测试用户中切换该域名进行灰度访问
- 验证无误后，再替换正式 CDN 路由

或使用 CDN 分流规则基于 `User-Agent/Cookie` 分流。

## 参考资料

[Use GitHub Actions to Deploy to Vercel (Preview & Production Deployments)](https://www.youtube.com/watch?v=FHVaWZjWec4)

[CI/CD Explained: The DevOps Skill That Makes You 10x More Valuable](https://www.youtube.com/watch?v=AknbizcLq4w)

[GitHub Actions Tutorial - Basic Concepts and CI/CD Pipeline with Docker](https://www.youtube.com/watch?v=R8_veQiYBjI)
