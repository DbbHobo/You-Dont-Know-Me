# 包管理器一览

## npm

包管理器和`package.json`息息相关，我们来拿一个开发中很常见的`package.json`为例来看一下：

```json
{
  "name": "vue-demo",
  "version": "0.1.0",
  "description": "demo",
  "private": true,
  "scripts": {
    "serve": "vue-cli-service serve",
    "build": "vue-cli-service build",
    "lint": "vue-cli-service lint"
  },
  "dependencies": {
    "core-js": "^2.6.5",
    "vue": "^2.6.10",
    "vue-router": "^3.0.3",
    "vuex": "^3.0.1"
  },
  "devDependencies": {
    "@vue/cli-plugin-babel": "^3.1.1",
    "@vue/cli-plugin-eslint": "^3.1.1",
    "@vue/cli-service": "^3.1.1",
    "@vue/eslint-config-prettier": "^5.0.0",
    "babel-eslint": "^10.0.1",
    "clean-webpack-plugin": "^4.0.0",
    "eslint": "^5.16.0",
    "eslint-plugin-prettier": "^3.1.0",
    "eslint-plugin-vue": "^5.0.0",
    "hot-hash-webpack-plugin": "^1.0.2",
    "less": "^3.0.4",
    "less-loader": "^5.0.0",
    "prettier": "^1.18.2",
    "style-resources-loader": "^1.5.0",
    "vue-template-compiler": "^2.6.10",
    "webpackbar": "^5.0.2"
  }
}
```

- `name`: name of the project
- `version`: The current version of the project
- `description`: The description of the project
- `main`: Specifies the file that is the main entry point of your project
- `scripts`: This includes the command associated with your project like the command for building, running, or testing the project
- `dependencies`: This is where all the required packages are listed that are required to run the project. These are installed in your system using npm install
- `devDependencies`: This contains the modules that are required only during the development not in the production
- `repository`: Specifies the type of version control we are using and the url of the repository
- `keywords`: These are the array of strings that contain the keywords of the projects that help people discover the project
- `author`: The name of the author of the project
- `license`: the license type of the project

### npm基础配置

Every project in JavaScript – whether it's `Node.js` or a browser application – can be scoped as an npm package with its own package information and its package.json job to describe the project.

- `name`: the name of your JavaScript library/project
- `version`: the version of your project. Often times, for application development, this field is often neglected as there's no apparent need for versioning opensource - libraies. But still, it can come handy as a source of the deployment's version.
- `description`: the project's description
- `license`: the project's license

### scripts

`package.json` also supports a scripts property that can be defined to run command-line tools that are installed in the project's local context. For example, the scripts portion of an npm project can look something like this:

```json
{
  "scripts": {
    "build": "tsc",
    "format": "prettier --write **/*.ts",
    "format-check": "prettier --check **/*.ts",
    "lint": "eslint src/**/*.ts",
    "pack": "ncc build",
    "test": "jest",
    "all": "npm run build && npm run format && npm run lint && npm run pack && npm test"
  }
}
```

with `eslint`, `prettier`, `ncc`, `jest` not necessarily installed as global executables but rather as local to your project inside `node_modules/.bin/.`

The recent introduction of `npx` allows us to run these `node_modules` project-scoped commands just like a globally installed program by prefixing `npx ...` (i.e. `npx prettier --write **/*.ts`).

### dependencies & devDependencies

These two come in form of key-value objects with npm libraries' names as the key and their semantic-formatted versions as the value. This is an example from Github's TypeScript Action template:

```json
{
  "dependencies": {
    "@actions/core": "^1.2.3",
    "@actions/github": "^2.1.1"
  },
  "devDependencies": {
    "@types/jest": "^25.1.4",
    "@types/node": "^13.9.0",
    "@typescript-eslint/parser": "^2.22.0",
    "@zeit/ncc": "^0.21.1",
    "eslint": "^6.8.0",
    "eslint-plugin-github": "^3.4.1",
    "eslint-plugin-jest": "^23.8.2",
    "jest": "^25.1.0",
    "jest-circus": "^25.1.0",
    "js-yaml": "^3.13.1",
    "prettier": "^1.19.1",
    "ts-jest": "^25.2.1",
    "typescript": "^3.8.3"
  }
}
```

