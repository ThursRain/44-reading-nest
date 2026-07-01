# 44小窝共读

这是可以直接放到 GitHub Pages 的静态网页包。

## 上传方式

1. 打开仓库 `ThursRain/44-reading-nest`。
2. 上传本文件夹里的 `index.html`、`.nojekyll`、`README.md`。
3. 提交后等待 GitHub Pages 自动刷新。

## 这版包含

- 手机可直接打开，不需要电脑开服务器。
- TXT / Markdown 小说导入。
- 漫画图片导入。
- IndexedDB 本地保存书籍正文、漫画图片、书架和阅读进度。
- 刷新、关闭浏览器后仍可继续阅读。
- 阅读进度滑条。
- 纸张感沉浸阅读页。
- 小说短段会自动合并成更像电子书的一页，不会几个字占一整页。
- 旧书打开后也会自动重新分页，进度按百分比保留。
- “陪我看看这里”会请求你配置的 AI 接口；没配置时会明确提示。

## GPT 接入方式

GitHub Pages 是公开静态网页，不要把 OpenAI API Key 直接写进网页或上传到 GitHub。

推荐方式：

1. 用 `gpt-worker-openai.js` 部署一个 Cloudflare Worker。
2. 在 Worker 的环境变量/密钥里设置 `OPENAI_API_KEY`。
3. Worker 部署好后，会得到一个 `https://...workers.dev` 地址。
4. 打开网页首页的“AI 设置”，把这个地址粘进去。
5. 回到阅读页，点“陪我看看这里”。

注意：书籍保存在当前浏览器本地。如果清除 Safari / 浏览器网站数据，书架也会被清空。
