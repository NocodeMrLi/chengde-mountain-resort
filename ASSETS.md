# 美术与音频来源

## 长卷美术

`public/art/` 中的长卷场景、近景、人物、梅花鹿、船及遮罩，为本项目独立构思并借助 AI 图像工具制作和整理的素材。没有复制参考网站的代码或图片。仓库和网站公开供作品展示、查阅；此前代码MIT许可不涵盖这些图像。项目自有新增成果在可适用的权利范围内保留权利，详见根目录LICENSE；单独复用、改编、再发布或商业使用，请先取得授权。公开可下载不代表授权其他用途。

景点位置和建筑造型是依据公开景点资料创作的写意表现，不是官方导览图、测绘成果或历史复原图。磬锤峰位于山庄园外，作为园内视线中的借景呈现。

## 背景音乐

- 作品：《平沙落雁》古琴录音，演奏与录制者 Charlie Huang，录制于 2006 年 4 月 23 日。
- [Wikimedia Commons 原始录音与许可页](https://commons.wikimedia.org/wiki/File:Pingsha_Luoyan.ogg)。
- 本项目选用 [Creative Commons Attribution 2.5 Generic（CC BY 2.5）](https://creativecommons.org/licenses/by/2.5/) 许可。请保留作者署名、来源、许可链接和改动说明。该录音的许可与本站代码 MIT 许可相互独立。
- 发布文件：`public/audio/pingsha-luoyan.m4a`。由原 Ogg Vorbis 文件转为 AAC/M4A，做了轻微的低频与高频过滤；网页以较低音量播放，并在首尾淡入淡出。转码后的文件不是原始录音。

网页“游览说明”中也展示上述署名与许可链接。`sources/AUDIO-LICENSE.md` 保留更详细的转码记录。

## 景点讲解

`public/audio/guide-*.m4a` 为 84 段项目合成男声讲解，包括 72 景全文及主卷讲解。使用固定 Dylan 音色、普通话和历史导游风格指令；没有使用女声降调、真人声音克隆或浏览器系统音色。音频经响度统一、首尾平滑后编码为单声道 24 kHz AAC。

`public/audio/guide-manifest.json` 记录每段实际输入、文件 SHA256、时长、固定模型修订及生成参数，供覆盖和完整性校验。音频由本站提供，点击讲解按钮后才加载；模型、临时样音、母带和推理环境不进入发布包。许可边界和上游链接见 [合成讲解来源与许可](sources/NARRATION-LICENSE.md)。

## 界面图标

GitHub 标记使用 Octicons，依据 MIT 许可，详见 [Octicons 许可](sources/OCTICONS-LICENSE.md)。

## 字体

页面可选用 Google Fonts 提供的 Noto Serif SC，属于上游字体，采用 [SIL Open Font License 1.1](https://github.com/google/fonts/blob/main/ofl/notoserifsc/OFL.txt)；未将字体声明为项目自有成果。加载不可用时使用系统宋体或衬线字体。字体资源由 Google 提供，不包含于本项目发布包。

雨水与夜间光效由本项目的 Canvas/CSS 逻辑绘制。参考长卷作品仅用于观察动态表现，没有复制其代码或未授权素材。