These dependencies are installed via the `npm install` command with `--save` and `--save-dev` flags. They're meant to be used for `production` and `development/test` environments respectively.

Meanwhile, it's important to understand the possible signs that come before the semantic versions (assuming you have read up on major.minor.patch model of semver):

- `^`: latest minor release. For example, a ^1.0.4 specification might install version 1.3.0 if that's the latest minor version in the 1 major series.
- `~`: latest patch release. In the same way as ^ for minor releases, ~1.0.4 specification might install version 1.0.7 if that's the latest minor version in the 1.0 minor series.

All of these exact package versions will be documented in a generated `package-lock.json` file.

### package-lock.json

This file describes the **exact versions** of the dependencies used in an npm JavaScript project. If `package.json` is a generic descriptive label, `package-lock.json` is an ingredient table.

And just like how we don't usually read the ingredient table of a product (unless you are too bored or need to know), `package-lock.json` is not meant to be read line-by-line by developers (unless we're desperate to resolve "works in my machine" issues).

`package-lock.json` is usually generated by the `npm install` command, and is also read by our NPM CLI tool to ensure reproduction of build environments for the project with npm ci.

## npm 命令

```shell
npm root -g
# 查看npm全局安装的包位置
pnpm store path
# 查看pnpm全局安装的包位置

npm i
# Alias for npm install
npm install
# Install everything in package.json
npm install --production
# Install everything in package.json, except devDependecies

npm install lodash
# Install a package
npm install --save-dev lodash
# Install as devDependency
npm install --save-exact lodash
# Install with exact

npm update
# Update production packages
npm update --dev
# Update dev packages
npm update -g
# Update global packages
npm update lodash
# Update a package

npm rm lodash
# Remove package production packages
```

### npm install

This is the most commonly used command as we develop `JavaScript`/`Node.js` applications nowadays.

By default, `npm install <package-name>` will install the latest version of a package with the `^` version sign. An `npm install` within the context of an npm project will download packages into the project's `node_modules` folder according to `package.json` specifications, upgrading the package version (and in turn regenerating `package-lock.json`) wherever it can based on `^` and `~` version matching.

You can specify a global flag `-g` if you want to install a package in the global context which you can use anywhere across your machine (this is common for command-line tooling packages like live-server).

`npm` has made installing JavaScript packages so easy that this command is often used incorrectly. This results in npm being the butt of a lot of programmers' jokes like these:

#### npm install 模块安装机制

1. 发出`npm install`命令
2. 查询`node_modules`目录之中是否已经存在指定模块

  - 若存在，不再重新安装
  - 若不存在
    - `npm` 向 `registry` 查询模块压缩包的网址
    - 下载压缩包，存放在根目录下的`.npm`目录里
    - 解压压缩包到当前项目的`node_modules`目录

#### npm install 实现原理

输入 `npm install` 命令并敲下回车后，会经历如下几个阶段（以 npm 5.5.1 为例）：

1. 执行工程自身 `preinstall`

当前 npm 工程如果定义了 `preinstall` 钩子此时会被执行。

2. 确定首层依赖模块

首先需要做的是确定工程中的首层依赖，也就是 `dependencies` 和 `devDependencies` 属性中直接指定的模块（假设此时没有添加 npm install 参数）。

工程本身是整棵依赖树的根节点，每个首层依赖模块都是根节点下面的一棵子树，npm 会开启多进程从每个首层依赖模块开始逐步寻找更深层级的节点。

3. 获取模块

获取模块是一个递归的过程，分为以下几步：

获取模块信息。在下载一个模块之前，首先要确定其版本，这是因为 `package.json` 中往往是 semantic version（semver，语义化版本）。此时如果版本描述文件（npm-shrinkwrap.json 或 package-lock.json）中有该模块信息直接拿即可，如果没有则从仓库获取。如 `packaeg.json` 中某个包的版本是 ^1.1.0，npm 就会去仓库中获取符合 1.x.x 形式的最新版本。

