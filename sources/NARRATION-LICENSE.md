# 合成讲解来源与许可

讲解文案为本项目依据景点资料编写。讲解使用固定的Dylan男声音色离线生成，未使用真人录音克隆或浏览器系统声音。

- 原模型：[Qwen3-TTS-12Hz-1.7B-CustomVoice](https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-CustomVoice)，发布者Qwen，模型页标注Apache License 2.0。
- 使用的8bit量化：[mlx-community/Qwen3-TTS-12Hz-1.7B-CustomVoice-8bit](https://huggingface.co/mlx-community/Qwen3-TTS-12Hz-1.7B-CustomVoice-8bit)，固定修订`41d3337e8b7f2843a75841595fc14e4b9a7a4b96`，模型页同样标注Apache License 2.0。
- 推理工具：[mlx-audio](https://github.com/Blaizzy/mlx-audio)，MIT许可，固定修订`94c7716212b2228f178d2f9c7619a591fd1b0b78`。
- [Apache License 2.0正文](https://www.apache.org/licenses/LICENSE-2.0)。模型和工具只用于本地生成，权重、推理环境和母带不放入网站发布包。
- 生成后统一响度、处理首尾平滑并编码为AAC；没有变调或变速。文件`public/audio/guide-*.m4a`与逐段实际输入、SHA256、参数记录一同自托管。

这84段音频为本次新增的项目合成讲解，随网站提供在线播放，在项目权利人可适用的权利范围内保留权利；另行复用请取得授权，详见根目录LICENSE。此前MIT历史版本的既有授权不受此说明影响。上述模型和工具许可适用于各自模型、代码，不意味着它们自动为所有生成输出规定许可。背景音乐另依CC BY 2.5；绘景另按ASSETS.md说明。
