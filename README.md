# 个人学术主页

个人学术主页，使用白底深蓝配色、左侧个人信息与导航、右侧研究内容及分层论文列表。手机自动变为单栏。内容结构参考 https://ruxi-shi.github.io/home/ 。

## 修改资料

编辑 `app/profile.ts` 集中更新姓名、介绍、研究方向、讨论班、论文、教学和联系方式。所有未提供信息都明确标为待填写；未设置邮箱时不会显示虚构邮件链接。

论文的 `links` 可设置为 `[{ label: 'arXiv', url: '真实论文链接' }]`，没有链接时不显示链接按钮。

## 运行

使用 Node.js 22.13+ 和 pnpm。

- `pnpm install` 安装依赖。
- `pnpm dev` 本地预览。
- `pnpm build` 生成 Sites 部署产物。

本项目使用 React / Vinext + Sites。参考网站本身使用 GitHub Pages + Jekyll，仓库 README 说明其模板为 Researcher：
https://github.com/ruxi-shi/home/blob/gh-pages/README.md

如果希望采用参考网站原本的 Markdown 维护方式，可另行使用 Researcher 模板，在 `_config.yml` 设置标题与导航，在 Markdown 文件中维护正文，并通过 GitHub Pages 发布。本项目的排版与页面代码独立编写，没有复制对方的个人资料或论文。

## GitHub Pages

已提供 `.github/workflows/pages.yml` 自动发布配置，适用于公开仓库 `你的GitHub用户名.github.io`，主分支为 `main`。

1. 将项目源码上传到该仓库（不上传 node_modules、dist、.env 文件或临时目录）。
2. 在仓库 Settings → Pages 中选择 GitHub Actions。
3. 推送 main 分支或在 Actions 中手动运行 Publish personal homepage。
4. 工作流成功后访问 `https://你的GitHub用户名.github.io/`。

`pnpm build:github` 导出并校验三个页面，生成 `dist/client`。也可以将该文件夹内容上传仓库根目录，用 Pages 的 main / root 分支发布。目录内的 `.nojekyll` 需要保留。

默认 `pnpm build` 继续使用 Sites 部署。GitHub 导出通过环境变量单独启用。此配置为根域名主页准备；若使用 `/home/` 等项目路径，需要进一步设置路径前缀。