获取模块实体。上一步会获取到模块的压缩包地址（resolved 字段），npm 会用此地址检查本地缓存，缓存中有就直接拿，如果没有则从仓库下载。

查找该模块依赖，如果有依赖则回到第1步，如果没有则停止。

4. 模块扁平化（dedupe）

上一步获取到的是一棵完整的依赖树，其中可能包含大量重复模块。比如 A 模块依赖于 loadsh，B 模块同样依赖于 lodash。在 npm3 以前会严格按照依赖树的结构进行安装，因此会造成模块冗余。

从 npm3 开始默认加入了一个 dedupe 的过程。它会遍历所有节点，逐个将模块放在根节点下面，也就是 node-modules 的第一层。当发现有重复模块时，则将其丢弃。

这里需要对重复模块进行一个定义，它指的是模块名相同且 semver 兼容。每个 semver 都对应一段版本允许范围，如果两个模块的版本允许范围存在交集，那么就可以得到一个兼容版本，而不必版本号完全一致，这可以使更多冗余模块在 dedupe 过程中被去掉。

比如 node-modules 下 foo 模块依赖 lodash@^1.0.0，bar 模块依赖 lodash@^1.1.0，则 ^1.1.0 为兼容版本。

而当 foo 依赖 lodash@^2.0.0，bar 依赖 lodash@^1.1.0，则依据 semver 的规则，二者不存在兼容版本。会将一个版本放在 node_modules 中，另一个仍保留在依赖树里。

举个例子，假设一个依赖树原本是这样：

node_modules
-- foo
---- lodash@version1

-- bar
---- lodash@version2

假设 version1 和 version2 是兼容版本，则经过 dedupe 会成为下面的形式：

node_modules
-- foo

-- bar

-- lodash（保留的版本为兼容版本）

假设 version1 和 version2 为非兼容版本，则后面的版本保留在依赖树中：

node_modules
-- foo
-- lodash@version1

-- bar
---- lodash@version2

5. 安装模块

这一步将会更新工程中的 `node_modules`，并执行模块中的生命周期函数（按照 `preinstall`、`install`、`postinstall` 的顺序）。

6. 执行工程自身生命周期

当前 npm 工程如果定义了钩子此时会被执行（按照 `install`、`postinstall`、`prepublish`、`prepare` 的顺序）。

最后一步是生成或更新版本描述文件，`npm install` 过程完成。

### npm publish

Sending a package to our `npmjs.com` fulfillment centre is super easy as we only need to run `npm publish`. The tricky part, which is not specific to npm package authors, is determining the version of the package.

The rule of thumb according to semver.org:

- MAJOR version when you make incompatible API changes,
- MINOR version when you add functionality in a backwards compatible manner, and
- PATCH version when you make backwards compatible bug fixes.

It's even more important to follow the above rule when publishing your packages to ensure that you're not breaking anyone's code as the default version matching in npm is `^`(aka the next minor version).

### npm run

通常我们知道，启动vue项目 `npm run serve` 的时候，实际上就是执行了 `vue-cli-service serve` 这条命令。因为操作系统中没有存在 `vue-cli-service` 这一条指令，直接执行 `vue-cli-service serve` 是会报错的。

我们在安装依赖的时候，是通过 `npm i xxx` 来执行的，例如 `npm i @vue/cli-service`，`npm` 在 安装这个依赖的时候，就会 `node_modules/.bin/` 目录中创建好`vue-cli-service` 为名的几个可执行文件了。

由此我们可以知道，当使用 `npm run serve` 执行 `vue-cli-service serve` 时，虽然没有安装 `vue-cli-service` 的全局命令，但是 `npm` 会到 `./node_modules/.bin` 中找到 `vue-cli-service` 文件作为脚本来执行，则相当于执行了 `./node_modules/.bin/vue-cli-service serve`， 最后的 `serve` 作为参数传入。

