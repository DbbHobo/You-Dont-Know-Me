# Web 攻击技术

## 主动攻击和被动攻击

主动攻击模式里具有代表性的攻击是 SQL 注入攻击和 OS 命令注入攻击。

被动攻击是指利用圈套策略执行攻击代码的攻击模式。 在被动攻击过程中， 攻击者不直接对目标 `Web` 应用访问发起攻击。被动攻击模式中具有代表性的攻击是跨站脚本攻击 `XSS` 和跨站点请求伪造 `CSRF`。

### 跨站脚本攻击 XSS

跨站脚本攻击（ Cross-Site Scripting， XSS） 是指通过存在安全漏洞的 Web 网站注册用户的浏览器内**运行非法的 HTML 标签或 JavaScript** 进行的一种攻击。

它允许恶意使用者将程式码注入到网页上，其他使用者在观看网页时就会受到影响。这类攻击通常包含了 `HTML` 以及使用者端脚本语言。`XSS` 通过修改 `HTML` 节点或者执行 `JS` 代码来攻击网站。

```js
// 例如通过 URL 获取某些参数
// http://www.domain.com?name=<script>alert(1)</script>
<div>{{name}}</div>
```

如何防御？

1. 最普遍的做法是转义输入输出的内容，对于引号，尖括号，斜杠进行**转义**。
2. `CSP` 的主要目标是减少和报告 `XSS` 攻击。`XSS` 攻击利用了浏览器对于从服务器所获取的内容的信任。恶意脚本在受害者的浏览器中得以运行，因为浏览器信任其内容来源，即使有的时候这些脚本并非来自于它本该来的地方。`CSP` 通过指定有效域——即浏览器认可的可执行脚本的有效来源——使服务器管理者有能力减少或消除 `XSS` 攻击所依赖的载体。一个 `CSP` 兼容的浏览器将会仅执行从白名单域获取到的脚本文件，忽略所有的其他脚本（包括内联脚本和 `HTML` 的事件处理属性）。
3. 作为一种终极防护形式，始终不允许执行脚本的站点可以选择全面禁止脚本执行。
4. 设置 `Cookie` 的 `HttpOnly` 属性后，`JavaScript` 便无法读取 `Cookie` 的值。这样也能很好的防范 `XSS` 攻击。

### 跨站点请求伪造 CSRF

跨站点请求伪造（Cross-Site Request Forgeries， CSRF） 攻击是指攻击者通过设置好的陷阱，强制对已完成认证的用户进行非预期的个人信息或设定信息等某些状态更新， 属于被动攻击。

一个典型的 `CSRF` 攻击有着如下的流程：

- 受害者登录a.com，并保留了登录凭证（Cookie）
- 攻击者引诱受害者访问了b.com
- b.com 向 a.com 发送了一个请求：a.com/act=xx。浏览器会默认携带a.com的Cookie
- a.com接收到请求后，对请求进行验证，并确认是受害者的凭证，误以为是受害者自己发送的请求
- a.com以受害者的名义执行了act=xx
- 攻击完成，攻击者在受害者不知情的情况下，冒充受害者，让a.com执行了自己定义的操作

如何防御？防范 `CSRF` 可以遵循以下几种规则：

1. `Get` 请求不对数据进行修改
2. 不让第三方网站访问到用户 `Cookie`
3. 阻止第三方网站请求接口
4. 请求时附带验证信息，比如验证码或者 `token`

- `SameSite`

可以对 `Cookie` 设置 `SameSite` 属性。该属性设置 `Cookie` 不随着跨域请求发送，该属性可以很大程度减少 `CSRF` 的攻击，但是该属性目前并不是所有浏览器都兼容。

`CSRF`攻击中重要的一环就是自动发送目标站点下的 `Cookie`,然后就是这一份 `Cookie` 模拟了用户的身份。因此在`Cookie`上面下文章是防范的不二之选。在 `Cookie` 当中有一个关键的字段，可以对请求中 `Cookie` 的携带作一些限制，这个字段就是`SameSite`。

