# Cookie Session Token

## Cookie

### Cookie 基础

`HTTP Cookie`（也叫 `Web Cookie` 或浏览器 `Cookie`）是服务器发送到用户浏览器并保存在本地的一小块数据。浏览器会存储 `Cookie` 并在下次向同一服务器再发起请求时携带并发送到服务器上。通常，它用于告知服务端两个请求是否来自同一浏览器——如保持用户的登录状态。`Cookie` 使基于无状态的 `HTTP` 协议记录稳定的状态信息成为了可能。

`Cookie` 曾一度用于客户端数据的存储，因当时并没有其他合适的存储办法而作为唯一的存储手段，但现在推荐使用现代存储API。由于服务器指定 `Cookie` 后，浏览器的每次请求都会携带 `Cookie` 数据，会带来额外的性能开销（尤其是在移动环境下）。新的浏览器 `API` 已经允许开发者直接将数据存储到本地，如使用 `Web storage API`（`localStorage` 和 `sessionStorage`）或 `IndexedDB` 。

- `Cookie` 存储在客户端： `Cookie` 是服务器发送到用户浏览器并保存在本地的一小块数据，它会在浏览器下次向同一服务器再发起请求时被携带并发送到服务器上。
- `Cookie` 是不可跨域的： 每个 `Cookie` 都会绑定单一的域名，无法在别的域名下获取使用，一级域名和二级域名之间是允许共享使用的（靠的是 domain）

服务器收到 `HTTP` 请求后，服务器可以在响应标头里面添加一个或多个 `Set-Cookie` 选项。浏览器收到响应后通常会保存下 `Cookie`，并将其放在 `HTTP Cookie` 标头内，向同一服务器发出请求时一起发送。你可以指定一个过期日期或者时间段之后，不能发送 `Cookie`。你也可以对指定的域和路径设置额外的限制，以限制 `Cookie` 发送的位置。

前端请求时在request对象中配置`"withCredentials": true`
服务端在response的header中配置`"Access-Control-Allow-Origin": "http://xxx:${port}"`
服务端在response的header中配置`"Access-Control-Allow-Credentials": "true"`

### Cookie 属性

- **`Name`/`Value` 属性**

用 `JavaScript` 操作 `Cookie` 的时候注意对 `Value` 进行编码处理。

- **`Expires` 属性**

`Expires` 用于设置 `Cookie` 的过期时间。比如：

```text
Set-Cookie: id=a3fWa; Expires=Wed, 21 Oct 2015 07:28:00 GMT;
```

当 `Expires` 属性缺省时，表示是会话性 `Cookie`，`Expires` 的值为 `Session`，表示的就是会话性 `Cookie`。当为会话性 `Cookie` 的时候，值保存在客户端内存中，并在用户关闭浏览器时失效。需要注意的是，有些浏览器提供了会话恢复功能，这种情况下即使关闭了浏览器，会话期 `Cookie` 也会被保留下来，就好像浏览器从来没有关闭一样。

与会话性 `Cookie` 相对的是持久性 `Cookie`，持久性 `Cookie` 会保存在用户的硬盘中，直至过期或者清除 `Cookie`。这里值得注意的是，设定的日期和时间只与客户端相关，而不是服务端。

- **`Max-Age` 属性**

`Max-Age` 用于设置在 `Cookie` 失效之前需要经过的秒数。比如：

```text
Set-Cookie: id=a3fWa; Max-Age=604800;
```

`Max-Age` 可以为正数、负数、甚至是 0。

如果 `Max-Age` 属性为正数时，浏览器会将其持久化，即写到对应的 `Cookie` 文件中。

当 `Max-Age` 属性为负数，则表示该 `Cookie` 只是一个会话性 `Cookie`。

当 `Max-Age` 为 0 时，则会立即删除这个 `Cookie`。

假如 `Max-Age` 和 `Max-Age` 都存在，`Max-Age` 优先级更高。

- **`Domain` 属性**

`Domain` 指定了哪些主机可以接受 `Cookie`。如果不指定，该属性默认为同一 `host` 设置 `Cookie`，不包含子域名。如果指定了 `Domain`，则一般包含子域名。因此，指定 `Domain` 比省略它的限制要少。但是，当子域需要共享有关用户的信息时，这可能会有所帮助。

例如，如果设置 `Domain=mozilla.org`，则 `Cookie` 也包含在子域名中：如 `developer.mozilla.org`。

- **`Path` 属性**

`Path` 属性指定了一个 `URL` 路径，该 `URL` 路径必须存在于请求的 `URL` 中，以便发送 `Cookie`标头。以字符 `%x2F` (“`/`”) 作为路径分隔符，并且子路径也会被匹配。

- **`SameSite` 属性**

