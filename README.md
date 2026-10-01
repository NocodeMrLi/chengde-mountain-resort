# 山庄入画 · 承德避暑山庄互动长卷

一幅可探索的国风横向长卷，以承德避暑山庄的湖泊、宫殿、平原和山峦为主题。拖动或滚动画卷，进入景点近景，切换昼夜晴雨，听古琴《平沙落雁》。桌面和手机浏览器均可游览。

**公开演示：** https://nocodemrli.github.io/chengde-mountain-resort/

**线上构建标识：** https://nocodemrli.github.io/chengde-mountain-resort/deployment.json

> 独立创作的写意互动作品，非承德避暑山庄官方产品、导航地图、建筑测绘或历史复原。磬锤峰在山庄园外，作为园内借景呈现。

## 已实现的游览内容

- 四个景区、11 处景点；景点标记、上方景区导航和下方景点导航均可跳转。
- 横向拖动、鼠标滚轮浏览与画卷缩放；点击景点进入近景，返回时恢复先前全景位置。
- 烟雨楼等近景有可切换的云雾效果；湖面涟漪、昼夜与晴雨变化、灯火和山林动态。
- 湖区画作内的人物和画舫保持原画中的静态姿态；其他区域有少量静态人物。梅花鹿可移动、觅食与警觉，点击可观察。
- 可开关的古琴配乐及文字景点讲解。景点语音讲解尚未发布。

长卷建筑与地理关系均为写意组合。湖区景点文字参照[避暑山庄官网](https://www.bishushanzhuang.com.cn/)；历史背景也参照[国立故宫博物院避暑山庄展览](https://theme.npm.edu.tw/exh111/ChengdeSummerResort/index.html)。画面中的某些接缝保留了不同绘景的色调差异。

## 本地运行

需要 Node.js 18 或更新版本，无需安装第三方依赖。

```sh
npm run dev
```

打开 http://127.0.0.1:4173/ 。可用 `PORT=4174 npm run dev` 更换端口。

```sh
npm run build
npm run preview
```

`build` 将静态网站输出到 `dist/`；`preview` 在本地检查构建结果。构建会给 JavaScript、CSS 使用内容哈希文件名，并为图像和音频 URL 附加内容指纹，使新发布版本请求对应的新资源。部署入口页也写入构建标识，可在页面的 `data-build` 属性或 `deployment.json` 中核对。

## 自动发布与更新

本站使用 GitHub Pages 公共 CDN。`.github/workflows/pages.yml` 在每次推送到 `main` 后自动运行 `npm run build` 并发布 `dist/`。仓库的 **Settings → Pages → Build and deployment → Source** 应设为 **GitHub Actions**。

在此仓库修改并提交后，执行：

```sh
git push origin main
```

待仓库 **Actions → Publish handscroll** 显示部署成功，继续使用上方同一个公开演示网址即可查看新版。仅修改本地文件不会自动更新线上站点；需要推送到 `main`。GitHub Pages 发布与 CDN 缓存刷新需要时间，并非提交后瞬间同步。若看到旧页面，可稍候重新加载并查看 `deployment.json` 的构建标识。

## 项目结构

- `index.html`、`style.css`、`app.js`：网页与交互源代码。
- `public/art/`：独立绘制的长卷、景点近景、人物与动物素材。
- `public/audio/`：网站播放的古琴录音转码文件。
- `scripts/build.mjs`：无外部依赖的静态构建与资源指纹。
- `server.mjs`：仅用于本地开发和预览的静态服务器。
- `sources/AUDIO-LICENSE.md`、`ASSETS.md`：第三方录音署名和美术说明。

## 许可与署名

源代码采用 [MIT 许可](LICENSE)。`public/art/` 的 AI 辅助创作美术不属于 MIT 许可；单独复用需联系维护者。背景录音为 Charlie Huang 演奏、录制的[《平沙落雁》](https://commons.wikimedia.org/wiki/File:Pingsha_Luoyan.ogg)，按 [CC BY 2.5](https://creativecommons.org/licenses/by/2.5/) 使用，已转为 AAC/M4A 并轻度过滤。详情见 [ASSETS.md](ASSETS.md)。

参考作品仅用于理解长卷交互形式，本项目未复制其代码或美术。