再看 `package-lock.json` 文件，当我们`npm i` 整个新建的`vue`项目的时候，`npm` 将 `bin/vue-cli-service.js` 作为 `bin` 声明了。所以在 `npm install` 时，`npm` 读到该配置后，就将该文件软链接到 `./node_modules/.bin` 目录下，而 `npm` 还会自动把`node_modules/.bin`加入`$PATH`，这样就可以直接作为命令运行依赖程序和开发依赖程序，不用全局安装了。`$PATH`环境变量，是告诉系统，当要求系统运行一个程序而没有告诉它程序所在的完整路径时，系统除了在当前目录下面寻找此程序外，还应到哪些目录下去寻找。

也就是说，`npm i` 的时候，`npm` 就帮我们把这种软连接配置好了，其实这种软连接相当于一种映射，执行 `npm run xxx` 的时候，就会到 `node_modules/bin` 中找对应的映射文件，然后再找到相应的js文件来执行。

### npm link

假设你开发的是一个全局命令行包A，这时候你需要本地调试它，而不希望每次都`npm publish`后安装调试。这个时候你可以在模块的目录下执行：`npm link`。上述命令通过链接目录和可执行文件，实现任意位置的`npm`模块命令的全局可执行。执行完上述命令后，就可以全局调用A命令了。

假设你开发的是一个功能包B，然后你需要在项目C中调试它，你可以直接暴力的将功能包B的代码拷贝到需要项目C中调试，但这不是很好的办法。我们可以执行如下操作：

```js
// 功能包 B 中，把 B link 到全局
npm link
// 项目 C 中，link 功能包 B
npm link B

// 项目 C 中
npm unlink B
// 功能包 B 中
npm unlink
```

上述命令为功能包B在全局创建一个软链接，然后将其链接到项目C模块安装路径`./node_modules/`，等同于生成了本地模块的符号链接。当你的项目不再需要该模块的时候，需要解除软连接，否则当你在项目中安装npm上的包时将会出错。

`npm link`主要操作如下：

- 为目标`npm`模块创建软链接，将其链接到全局`node`模块安装路径`/usr/local/lib/node_modules/`。
- 为目标`npm`模块的可执行`bin`文件创建软链接，将其链接到全局`node`命令安装路径`/usr/local/bin/`。

硬连接就是同一个文件的不同引用，而软链接是新建一个文件，文件内容指向另一个路径。当然，这俩链接使用起来是差不多的。

## npm npx yarn pnpm

`npm`, `npx`, `yarn` 和 `pnpm` 都是 `JavaScript` 生态系统中用于管理包依赖和运行脚本的工具。它们在功能和使用方式上有一些区别：

### npm (Node Package Manager)

`npm` 是 `Node.js` 默认的包管理工具，用于安装、发布和管理 `JavaScript` 包。它随同 `Node.js` 一起安装，无需额外安装。

使用 `npm install` 来安装依赖包，使用 `npm start` 等来运行脚本。

`npm` 在功能上比较全面，适用于大多数项目。

`npm3` 使用的是**扁平化依赖**来进行包管理。所有的依赖都被拍平到`node_modules`目录下，不再有很深层次的嵌套关系。这样在安装新的包时，根据 `node require` 机制，会不停往上级的`node_modules`当中去找，如果找到相同版本的包就不会重新安装，解决了大量包重复安装的问题，而且依赖层级也不会太深。但这样的管理方式也会存在以下问题：

1. 依赖结构的不确定性，有时候两个包依赖了同一个另外的包，会根据在`package.json`中的位置确定到底如何处理在`node_modules`里的结构，这也是为什么会出现`package-lock.json`的原因
2. 扁平化算法本身的复杂性很高，耗时较长
3. 项目中仍然可以非法访问没有声明过依赖的包

### npx

`npx` 是 `npm` 的一部分，从 `npm` 5.2.0 开始引入。

它用于**临时安装和运行包**，而无需全局安装它们。

常用于运行临时脚本，或者在不全局安装 CLI 工具的情况下使用它们。