`SameSite` 属性允许服务器指定是否/何时通过跨站点请求发送（其中站点由注册的域和方案定义：`http` 或 `https`）。这提供了一些针对跨站点请求伪造攻击（`CSRF`）的保护。它采用三个可能的值：`Strict`、`Lax` 和 `None`。

1. `Strict` 仅允许一方请求携带 `Cookie`，即浏览器将只发送**相同站点**请求的 `Cookie`，即当前网页 `URL` 与请求目标 `URL` 完全一致。
2. `Lax` **允许部分第三方**请求携带 `Cookie`
3. `None` **无论是否跨站**都会发送 `Cookie`

之前默认是 `None` 的，`Chrome80` 后默认是 `Lax`。

有两种方法可以确保 `Cookie` 被**安全**发送，并且不会被意外的参与者或脚本访问：

- **`Secure` 属性**

标记为 `Secure` 的 `Cookie` 只应通过被 `HTTPS` 协议加密过的请求发送给服务端。它永远不会使用不安全的 `HTTP` 发送（本地主机除外），这意味着中间人攻击者无法轻松访问它。不安全的站点（在 URL 中带有 http:）无法使用 `Secure` 属性设置 `Cookie`。但是，`Secure` 不会阻止对 `Cookie` 中敏感信息的访问。例如，有权访问客户端硬盘（或，如果未设置 `HttpOnly` 属性，则为 `JavaScript`）的人可以读取和修改它。

- **`HttpOnly` 属性**

`JavaScript` 的 `Document.cookie API` 无法访问带有 `HttpOnly` 属性的 `Cookie`；此类 `Cookie` 仅作用于服务器。例如，持久化服务器端会话的 `Cookie` 不需要对 `JavaScript` 可用，而应具有 `HttpOnly` 属性。此预防措施有助于缓解跨站点脚本（`XSS`）攻击。

### Cookie 作用

`Cookie` 主要用于以下三个方面：

- 会话状态管理（如用户登录状态、购物车、游戏分数或其它需要记录的信息）
- 个性化设置（如用户自定义设置、主题等）
- 浏览器行为跟踪（如跟踪分析用户行为等）

### Cookie 缺陷

- 容量缺陷。`Cookie` 的体积上限只有4KB，只能用来存储少量的信息。

- 性能缺陷。`Cookie` 紧跟域名，不管域名下面的某一个地址需不需要这个 `Cookie` ，请求都会携带上完整的 `Cookie`，这样随着请求数的增多，其实会造成巨大的性能浪费的，因为请求携带了很多不必要的内容。但可以通过`Domain`和`Path`指定作用域来解决。

- 安全缺陷。由于 `Cookie` 以纯文本的形式在浏览器和服务器中传递，很容易被非法用户截获，然后进行一系列的篡改，在 `Cookie` 的有效期内重新发送给服务器，这是相当危险的。另外，在`HttpOnly`为 `false` 的情况下，`Cookie` 信息能直接通过 `JS` 脚本来读取。

---

## Session

### Session基础

`Session`其实是一个小文件，很可能以`JSON`格式存储，其中包含有关用户的信息，例如唯一标识符、登录时间、到期时间等等。它是在服务器上生成并存储的，以便服务器能够跟踪用户的请求。用户会接收到其中一些细节，尤其是唯一标识符，然后会存储在`cookie`中，这些`cookie`将随着每个新请求一起发送，以便服务器能够识别唯一标识符并授权用户的请求。

一个通常的 `Session` 认证过程如下：

1. 用户向服务器发送登录请求；
2. 服务器对登录请求进行身份验证，将会话发送到数据库，并将包含会话ID的`Cookie`返回给用户；
3. 然后，用户发送新的请求（带有`Cookie`）；
4. 服务器在数据库中检查`Cookie`中的ID，如果找到ID，则将请求的页面发送给用户；

由此可见：

- `Session` 是另一种记录服务器和客户端会话状态的机制
- `Session` 是基于 `Cookie` 实现的，`Session` 存储在服务器端，`SessionID` 会被存储到客户端的 `Cookie` 中。`SessionID` 是连接 `Cookie` 和 `Session` 的一道桥梁，大部分系统也是根据此原理来验证用户登录状态。

### Session 缺陷

既然`Session`存储在服务器上，其服务器端的管理员具有对其的控制权。例如，如果安全团队怀疑某个帐户受到了入侵，他们可以立即使`SessionID`无效，从而使用户立即退出登录。另一方面，由于会话存储在服务器上，服务器负责查找用户发送的会话ID，这可能会导致可扩展性问题。

`Cookies` 可能会受到跨站请求伪造攻击(CSRF)的影响。攻击者可能会引导用户访问恶意网站，其中一些 `JavaScript` 脚本可能利用 `cookies` 向服务器发送恶意请求。另一个漏洞涉及中间人攻击的可能性，攻击者可以拦截会话ID并向服务器发送有害请求。

