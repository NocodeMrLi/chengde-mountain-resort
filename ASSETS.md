# 美术与音频来源

## 长卷美术

`public/art/` 中的长卷场景、近景、人物、梅花鹿、船及遮罩，为本项目独立构思并借助 AI 图像工具制作和整理的素材。没有复制参考网站的代码或图片。它们随本站源代码公开，供本项目运行与展示；根目录的 MIT 许可**不涵盖**这些图像。单独复用、再发布或另行授权，请先联系仓库维护者。

景点位置和建筑造型是依据公开景点资料创作的写意表现，不是官方导览图、测绘成果或历史复原图。磬锤峰位于山庄园外，作为园内视线中的借景呈现。

区域纵深阶段新增 `ruyi-island.webp`、`mountain-region.webp`、`wushu-close.webp`，并重绘 `near-yanyu.webp` 的人物船只及 `palace-hall.webp`、`plains-wenyuan-clean.webp` 的左缘地貌。上述画面由本项目用图像生成工具按原创提示词制作。对应原始 PNG 保存在 `sources/region-art/`，WebP 是运行时压缩版。提示词与资料核对见 [docs/region-stage-1.md](docs/region-stage-1.md)。生成画面不是景区实拍、官方地图或可靠的历史复原。

## 界面图标

`public/art/github-mark.svg` 取自 GitHub 的 [Primer Octicons](https://github.com/primer/octicons/blob/main/icons/mark-github-16.svg)，仅用于标识通往本项目 GitHub 仓库的链接。Octicons 依 MIT 许可发布，版权为 GitHub Inc.；许可文本保存在 [sources/OCTICONS-LICENSE.md](sources/OCTICONS-LICENSE.md)。

## 背景音乐

- 作品：《平沙落雁》古琴录音，演奏与录制者 Charlie Huang，录制于 2006 年 4 月 23 日。
- [Wikimedia Commons 原始录音与许可页](https://commons.wikimedia.org/wiki/File:Pingsha_Luoyan.ogg)。
- 本项目选用 [Creative Commons Attribution 2.5 Generic（CC BY 2.5）](https://creativecommons.org/licenses/by/2.5/) 许可。请保留作者署名、来源、许可链接和改动说明。该录音的许可与本站代码 MIT 许可相互独立。
- 发布文件：`public/audio/pingsha-luoyan.m4a`。由原 Ogg Vorbis 文件转为 AAC/M4A，做了轻微的低频与高频过滤；网页以较低音量播放，并在首尾淡入淡出。转码后的文件不是原始录音。

网页“游览说明”中也展示上述署名与许可链接。`sources/AUDIO-LICENSE.md` 保留更详细的转码记录。