示例：`npx create-react-app my-app` 会临时安装并运行 `create-react-app` 工具。

### yarn

`yarn` 是 Facebook 创建的另一个包管理工具，旨在提供更快速、一致和安全的依赖管理。

它有类似 `npm` 的命令，如 `yarn install` 和 `yarn start`。

`yarn` 具有锁定依赖版本的功能，以确保在不同环境中的一致性。

与 `npm` 相比，`yarn` 在性能和用户体验方面有一些优势，但功能上基本类似。

### pnpm

`pnpm` 是另一种包管理工具，旨在解决依赖冗余和磁盘占用问题。不同于 `npm` 和 `yarn`，`pnpm` 采用链接共享依赖的方式，而不是在每个项目中**复制依赖**。这可以节省磁盘空间，并加快依赖的安装速度。

`pnpm` 内部使用基于**内容寻址**的文件系统来存储磁盘上所有的文件，这个文件系统出色的地方在于：

`pnpm`不会重复安装同一个包。用 `npm`/`yarn` 的时候，如果 100 个项目都依赖 `lodash`，那么 `lodash` 很可能就被安装了 100 次，磁盘中就有 100 个地方写入了这部分代码。但在使用 `pnpm` 只会安装一次，磁盘中只有一个地方写入，后面再次使用都会直接使用 `hardlink` **硬链接**。即使一个包的不同版本，`pnpm` 也会极大程度地复用之前版本的代码。举个例子，比如 `lodash` 有 100 个文件，更新版本之后多了一个文件，那么磁盘当中并不会重新写入 101 个文件，而是保留原来的 100 个文件的 `hardlink`，仅仅写入那一个新增的文件。

- 硬链接（Hard Links）：

`pnpm`使用硬链接来存储依赖项，这与`npm`和`Yarn`不同。在传统的工具中，每个项目都有自己的`node_modules`目录，依赖项会被完全复制到每个项目中，占用大量磁盘空间。而`pnpm`使用硬链接，将依赖项存储在一个公共的位置，并在项目之间共享，从而显著减少了磁盘空间的使用。

- 版本控制（Version Control）：

`pnpm`使用一个称为`pnpm-lock.yaml`的锁文件来管理项目的依赖版本。这个锁文件与`npm`的`package-lock.json`和`Yarn`的`yarn.lock`类似，但具有一些不同之处。`pnpm`的锁文件记录了每个依赖项的确切位置（路径）以及其哈希值，以确保在多个项目之间共享的依赖项的一致性。

- 全局依赖（Global Dependencies）：

与`npm`和`Yarn`不同，`pnpm`不推荐使用全局安装依赖项。`pnpm`鼓励将依赖项安装在每个项目的本地`node_modules`目录中，以确保项目的依赖项版本隔离。

- 并发安装（Concurrent Installation）：

`pnpm`支持并发安装依赖项，这意味着它可以更快地安装项目的依赖项，特别是在多核处理器上。

- 自动清理（Automatic Cleanup）：

`pnpm`具有自动清理功能，会删除项目中未使用的依赖项，以减少磁盘占用。这可以通过运行`pnpm prune`命令来手动触发，或者它会在安装新依赖项时自动执行。

- 快速开发（Fast Development Workflow）：

`pnpm`通过使用硬链接和智能缓存机制，支持快速的开发工作流程。在开发过程中，只需重新链接已更改的依赖项，而不必重新安装整个依赖树。

- 插件系统（Plugin System）：

`pnpm`具有可扩展的插件系统，允许开发人员编写自定义插件以扩展其功能。

总的来说，`pnpm`通过使用硬链接、版本控制、并发安装等特性，提供了一种更加高效和节省磁盘空间的依赖管理方式。虽然它在一些方面与`npm`和`Yarn`有不同，但它仍然遵循`npm`生态系统的规范，因此可以无缝地与现有的`npm`包和工具链集成在一起。如果你想要提高依赖管理的效率并减少磁盘占用，`pnpm`可能是一个值得考虑的选择。

`pnpm` 的命令与 `npm` 类似，如 `pnpm install` 和 `pnpm start`。