---

## Token

`Token`是一种授权文件，不可篡改。它是**由服务器使用密钥生成**，然后发送给用户并存储在用户的本地存储中。就像在使用`Cookie`时一样，用户在每个新请求中将这个`Token`发送给服务器，以便服务器可以验证其签名并授权请求。

对比 `Cookie`，`Token` 需要自己存储，自己进行发送，不存在跨域限制，因此 `Token` 更加的灵活，没有 `Cookie` 那么多的“历史包袱”束缚，在安全性上也能够做更多的优化。

`Cookie` 由于存储的内存空间只有 4kb，因此存储的主要是一个用户 id，其他的用户信息都存储在服务器的 `Session` 中，而 `Token` 没有内存限制，用户信息可以存储 `Token` 中，返回给用户自行存储，因此可以看出，采用 `Cookie` 的话，由于所有用户都需要在服务器的 `Session` 中存储相对应的用户信息，所以如果用户量非常大，这对于服务器来说，将是非常大的性能压力，而 `Token` 将用户信息返回给客户端各自存储，也就完全避开这个问题了。

一个通常的 `Token` 认证过程如下：

1. 客户端使用用户名跟密码请求登录；
2. 服务端收到请求，去验证用户名与密码；
3. 验证成功后，服务端会签发一个 `token` 并把这个 `token` 发送给客户端；
4. 客户端收到 `token` 以后，会把它存储起来，比如放在 `cookie` 里或者 `localStorage` 里；
5. 客户端每次向服务端请求资源的时候需要带着服务端签发的 `token`；
6. 服务端收到请求，然后去验证客户端请求里面带着的 `token` ，如果验证成功，就向客户端返回请求的数据；

## 现代登录认证方案

### Session 认证结合 cookie

1. 用户通过用户名和密码登录应用；
2. 服务器生成唯一的`session ID`并存储在`cookie`中；
3. 浏览器每次请求都发送出`cookie`证明是该用户；

```js
const express = require('express');
const session = require('express-session');
const app = express();

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

app.post('/login', (req, res) => {
  // Authenticate user
  req.session.userId = user.id;
  res.send('Welcome back!');
});

app.get('/dashboard', (req, res) => {
  if (req.session.userId) {
    res.send('Here's your personalized dashboard');
  } else {
    res.send('Please log in to view your dashboard');
  }
});

app.listen(3000);
```

### JWT (JSON Web Token) 认证

JWT 是一种紧凑、自包含的令牌格式，通常用于身份验证。与OAuth 2.0不同，JWT 更专注于身份验证场景。它通过生成一个包含用户信息的加密令牌，客户端可以通过该令牌来访问资源，避免每次请求都需要重复认证。

工作流程：

1. 用户登录：用户通过用户名和密码登录应用；
2. 服务器生成`JWT`：服务器验证用户凭据，通过对用户信息（如用户ID）进行编码、签名生成`JWT`令牌，并将该令牌返回给客户端；
3. 客户端存储`JWT`：客户端将`JWT`存储在Cookie或本地存储中；
4. 请求附带`JWT`：每次客户端请求API或受保护资源时，都会将`JWT`放在请求头中发送给服务器；
5. 服务器验证`JWT`：服务器验证`JWT`的签名和有效性，确认其合法后返回数据；

JWT 结构：

- `Header`：头部，包含签名算法信息。
- `Payload`：有效负载，包含用户信息和其他声明（claims）。
- `Signature`：签名，用于验证令牌未被篡改。

```js
const jwt = require('jsonwebtoken');

app.post('/login', (req, res) => {
  // Authenticate user
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    'your-secret-key',
    { expiresIn: '1h' }
  );
  res.json({ token });
});

app.get('/dashboard', (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).send('Access denied');

  try {
    const verified = jwt.verify(token, 'your-secret-key');
    res.send('Welcome to your dashboard, ' + verified.email);
  } catch (err) {
    res.status(400).send('Invalid token');
  }
});
```

### Single Sign-On (SSO) 单点登录

SSO 是一种允许用户通过一次登录来访问多个应用程序或系统的身份验证机制。它的核心思想是，用户在登录一个系统后，可以无缝地访问其他相关系统，而不需要重新输入用户名和密码。

工作流程：

1. 用户访问应用A：用户尝试访问某个应用程序（例如应用A）；
2. 重定向到认证服务器：如果用户没有登录，应用A会将用户重定向到一个中心化的身份认证服务器；
3. 认证服务器处理登录：用户在认证服务器上输入用户名和密码；认证服务器验证用户凭据；
4. 生成`Session`/`Token`：一旦用户被验证成功，认证服务器会生成一个`Session`或`Token`，并将其存储在用户浏览器的`Cookie`或本地存储中；
5. 重定向回应用A：认证服务器会将用户重定向回应用A，并携带认证令牌；
6. 访问其他应用：当用户访问其他相关应用（例如应用B）时，这些应用会自动识别用户的`SSO Token`，允许用户访问，无需再次登录；