`SameSite`可以设置为三个值，`Strict`、`Lax`和`None`。

(1) 在`Strict`模式下，浏览器完全禁止第三方请求携带`Cookie`。比如请求xxx.com网站只能在xxx.com域名当中请求才能携带 `Cookie`，在其他网站请求都不能。
(2) 在`Lax`模式，就宽松一点了，但是只能在 `get` 方法提交表单况或者a 标签发送 `get` 请求的情况下可以携带 `Cookie`，其他情况均不能。
(3) 在`None`模式下，也就是默认模式，请求会自动携带上 `Cookie`。

- 验证 `Referer`

对于需要防范 `CSRF` 的请求，我们可以通过验证 `Referer` 来判断该请求是否为第三方网站发起的。

- `Token`

服务器下发一个随机 `Token` ，每次发起请求时将 `Token` 携带上，服务器验证 `Token` 是否有效

### SQL 注入

SQL 注入（ SQL Injection） 是指针对 Web 应用使用的数据库， 通过运行非法的 SQL 而产生的攻击。 该安全隐患有可能引发极大的威胁， 有时会直接导致个人信息及机密信息的泄露。

预防方式如下：

1. 严格检查输入变量的类型和格式
2. 过滤和转义特殊字符
3. 对访问数据库的Web应用程序采用Web应用防火墙

### OS 命令注入攻击

OS 命令注入攻击（ OS Command Injection） 是指通过 Web 应用， 执行非法的操作系统命令达到攻击的目的。 只要在能调用 Shell 函数的地方就有存在被攻击的风险。OS 命令注入攻击可以向 Shell 发送命令， 让 Windows 或 Linux 操作系统的命令行启动程序。 也就是说， 通过 OS 注入攻击可执行 OS 上安装着的各种程序。

### HTTP 首部注入攻击

HTTP 首部注入攻击（ HTTP Header Injection） 是指攻击者通过在响应首部字段内插入换行， 添加任意响应首部或主体的一种攻击。 属于被动攻击模式。

### HTTP 响应截断攻击

HTTP 响应截断攻击是用在 HTTP 首部注入的一种攻击。 攻击顺序相同， 但是要将两个 %0D%0A%0D%0A 并排插入字符串后发送。 利用这两个连续的换行就可作出 HTTP 首部与主体分隔所需的空行了， 这样就能显示伪造的主体， 达到攻击目的。 这样的攻击叫做 HTTP 响应截断攻击。

### 邮件首部注入

邮件首部注入（ Mail Header Injection） 是指 Web 应用中的邮件发送功能， 攻击者通过向邮件首部 To 或 Subject 内任意添加非法内容发起的攻击。

### 目录遍历攻击

目录遍历攻击（ Directory Traversal） 是指对本无意公开的文件目录，通过非法截断其目录路径后， 达成访问目的的一种攻击。 这种攻击有时也称为路径遍历（ Path Traversal） 攻击。

### 远程文件包含漏洞

远程文件包含漏洞（ Remote File Inclusion） 是指当部分脚本内容需要从其他文件读入时， 攻击者利用指定外部服务器的 URL 充当依赖文件， 让脚本读取之后， 就可运行任意脚本的一种攻击。主要存在于 PHP 中。

### 会话劫持

会话劫持（ Session Hijack） 是指攻击者通过某种手段拿到了用户的会话 ID， 并非法使用此会话 ID 伪装成用户， 达到攻击的目的。

对以窃取目标会话 ID 为主动攻击手段的会话劫持而言， 会话固定攻击（ Session Fixation） 攻击会强制用户使用攻击者指定的会话 ID， 属于被动攻击。

### 点击劫持

点击劫持（ Clickjacking） 是指利用透明的按钮或链接做成陷阱， 覆盖在 Web 页面之上。 然后诱使用户在不知情的情况下， 点击那个链接访问内容的一种攻击手段。 这种行为又称为界面伪装（ UIRedressing） 。

