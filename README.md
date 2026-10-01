# 山庄入画 · 承德避暑山庄互动长卷

以承德避暑山庄为灵感创作的国风互动长卷。展开画卷，沿湖山游览，在烟雨楼等景点切换近景，并体验昼夜与晴雨变化。支持桌面和手机浏览器。

**[在线游览](https://nocodemrli.github.io/chengde-mountain-resort/)** · [查看最新线上构建](https://nocodemrli.github.io/chengde-mountain-resort/deployment.json)

![山庄入画的入园画面](docs/images/entrance.jpg)

<details>
<summary>展开查看画卷与烟雨楼近景</summary>

![湖区长卷：烟雨楼与画舫](docs/images/lake-scroll.jpg)

![烟雨楼建筑近景](docs/images/yanyu-closeup.jpg)

</details>

## 如何游览

1. 打开[在线作品](https://nocodemrli.github.io/chengde-mountain-resort/)，选择“展卷入园”。首次加载会读取较大的绘景图片，请稍候。
2. 在画面上拖动，或使用鼠标滚轮浏览长卷；使用画面中的导航、景点标记跳转。点击景点标记可进入近景，再返回全景。
3. 用底部和侧边控制切换景区、昼夜、烟雨与缩放；点击声音开关播放或静音古琴音乐。手机上可触摸拖动画面和点击控件。

目前有**四个景区、11 处景点**。湖面、云雾、灯火和山林带有动态效果；梅花鹿可以移动并响应点击。画中的人物和画舫为静态绘景，**不提供人物行走或乘船操作**。景点讲解为文字，尚无语音讲解。

画卷以景点和山庄地貌为依据进行写意组合，不能用于实地导航、建筑测绘或历史复原。磬锤峰在山庄园外，这里以园内借景呈现。本项目是独立创作，非景区官方产品。

## 本地运行

需要 **Node.js 18 或更新版本**；项目没有第三方运行依赖。

```sh
git clone https://github.com/NocodeMrLi/chengde-mountain-resort.git
cd chengde-mountain-resort
npm run dev
```

打开 <http://127.0.0.1:4173/>。端口被占用时，可用 `PORT=4174 npm run dev`。

```sh
npm run build
npm run preview
```

构建结果在 `dist/`，`preview` 用于本地检查构建后的页面。可在页面的 `data-build` 属性或 `/deployment.json` 中核对构建标识。

## 发布与更新

推送到 `main` 后，[Publish handscroll](.github/workflows/pages.yml) 工作流会构建并发布 `dist/` 到 GitHub Pages；Pages 的 Source 需设置为 **GitHub Actions**。部署完成后，仍使用上方同一个在线游览地址。发布及缓存刷新可能需要一些时间；若页面尚未更新，可查看 [Actions](https://github.com/NocodeMrLi/chengde-mountain-resort/actions) 和线上构建标识。

构建脚本会给 JavaScript、CSS 文件名及图像、音频 URL 加内容指纹，以便新版本加载对应资源。只修改本地文件不会更新线上版本。

## 项目文件

| 路径 | 内容 |
| --- | --- |
| `index.html`、`style.css`、`app.js` | 页面结构、视觉样式与交互 |
| `public/art/` | 长卷、景点近景、人物、动物和遮罩素材 |
| `public/audio/` | 古琴录音转码文件 |
| `scripts/build.mjs`、`server.mjs` | 静态构建、本地开发与预览 |
| `docs/images/` | README 展示图 |
| `ASSETS.md`、`sources/AUDIO-LICENSE.md` | 素材来源、改动及授权说明 |

## 许可与素材署名

- **源代码**：[MIT 许可](LICENSE)。该许可不适用于下述图像和音乐。
- **美术**：`public/art/` 为本项目独立构思、借助 AI 图像工具制作和整理的素材；不属于 MIT 许可。单独复用或再发布请先联系维护者。README 展示图是该作品的截图。
- **音乐**：[《平沙落雁》](https://commons.wikimedia.org/wiki/File:Pingsha_Luoyan.ogg)，演奏及录制：**Charlie Huang**，依据 [CC BY 2.5](https://creativecommons.org/licenses/by/2.5/) 使用。本站版本转为 AAC/M4A，并做轻微频段过滤；复用时须保留作者、来源、许可和改动说明。详见 [ASSETS.md](ASSETS.md)。

参考作品仅用于研究互动长卷的呈现方式，本项目没有复制其代码或美术。
