# 需要知道的常用HTTP Headers

## Strict-Transport-Security

`HTTP-Strict-Transport-Security`（通常简称为 HSTS）响应标头用来通知浏览器应该只通过 `HTTPS` 访问该站点，并且以后使用 `HTTP` 访问该站点的所有尝试都应自动转换为 `HTTPS`。

一个网站接受一个 `HTTP` 的请求，然后跳转到 `HTTPS`，用户可能在开始跳转前，通过没有加密的方式和服务器对话，比如，用户输入 `http://foo.com` 或者直接 `foo.com`。

这样存在中间人攻击潜在威胁，跳转过程可能被恶意网站利用来直接接触用户信息，而不是原来的加密信息。

网站通过 `HTTP Strict Transport Security` 通知浏览器，这个网站禁止使用 `HTTP` 方式加载，浏览器应该自动把所有尝试使用 `HTTP` 的请求自动替换为 `HTTPS` 请求。

你的网站第一次通过 `HTTPS` 请求，服务器响应 `Strict-Transport-Security` 头，浏览器记录下这些信息，然后后面尝试访问这个网站的请求都会自动把 `HTTP` 替换为 `HTTPS`。

当 `HSTS` 头设置的过期时间到了，后面通过 `HTTP` 的访问恢复到正常模式，不会再自动跳转到 `HTTPS`。

每次浏览器接收到 `Strict-Transport-Security` 头，它都会更新这个网站的过期时间，所以网站可以刷新这些信息，防止过期发生。

Chrome、Firefox 等浏览器里，当您尝试访问该域名下的内容时，会产生一个 `307 Internal Redirect`（内部跳转），自动跳转到 `HTTPS` 请求。

```js
Strict-Transport-Security: max-age=<expire-time>
Strict-Transport-Security: max-age=<expire-time>; includeSubDomains
Strict-Transport-Security: max-age=<expire-time>; preload
```

## Content-Security-Policy

内容安全策略 (CSP) 是一个额外的安全层，用于检测并削弱某些特定类型的攻击，包括**跨站脚本** (XSS (en-US)) 和**数据注入攻击**等。无论是数据盗取、网站内容污染还是散发恶意软件，这些攻击都是主要的手段。

CSP 的主要目标是减少和报告 XSS 攻击，XSS 攻击利用了浏览器对于从服务器所获取的内容的信任。恶意脚本在受害者的浏览器中得以运行，因为浏览器信任其内容来源，即使有的时候这些脚本并非来自于它本该来的地方。CSP 通过指定有效域——即浏览器认可的可执行脚本的有效来源——使服务器管理者有能力减少或消除 XSS 攻击所依赖的载体。一个 CSP 兼容的浏览器将会仅执行从白名单域获取到的脚本文件，忽略所有的其他脚本 (包括内联脚本和 HTML 的事件处理属性)。

配置内容安全策略涉及到添加 `Content-Security-Policy` HTTP 头部到一个页面，并配置相应的值，以控制用户代理（浏览器等）可以为该页面获取哪些资源。比如一个可以上传文件和显示图片页面，应该允许图片来自任何地方，但限制表单的 action 属性只可以赋值为指定的端点。一个经过恰当设计的内容安全策略应该可以有效的保护页面免受跨站脚本攻击。

除此之外， `<meta>` 元素也可以被用来配置该策略，例如

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src https://*; child-src 'none';">
```

CSP配置示例：

- 一个网站管理者想要所有内容均来自站点的同一个源 (不包括其子域名)
  
```js
Content-Security-Policy: default-src 'self'
```

- 一个网站管理者允许内容来自信任的域名及其子域名 (域名不必须与 CSP 设置所在的域名相同)

```js
Content-Security-Policy: default-src 'self' *.trusted.com
```

- 一个网站管理者允许网页应用的用户在他们自己的内容中包含来自任何源的图片，但是限制音频或视频需从信任的资源提供者 (获得)，所有脚本必须从特定主机服务器获取可信的代码。

```js
Content-Security-Policy: default-src 'self'; img-src *; media-src media1.com media2.com; script-src userscripts.example.com
```

在这里，各种内容默认仅允许从文档所在的源获取，但存在如下例外：

1. 图片可以从任何地方加载 (注意 "*" 通配符)。
2. 多媒体文件仅允许从 media1.com 和 media2.com 加载 (不允许从这些站点的子域名)。
3. 可运行脚本仅允许来自于 userscripts.example.com。

- 一个线上银行网站的管理者想要确保网站的所有内容都要通过 SSL 方式获取，以避免攻击者窃听用户发出的请求。

```js
Content-Security-Policy: default-src https://onlinebanking.jumbobank.com
```

该服务器仅允许通过 HTTPS 方式并仅从onlinebanking.jumbobank.com域名来访问文档。

- 一个在线邮箱的管理者想要允许在邮件里包含 HTML，同样图片允许从任何地方加载，但不允许 JavaScript 或者其他潜在的危险内容 (从任意位置加载)。

```js
Content-Security-Policy: default-src 'self' *.mailsite.com; img-src *
```

注意这个示例并未指定`script-src`。在此 CSP 示例中，站点通过 `default-src` 指令的对其进行配置，这也同样意味着脚本文件仅允许从原始服务器获取。

为降低部署成本，CSP 可以部署为报告 (report-only)模式。在此模式下，CSP 策略不是强制性的，但是任何违规行为将会报告给一个指定的 URI 地址。此外，一个报告模式的头部可以用来测试一个修订后的未来将应用的策略而不用实际部署它。

你可以用`Content-Security-Policy-Report-Only` HTTP 头部来指定你的策略，像这样：

如果`Content-Security-Policy-Report-Only` 头部和 `Content-Security-Policy` 同时出现在一个响应中，两个策略均有效。在`Content-Security-Policy` 头部中指定的策略有强制性，而`Content-Security-Policy-Report-Only`中的策略仅产生报告而不具有强制性。

```js
Content-Security-Policy-Report-Only: policy
```

## 参考资料

[内容安全策略 ( CSP )](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Strict-Transport-Security)

[Cache-Control for Civilians](https://csswizardry.com/2019/03/cache-control-for-civilians/)

[HTTP Headers for the Responsible Developer: Stefan Judis, JSConf EU](https://www.youtube.com/watch?v=Mjqf2kkFLy8)