### DoS 攻击

DoS 攻击（ Denial of Service attack） 是一种让运行中的服务呈停止状态的攻击。 有时也叫做服务停止攻击或拒绝服务攻击。 DoS 攻击的对象不仅限于 Web 网站， 还包括网络设备及服务器等。

## 密码安全

### 加盐

对于密码存储来说，必然是不能明文存储在数据库中的，否则一旦数据库泄露，会对用户造成很大的损失。并且不建议只对密码单纯通过加密算法加密，因为存在彩虹表的关系。
通常需要对密码加盐，然后进行几次不同加密算法的加密。

```js
// 加盐也就是给原密码添加字符串，增加原密码长度
sha256(sha1(md5(salt + password + slat)));
```

但是加盐并不能阻止别人盗取账号，只能确保即使数据库泄露，也不会暴露用户的真实密码。一旦攻击者得到了用户的账号，可以通过暴力破解的方式破解密码。对于这种情况，通常使用验证码增加延时或者限制尝试次数的方式。并且一旦用户输入了错误的密码，也不能直接提示用户输错密码，而应该提示账号或密码错误。

## Web 安全

### CSP

内容安全策略（`CSP`）是一个额外的安全层，用于检测并削弱某些特定类型的攻击，包括跨站脚本（XSS）和数据注入攻击等。无论是数据盗取、网站内容污染还是恶意软件分发，这些攻击都是主要的手段。

`CSP` 被设计成完全向后兼容（除 CSP2 在向后兼容有明确提及的不一致; 更多细节查看这里 章节 1.1）。不支持 `CSP` 的浏览器也能与实现了 `CSP` 的服务器正常工作，反之亦然：不支持 `CSP` 的浏览器只会忽略它，如常运行，默认为网页内容使用标准的同源策略。如果网站不提供 `CSP` 标头，浏览器也使用标准的同源策略。

为使 `CSP` 可用，你需要配置你的网络服务器返回 `Content-Security-Policy` `HTTP` 标头（有时你会看到 `X-Content-Security-Policy` 标头，但那是旧版本，并且你无须再如此指定它）。

```text
Content-Security-Policy: default-src 'self'; img-src *; media-src media1.com media2.com; script-src userscripts.example.com
```

在这个例子中，各种内容默认仅允许从文档所在的源获取，但存在如下例外：

- 图片可以从任何地方加载 (注意“`*`”通配符)
- 多媒体文件仅允许从 `media1.com` 和 `media2.com` 加载（不允许从这些站点的子域名）
- 可运行脚本仅允许来自于 `userscripts.example.com`

### Strict-Transport-Security

`HTTP Strict-Transport-Security`（通常简称为 `HSTS`）响应标头用来通知浏览器应该只通过 `HTTPS` 访问该站点，并且以后使用 `HTTP` 访问该站点的所有尝试都应自动重定向到 `HTTPS`。

如果一个网站接受 `HTTP` 的请求，然后重定向到 `HTTPS`，用户可能在开始重定向前，通过没有加密的方式与服务器通信，比如，用户输入 `http://foo.com` 或者仅是输入 `foo.com`。这样为中间人攻击创造了机会。可以利用重定向将用户引导至恶意站点，而不是原始站的安全版本。

网站通过 `HTTP Strict Transport Security` 标头通知浏览器，这个网站禁止使用 `HTTP` 方式加载，并且浏览器应该自动把所有尝试使用 `HTTP` 的请求自动替换为 `HTTPS` 请求。

```text
Strict-Transport-Security: max-age=<expire-time>
Strict-Transport-Security: max-age=<expire-time>; includeSubDomains
Strict-Transport-Security: max-age=<expire-time>; includeSubDomains; preload
```

## 参考资料

《图解HTTP》

[解读 HTTP1/HTTP2/HTTP3](https://juejin.cn/post/6995109407545622542)

[内容安全策略（CSP）](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CSP)

[Strict-Transport-Security](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Strict-Transport-Security)
