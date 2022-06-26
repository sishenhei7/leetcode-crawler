# leetcode-crawler

> crawl, audit and show people's leetcode data

> 这是一个爬取 leetcode 记录 + 统计相关用户数据 + 展示用户数据的库

## reason

现在有很多 leetcode 的刷题群，但是都使用手动记录的方法，非常不方便，而且也没有可视化的展示，我打算解决这个痛点。

## preview

<https://sishenhei7.github.io/leetcode-crawler/app/index.html>

<https://sishenhei7.github.io/leetcode-crawler/users/browsnet.json>

## about

利用Github Action执行定时任务，抓取数据，并处理输出JSON保存提交至本仓库

- 用户数据
- 用户做题数据
- 总题库

Github 的comment接口抓取 用户注册数据

通过Leetcode的GraphQL抓取用户对应主页的数据

## todo

- [ ] 实现前端页面的数据展示
- [ ] 自动统计月维度的东西
- [ ] 数据可视化看板
- [ ] 加一个勋章功能
- [ ] 移动端展示
- [ ] 用rust重构数据处理脚本