安装依赖包到 dependencies ：`pnpm add <pkg>`
安装依赖包到 devDependencies：`pnpm add -D <pkg>`
安装依赖包到 optionalDependencies：`pnpm add -O <pkg>`
全局安装依赖包：`pnpm add -g xxx`
安装项目全部依赖：`pnpm install`，别名`pnpm i`
更新依赖包：`pnpm update`，别名`pnpm up`
删除依赖包：`pnpm remove`，别名`pnpm rm/uninstall`

## 硬链接 软链接

硬链接（Hard Link）和软连接（Symbolic Link，也称为符号链接或symlink）是在计算机文件系统中用来创建文件链接的两种不同方法，它们有一些重要的区别：

### inode

`inode`（索引节点）是在类 `Unix` 文件系统中的一个关键概念，用于管理和存储文件的元数据信息。每个文件和目录在文件系统中都有一个相关联的`inode`，这个`inode`包含了有关文件或目录的重要信息，但不包括文件内容本身。

`inode`通常包含以下元数据信息：

- 文件类型：指示这个inode关联的是文件、目录、符号链接等文件类型。
- 文件所有者：文件的拥有者，通常是用户名或用户ID。
- 文件的权限信息：包括文件的读、写、执行权限，以及其他特殊权限。
- 文件大小：文件的实际大小（对于目录来说，它包含了目录中的条目数量）。
- 文件的时间戳：包括文件的创建时间、修改时间和访问时间。
- 硬链接计数：指示有多少个硬链接指向这个inode。这是文件系统用来跟踪文件链接的重要指标。
- 数据块指针：这些指针指向文件的数据块的位置，用于检索文件内容的实际数据。

`inode`的使用允许文件系统有效地管理文件和目录，因为它可以帮助文件系统快速查找和访问文件的元数据，而不需要扫描整个文件系统。每当创建一个新文件或目录时，文件系统都会分配一个新的`inode`，并在其数据结构中填写相关信息。

总之，`inode` 是文件系统中用于存储文件和目录的元数据信息的数据结构，它们对于文件系统的正常运行和性能至关重要。

### 硬链接（Hard Link）

硬链接是一个文件系统中的多个文件名，它们指向相同的数据块（`inode`）。换句话说，**硬链接是实际文件数据的多个入口**。

删除一个硬链接不会删除文件本身，因为硬链接和原始文件共享相同的数据块，只有当所有链接都被删除时，才会释放磁盘空间。

硬链接不能跨越文件系统边界创建，因为它们必须指向相同文件系统的`inode`。

硬链接通常不支持目录，只能链接文件。

### 软连接（Symbolic Link，symlink）

软连接是一个特殊的文件，其中包含了指向另一个文件或目录的路径。它们是**路径的符号引用，而不是实际的文件数据**。

删除原始文件不会影响软连接，但如果原始文件路径不可用，软连接就会失效。

软连接可以跨越文件系统边界创建，因为它们只是包含目标路径的文本。

软连接可以链接到文件或目录，因此它们更灵活。

## 总结

选择使用哪个工具取决于你的项目需求和个人偏好。`npm` 是默认和普遍使用的工具，`yarn` 提供了一些额外的优势，而 `pnpm` 则专注于解决依赖冗余问题。 `npx` 则是一个有用的辅助工具，用于在不全局安装包的情况下执行命令。

## 参考资料

[What is npm? A Node Package Manager Tutorial for Beginners](https://www.freecodecamp.org/news/what-is-npm-a-node-package-manager-tutorial-for-beginners/)

[Helpers and tips for npm run scripts](https://michael-kuehnel.de/tooling/2018/03/22/helpers-and-tips-for-npm-run-scripts.html)

[关于现代包管理器的深度思考——为什么现在我更推荐 pnpm 而不是 npm/yarn?](https://juejin.cn/post/6932046455733485575#heading-6)

[All About NPM (Node Package Manager)](https://dev.to/olibhiaghosh/all-about-npm-node-package-manager-hk2?context=digest)
