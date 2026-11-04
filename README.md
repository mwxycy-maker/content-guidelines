# content-guidelines

内容制作规范：按 B 站头部知识类账号风格整理的视频制作 Skill，可直接装进 Claude Code 使用。

| Skill | 风格 | 适合题材 |
|---|---|---|
| [chaping-style](skills/chaping-style/SKILL.md) | 差评君 | 科技/社会议题长视频 |
| [xiaolin-style](skills/xiaolin-style/SKILL.md) | 小Lin说 | 财经、商业、金融知识 |
| [yingshijufeng-style](skills/yingshijufeng-style/SKILL.md) | 影视飓风 | 影像技术、行业科普 |
| [hetongxue-style](skills/hetongxue-style/SKILL.md) | 何同学 | 科技创意、产品体验 |
| [aliang-style](skills/aliang-style/SKILL.md) | 跟着阿亮学AI | AI 工具部署教程、大模型横评 |

每个 Skill 包含 `SKILL.md`（总览与核心规格）和 `references/`（口播稿、画面、剪辑、动效、声音、交付检查清单）。

## 安装

把需要的目录复制到 `~/.claude/skills/` 下即可：

```bash
cp -R skills/* ~/.claude/skills/
```

## 网页播放器（web-player）

[`web-player/`](web-player/README.md) 是配套的浏览器剪辑预览引擎：纯 HTML + JavaScript + Canvas，不依赖 npm，音轨做主时钟，支持拖动、镜头跳转、0.25–4× 倍速、逐帧和全屏，可按需用 Playwright + FFmpeg 逐帧导出 MP4。按上面任一风格写好分镜后，用它把每期视频做成可实时播放的网页。

```bash
python3 web-player/init_project.py /你的新项目/剪辑预览
python3 /你的新项目/剪辑预览/serve.py --port 8771
# 打开 http://127.0.0.1:8771/index.html
```

详见 [web-player/README.md](web-player/README.md) 与 [实现与复用指南](web-player/实现与复用指南.md)。

## 说明

各频道的名称、字标、主持人形象和布景属于原作者。这些规范只提炼结构、节奏、动效语法和配色逻辑，做自己的视频时请换成自己的品牌。
