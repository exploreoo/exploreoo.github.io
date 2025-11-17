import{_ as e}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as i,b as n,a as l,f as p,d as a,o as r}from"./app-6tg6kd_l.js";const t={};function d(c,s){return r(),i("div",null,[s[0]||(s[0]=n("h1",{id:"ssr",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#ssr"},[n("span",null,"SSR")])],-1)),s[1]||(s[1]=n("h2",{id:"引言",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#引言"},[n("span",null,"引言")])],-1)),s[2]||(s[2]=n("p",null,[a("服务器端渲染（Server-Side Rendering，简称 SSR）是指在服务器端生成 HTML 内容并发送到客户端的过程。与客户端渲染（Client-Side Rendering，简称 CSR）相比，SSR 可以提高首屏加载速度和 SEO 友好性。"),n("br"),a(" 如需更高级的集成框架可以使用nuxtjs")],-1)),l(" more "),s[3]||(s[3]=p(`<h3 id="文件结构" tabindex="-1"><a class="header-anchor" href="#文件结构"><span>文件结构</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>my-ssr-app/</span></span>
<span class="line"><span>├── dist/                      # 构建输出目录</span></span>
<span class="line"><span>├── public/                    # 公共资源目录</span></span>
<span class="line"><span>│   └── index.html             # HTML 模板</span></span>
<span class="line"><span>├── src/                       # 源代码目录</span></span>
<span class="line"><span>│   ├── entry-client.js        # 客户端入口文件</span></span>
<span class="line"><span>│   ├── entry-server.js        # 服务器端入口文件</span></span>
<span class="line"><span>|   └── main.js</span></span>
<span class="line"><span>├── package.json               # 项目配置文件</span></span>
<span class="line"><span>├── server.js                  # Express 服务器配置</span></span>
<span class="line"><span>└── vue.config.js   					 # Webpack 服务器端配置</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="构造流程" tabindex="-1"><a class="header-anchor" href="#构造流程"><span>构造流程</span></a></h2><h3 id="_1-安装必要的依赖" tabindex="-1"><a class="header-anchor" href="#_1-安装必要的依赖"><span>1. 安装必要的依赖</span></a></h3><p>SSR 需要一些额外的依赖包，如 <code>@vue/server-renderer</code> 和 <code>express</code>。在项目根目录下运行以下命令安装这些依赖：</p><div class="language-shell line-numbers-mode" data-highlighter="shiki" data-ext="shell" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">npm</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> install</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> @vue/server-renderer</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> express</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> webpack-manifest-plugin</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> webpack-node-externals</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> --save-dev</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>相关版本：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>&quot;@vue/cli-service&quot;: &quot;~5.0.0&quot;,</span></span>
<span class="line"><span>&quot;express&quot;: &quot;^4.21.2&quot;,</span></span>
<span class="line"><span>&quot;@vue/server-renderer&quot;: &quot;^3.5.13&quot;,</span></span>
<span class="line"><span>&quot;webpack-manifest-plugin&quot;: &quot;^5.0.0&quot;,</span></span>
<span class="line"><span>&quot;webpack-node-externals&quot;: &quot;^3.0.0&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-配置-webpack" tabindex="-1"><a class="header-anchor" href="#_2-配置-webpack"><span>2. 配置 Webpack</span></a></h3><p>SSR 需要两个 Webpack 配置：一个用于客户端打包，另一个用于服务器端打包。服务器端需要输出node环境的编译输出，为了拿到对应入口的路径，需要借助WebpackManifestPlugin形成映射表。</p><h4 id="vue-config-js" tabindex="-1"><a class="header-anchor" href="#vue-config-js"><span>vue.config.js</span></a></h4><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>const path = require(&quot;path&quot;);</span></span>
<span class="line"><span>const webpackNodeExternals = require(&quot;webpack-node-externals&quot;);</span></span>
<span class="line"><span>const { CleanWebpackPlugin } = require(&quot;clean-webpack-plugin&quot;);</span></span>
<span class="line"><span>const { WebpackManifestPlugin } = require(&quot;webpack-manifest-plugin&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>let SSR = process.env.SSR;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>module.exports = {</span></span>
<span class="line"><span>  outputDir: SSR ? &quot;dist/server&quot; : &quot;dist/client&quot;,</span></span>
<span class="line"><span>  configureWebpack: (config) =&gt; {</span></span>
<span class="line"><span>    if (SSR) {</span></span>
<span class="line"><span>      // 服务器端打包配置</span></span>
<span class="line"><span>      return {</span></span>
<span class="line"><span>        entry: &quot;./src/entry-server.js&quot;,</span></span>
<span class="line"><span>        target: &quot;node&quot;,</span></span>
<span class="line"><span>        output: {</span></span>
<span class="line"><span>          libraryTarget: &quot;commonjs2&quot;,</span></span>
<span class="line"><span>        },</span></span>
<span class="line"><span>        externals: [webpackNodeExternals({ allowlist: /\\.(css|vue)$/ })],</span></span>
<span class="line"><span>        plugins: [</span></span>
<span class="line"><span>          new CleanWebpackPlugin(),</span></span>
<span class="line"><span>          new WebpackManifestPlugin({ fileName: &quot;ssr-manifest.json&quot; }),</span></span>
<span class="line"><span>        ],</span></span>
<span class="line"><span>      };</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>      // 客户端打包配置</span></span>
<span class="line"><span>      return {</span></span>
<span class="line"><span>        entry: &quot;./src/entry-client.js&quot;,</span></span>
<span class="line"><span>        plugins: [</span></span>
<span class="line"><span>          new CleanWebpackPlugin(),</span></span>
<span class="line"><span>        ],</span></span>
<span class="line"><span>      };</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  },</span></span>
<span class="line"><span>};</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-改造main-js" tabindex="-1"><a class="header-anchor" href="#_3-改造main-js"><span>3. 改造main.js</span></a></h3><p>main文件不再直接挂载vue实例，改造为方法提供给客户端、服务端渲染调用。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>import { createSSRApp } from &quot;vue&quot;;</span></span>
<span class="line"><span>import App from &quot;./App.vue&quot;;</span></span>
<span class="line"><span>import { createRouter, createWebHistory, createMemoryHistory } from &quot;vue-router&quot;;</span></span>
<span class="line"><span>import routes from &quot;./router&quot;;</span></span>
<span class="line"><span>import { createStoreInstance } from &quot;./store&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>export function createApp() {</span></span>
<span class="line"><span>  const SSR = typeof window === &quot;undefined&quot;;</span></span>
<span class="line"><span>  const history = SSR ? createMemoryHistory() : createWebHistory();</span></span>
<span class="line"><span>  const router = createRouter({ history, routes });</span></span>
<span class="line"><span>  const store = createStoreInstance();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  const app = createSSRApp(App);</span></span>
<span class="line"><span>  app.use(router);</span></span>
<span class="line"><span>  app.use(store);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  return { app, router, store };</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-创建入口文件" tabindex="-1"><a class="header-anchor" href="#_4-创建入口文件"><span>4. 创建入口文件</span></a></h3><p>创建两个入口文件：<code>entry-client.js</code> 和 <code>entry-server.js</code>。</p><h4 id="entry-client-js" tabindex="-1"><a class="header-anchor" href="#entry-client-js"><span>entry-client.js</span></a></h4><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>import { createApp } from &quot;./main&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const { app, router, store } = createApp();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if (window.__INITIAL_STATE__) {</span></span>
<span class="line"><span>  store.replaceState(window.__INITIAL_STATE__);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>router.isReady().then(() =&gt; {</span></span>
<span class="line"><span>  app.mount(&quot;#app&quot;);</span></span>
<span class="line"><span>});</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="entry-server-js" tabindex="-1"><a class="header-anchor" href="#entry-server-js"><span>entry-server.js</span></a></h4><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>import { createApp } from &quot;./main&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>export default function render () {</span></span>
<span class="line"><span>  const { app, router, store } = createApp();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  return {</span></span>
<span class="line"><span>    app,</span></span>
<span class="line"><span>    router,</span></span>
<span class="line"><span>    store,</span></span>
<span class="line"><span>  };</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-创建服务器" tabindex="-1"><a class="header-anchor" href="#_5-创建服务器"><span>5. 创建服务器</span></a></h3><p>创建 <code>server.js</code> 文件，用于设置 Express 服务器：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>const express = require(&quot;express&quot;);</span></span>
<span class="line"><span>const fs = require(&quot;fs&quot;);</span></span>
<span class="line"><span>const path = require(&quot;path&quot;);</span></span>
<span class="line"><span>const { renderToString } = require(&quot;@vue/server-renderer&quot;);</span></span>
<span class="line"><span>const manifest = require(&quot;./dist/server/ssr-manifest.json&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const server = express();</span></span>
<span class="line"><span>const entry = path.join(__dirname, &quot;./dist&quot;, &quot;server&quot;, manifest[&quot;main.js&quot;]);</span></span>
<span class="line"><span>const render = require(entry).default;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * 1.使用 server.use(express.static(path.join(__dirname, &#39;./dist/client&#39;))); 会导致所有请求路径都被静态文件中间件处理，从而可能跳过服务器端渲染逻辑。</span></span>
<span class="line"><span> * 2.通过细粒度的静态文件服务配置，或者在配置静态文件服务时排除应用程序的路由，可以确保服务器端渲染逻辑（包括 asyncData 的触发）能够正常工作。</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>server.use(</span></span>
<span class="line"><span>  &quot;/img&quot;,</span></span>
<span class="line"><span>  express.static(path.join(__dirname, &quot;./dist/client&quot;, &quot;img&quot;))</span></span>
<span class="line"><span>);</span></span>
<span class="line"><span>server.use(&quot;/js&quot;, express.static(path.join(__dirname, &quot;./dist/client&quot;, &quot;js&quot;)));</span></span>
<span class="line"><span>server.use(</span></span>
<span class="line"><span>  &quot;/css&quot;,</span></span>
<span class="line"><span>  express.static(path.join(__dirname, &quot;./dist/client&quot;, &quot;css&quot;))</span></span>
<span class="line"><span>);</span></span>
<span class="line"><span>server.use(</span></span>
<span class="line"><span>  &quot;/favicon.ico&quot;,</span></span>
<span class="line"><span>  express.static(path.join(__dirname, &quot;./dist/client&quot;, &quot;favicon.ico&quot;))</span></span>
<span class="line"><span>);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>server.get(&quot;*&quot;, async (req, res) =&gt; {</span></span>
<span class="line"><span>  const { app, router, store } = render();</span></span>
<span class="line"><span>  router.push(req.url);</span></span>
<span class="line"><span>  await router.isReady();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  try {</span></span>
<span class="line"><span>    const matchedComponents = router.currentRoute.value.matched;</span></span>
<span class="line"><span>    // console.log(1, matchedComponents);</span></span>
<span class="line"><span>    // 主动触发所有匹配组件的 asyncData 函数</span></span>
<span class="line"><span>    await Promise.all(</span></span>
<span class="line"><span>      matchedComponents.map((Component) =&gt; {</span></span>
<span class="line"><span>        console.log(2, Component);</span></span>
<span class="line"><span>        if (Component.components.default.methods.asyncData) {</span></span>
<span class="line"><span>          return Component.components.default.methods.asyncData({</span></span>
<span class="line"><span>            app,</span></span>
<span class="line"><span>            router,</span></span>
<span class="line"><span>            store,</span></span>
<span class="line"><span>          });</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>      })</span></span>
<span class="line"><span>    );</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    const appContent = await renderToString(app);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    fs.readFile(</span></span>
<span class="line"><span>      path.join(__dirname, &quot;./dist/client/index.html&quot;),</span></span>
<span class="line"><span>      (err, html) =&gt; {</span></span>
<span class="line"><span>        if (err) {</span></span>
<span class="line"><span>          throw err;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        html = html</span></span>
<span class="line"><span>          .toString()</span></span>
<span class="line"><span>          .replace(&#39;&lt;div id=&quot;app&quot;&gt;&#39;, \`&lt;div id=&quot;app&quot;&gt;\${appContent}\`)</span></span>
<span class="line"><span>          .replace(</span></span>
<span class="line"><span>            &quot;&lt;/script&gt;&quot;,</span></span>
<span class="line"><span>            \`&lt;/script&gt;&lt;script type=&quot;application/javascript&quot;&gt;window.__INITIAL_STATE__=\${JSON.stringify(</span></span>
<span class="line"><span>              store.state</span></span>
<span class="line"><span>            )}&lt;/script&gt;\`</span></span>
<span class="line"><span>          );</span></span>
<span class="line"><span>        res.setHeader(&quot;Content-Type&quot;, &quot;text/html&quot;);</span></span>
<span class="line"><span>        res.send(html);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    );</span></span>
<span class="line"><span>  } catch (err) {</span></span>
<span class="line"><span>    if (err.code === 404) {</span></span>
<span class="line"><span>      res.status(404).end(&quot;Page not found&quot;);</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>      res.status(500).end(&quot;Internal Server Error&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>});</span></span>
<span class="line"><span></span></span>
<span class="line"><span>server.listen(8080, () =&gt; {</span></span>
<span class="line"><span>  console.log(&quot;Server is running at http://localhost:8080&quot;);</span></span>
<span class="line"><span>});</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_6-构建和运行" tabindex="-1"><a class="header-anchor" href="#_6-构建和运行"><span>6. 构建和运行</span></a></h3><p>在 <code>package.json</code> 中添加构建和启动脚本：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>&quot;scripts&quot;: {</span></span>
<span class="line"><span>    &quot;build:client&quot;: &quot;vue-cli-service build&quot;,</span></span>
<span class="line"><span>    &quot;build:server&quot;: &quot;cross-env SSR=1 vue-cli-service build&quot;,</span></span>
<span class="line"><span>    &quot;build&quot;: &quot;npm run build:client &amp;&amp; npm run build:server&quot;,</span></span>
<span class="line"><span>    &quot;start&quot;: &quot;node server.js&quot;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>运行以下命令构建项目并启动服务器：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>npm run build</span></span>
<span class="line"><span>npm start</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>访问 <code>http://localhost:8080</code>，你将看到服务器端渲染的 Vue 应用。</p><h2 id="ssr优缺点" tabindex="-1"><a class="header-anchor" href="#ssr优缺点"><span>SSR优缺点</span></a></h2><h3 id="优点" tabindex="-1"><a class="header-anchor" href="#优点"><span>优点</span></a></h3><ol><li><strong>更快的首屏加载速度</strong>：SSR 可以在服务器端生成完整的 HTML 页面，减少客户端渲染的时间，从而提高首屏加载速度。</li><li><strong>更好的 SEO</strong>：搜索引擎可以更好地抓取和索引服务器端渲染的内容，从而提高 SEO 友好性。</li><li><strong>更好的用户体验</strong>：SSR 可以在用户请求页面时立即返回完整的 HTML 内容，减少白屏时间，提高用户体验。</li></ol><h3 id="缺点" tabindex="-1"><a class="header-anchor" href="#缺点"><span>缺点</span></a></h3><ol><li><strong>更复杂的配置</strong>：SSR 需要额外的 Webpack 配置和服务器端代码，增加了项目的复杂性。</li><li><strong>更高的服务器负载</strong>：服务器需要处理更多的渲染任务，可能会增加服务器的负载。</li><li><strong>开发调试困难</strong>：SSR 的调试和开发相对复杂，需要处理更多的边界情况和错误。</li></ol>`,35))])}const v=e(t,[["render",d]]),m=JSON.parse('{"path":"/posts/%E6%A1%86%E6%9E%B6/ssr.html","title":"SSR","lang":"zh-CN","frontmatter":{"icon":"file-contract","date":"2024-12-01T00:00:00.000Z","category":["前端","vue"],"tag":["vue","SSR"],"description":"引言 服务器端渲染（Server-Side Rendering，简称 SSR）是指在服务器端生成 HTML 内容并发送到客户端的过程。与客户端渲染（Client-Side Rendering，简称 CSR）相比，SSR 可以提高首屏加载速度和 SEO 友好性。 如需更高级的集成框架可以使用nuxtjs","head":[["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"SSR\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2024-12-01T00:00:00.000Z\\",\\"dateModified\\":\\"2025-08-29T03:38:55.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Mr.ws\\",\\"url\\":\\"https://exploreoo.github.io/\\",\\"email\\":\\"3351550900@qq.com\\"}]}"],["meta",{"property":"og:url","content":"https://exploreoo.github.io/posts/%E6%A1%86%E6%9E%B6/ssr.html"}],["meta",{"property":"og:site_name","content":"WSPACE"}],["meta",{"property":"og:title","content":"SSR"}],["meta",{"property":"og:description","content":"引言 服务器端渲染（Server-Side Rendering，简称 SSR）是指在服务器端生成 HTML 内容并发送到客户端的过程。与客户端渲染（Client-Side Rendering，简称 CSR）相比，SSR 可以提高首屏加载速度和 SEO 友好性。 如需更高级的集成框架可以使用nuxtjs"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-08-29T03:38:55.000Z"}],["meta",{"property":"article:tag","content":"SSR"}],["meta",{"property":"article:tag","content":"vue"}],["meta",{"property":"article:published_time","content":"2024-12-01T00:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2025-08-29T03:38:55.000Z"}]]},"git":{"createdTime":1746970362000,"updatedTime":1756438735000,"contributors":[{"name":"exploreoo","username":"exploreoo","email":"1848820553@qq.com","commits":1,"url":"https://github.com/exploreoo"},{"name":"wangshuang70","username":"wangshuang70","email":"wangshuang70@meicloud.com","commits":5,"url":"https://github.com/wangshuang70"}]},"readingTime":{"minutes":3.93,"words":1178},"filePathRelative":"posts/框架/ssr.md","excerpt":"\\n<h2>引言</h2>\\n<p>服务器端渲染（Server-Side Rendering，简称 SSR）是指在服务器端生成 HTML 内容并发送到客户端的过程。与客户端渲染（Client-Side Rendering，简称 CSR）相比，SSR 可以提高首屏加载速度和 SEO 友好性。<br>\\n如需更高级的集成框架可以使用nuxtjs</p>\\n","autoDesc":true}');export{v as comp,m as data};