### OAuth 2.0 认证

OAuth 2.0 是一种授权框架，旨在允许第三方应用在不暴露用户凭据的情况下，代表用户访问资源。它通常用于允许外部应用访问某个服务的受保护资源（例如，允许某个应用访问用户的Google账户中的联系人信息），而不要求用户提供密码。

工作流程：

1. 用户授权请求：用户想要通过第三方应用（例如某个社交媒体管理工具）访问资源（例如Google API）。第三方应用会请求用户授权；
2. 用户重定向到授权服务器：用户被重定向到资源提供者的授权服务器（例如Google的OAuth服务器）；
3. 用户同意授权：用户在授权服务器上同意授权，将访问权限授予第三方应用；
4. 获取授权码：授权服务器生成授权码，并将其重定向回第三方应用；
5. 获取访问令牌：第三方应用使用授权码向授权服务器申请访问令牌（Access Token）；
6. 访问受保护资源：第三方应用携带访问令牌向资源服务器请求资源。资源服务器验证令牌，确认后授予访问权限；

```js
const express = require('express');
const axios = require('axios');
const app = express();

app.get('/login', (req, res) => {
  const authUrl = `https://oauth.example.com/authorize?client_id=your-client-id&redirect_uri=http://localhost:3000/callback&response_type=code&scope=read_user`;
  res.redirect(authUrl);
});

app.get('/callback', async (req, res) => {
  const { code } = req.query;
  try {
    const tokenResponse = await axios.post('https://oauth.example.com/token', {
      code,
      client_id: 'your-client-id',
      client_secret: 'your-client-secret',
      redirect_uri: 'http://localhost:3000/callback',
      grant_type: 'authorization_code'
    });
    const { access_token } = tokenResponse.data;
    // Use the access_token to make API requests
    res.send('Authentication successful!');
  } catch (error) {
    res.status(500).send('Authentication failed');
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

## 总结

使用 `Cookie` 时需要考虑的问题：

- 因为存储在客户端，容易被客户端篡改，使用前需要验证合法性
- 不要存储敏感数据，比如用户密码，账户余额
- 使用 `httpOnly` 在一定程度上提高安全性
- 尽量减少 `Cookie` 的体积，能存储的数据量不能超过 4kb
- 设置正确的 `domain` 和 `path`，减少数据传输
- `Cookie` 通常无法跨域
- 一个浏览器针对一个网站最多存 20 个 `Cookie`，浏览器一般只允许存放300个 `Cookie`
- 移动端对 `cookie` 的支持不是很好，而 `session` 需要基于 `Cookie` 实现，所以移动端常用的是 `token`

使用 `session` 时需要考虑的问题：

- 将 `session` 存储在服务器里面，当用户同时在线量比较多时，这些 `session` 会占据较多的内存，需要在服务端定期的去清理过期的 `session`
- 当网站采用集群部署的时候，会遇到多台 `web` 服务器之间如何做 `session` 共享的问题。因为 `session` 是由单个服务器创建的，但是处理用户请求的服务器不一定是那个创建 `session` 的服务器，那么该服务器就无法拿到之前已经放入到 `session` 中的登录凭证之类的信息了
- 当多个应用要共享 `session` 时，除了以上问题，还会遇到跨域问题，因为不同的应用可能部署的主机不一样，需要在各个应用做好 `Cookie` 跨域的处理
- `sessionId` 是存储在 `Cookie` 中的，假如浏览器禁止 `Cookie` 或不支持 `Cookie` 怎么办？ 一般会把 `sessionId` 跟在 `url` 参数后面即重写 `url`，所以 `session` 不一定非得需要靠 `Cookie` 实现

使用 `token` 时需要考虑的问题：

- 如果你认为用数据库来存储 `token` 会导致查询时间太长，可以选择放在内存当中，比如 `redis` 很适合对 `token` 查询的需求
- `token` 完全由应用管理，所以它可以避开同源策略
- `token` 可以避免 `CSRF` 攻击，因为不需要 `Cookie` 了

## 参考资料

[HTTP Cookie](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Cookies)

[浏览器系列之 Cookie 和 SameSite 属性](https://github.com/mqyqingfeng/Blog/issues/157)

[傻傻分不清之 Cookie、Session、Token、JWT](https://juejin.cn/post/6844904034181070861)

[Session vs Token Based Authentication](https://www.geeksforgeeks.org/session-vs-token-based-authentication/)

[Authentication: Comparing Session, JWT, SSO, and OAuth 2.0 in 2024](https://dev.to/vyan/the-ultimate-guide-to-web-authentication-comparing-session-jwt-sso-and-oauth-20-in-2024-2og0?context=digest)
