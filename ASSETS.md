# 美术与音频来源

## 长卷美术

`public/art/` 中的长卷场景、近景、人物、梅花鹿、船及遮罩，为本项目独立构思并借助 AI 图像工具制作和整理的素材。没有复制参考网站的代码或图片。它们随本站源代码公开，供本项目运行与展示；根目录的 MIT 许可**不涵盖**这些图像。单独复用、再发布或另行授权，请先联系仓库维护者。

景点位置和建筑造型是依据公开景点资料创作的写意表现，不是官方导览图、测绘成果或历史复原图。磬锤峰位于山庄园外，作为园内视线中的借景呈现。

区域纵深阶段新增 `ruyi-island.webp`、`mountain-region.webp`、`wushu-close.webp`、`yanxun-close.webp`、`shuifang-close.webp`，并重绘 `near-yanyu.webp` 的人物船只及 `palace-hall.webp`、`plains-wenyuan-clean.webp` 的左缘地貌。上述画面由本项目用图像生成工具按原创提示词制作。对应原始 PNG 保存在 `sources/region-art/`，WebP 是运行时压缩版。提示词与资料核对见 [docs/region-stage-1.md](docs/region-stage-1.md)。生成画面不是景区实拍、官方地图或可靠的历史复原。

如意洲近观阶段另生成西岭晨霞、金莲映日、云帆月舫、澄波叠翠、观莲所、清晖亭、般若相、沧浪屿、一片云九幅独立近景，并以单檐方亭和园外借景关系修正山地画面。原始 PNG 保存在 `sources/ruyi-depth-art/`；`public/art/` 中相应 WebP 是运行压缩版。图像按既有研究资料独立构思，细部属意境演绎，不将未核实的建筑形制、位置和现状画作事实。名单、体积与审图要点见 [如意洲近观验收记录](docs/ruyi-depth-review.md)。

构建保留运行所需的人物、动物、船及透明前景 PNG；22 张已由 WebP 替代或未引用的旧景绘 PNG 留作源文件归档，不复制到 `dist/`，也不列入运行哈希清单。

湖山组团阶段新增千尺雪水系4景、梨花伴月组群4景、清舒山馆3景，共11幅各自独立的近景，另有3幅区域全景。原图与尺寸、压缩参数见 `sources/lake-depth-art/manifest.json`；史料范围与画作审阅见 [湖山组团记录](docs/lake-depth-review.md)。梨花伴月的完整院落为历史意境演绎，不能作为遗址今日仍存建筑的凭据；静好堂室内陈设和画屏为艺术想象，未作历史陈设认定。

## 界面图标

`public/art/github-mark.svg` 取自 GitHub 的 [Primer Octicons](https://github.com/primer/octicons/blob/main/icons/mark-github-16.svg)，仅用于标识通往本项目 GitHub 仓库的链接。Octicons 依 MIT 许可发布，版权为 GitHub Inc.；许可文本保存在 [sources/OCTICONS-LICENSE.md](sources/OCTICONS-LICENSE.md)。

## 背景音乐

- 作品：《平沙落雁》古琴录音，演奏与录制者 Charlie Huang，录制于 2006 年 4 月 23 日。
- [Wikimedia Commons 原始录音与许可页](https://commons.wikimedia.org/wiki/File:Pingsha_Luoyan.ogg)。
- 本项目选用 [Creative Commons Attribution 2.5 Generic（CC BY 2.5）](https://creativecommons.org/licenses/by/2.5/) 许可。请保留作者署名、来源、许可链接和改动说明。该录音的许可与本站代码 MIT 许可相互独立。
- 发布文件：`public/audio/pingsha-luoyan.m4a`。由原 Ogg Vorbis 文件转为 AAC/M4A，做了轻微的低频与高频过滤；网页以较低音量播放，并在首尾淡入淡出。转码后的文件不是原始录音。

网页“游览说明”中也展示上述署名与许可链接。`sources/AUDIO-LICENSE.md` 保留更详细的转码记录。

### 宫苑、平原、泉石与惠迪吉

14幅独立近景与4幅区域画卷均以本项目原创提示词通过AI图像工具生成；宫苑区域图对绮望楼轮廓作过一致性修正。原始文件与逐文件尺寸、字节数在 `sources/palace-plains-art/` 和其中的 `manifest.json`。具体陈设、楼层与相对布局为艺术演绎，游客正文中注明有据形制和资料限制。运行文件使用 `cwebp -q 88 -m 6` 转为 WebP，源 PNG 保留，不沿用参考网站绘景。

### 最终水岸题景

新增20幅独立近景和5幅区域画卷，原始25幅生成图片、尺寸及字节记录保存在 `sources/lake-finish-art/manifest.json`。双湖夹镜与长虹饮练采用同一低石堤长桥两端的独立画作；临芳墅与知鱼矶采用同一院落的花木和临水视点；青雀舫为静态历史御舟。运行图像用 `cwebp -q 88 -m 6` 转为WebP，原始PNG保留。具体亭制、山水和布局以游客文字注明的史料与艺术演绎边界为准，未复制参考网站素材。
