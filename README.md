# leetcode-crawler

crawl, audit and show people's leetcode data

## preview

<https://sishenhei7.github.io/leetcode-crawler/app/index.html>

<https://sishenhei7.github.io/leetcode-crawler/users/browsnet.json>

## 设计

利用Github Action执行定时任务，抓取数据，并处理输出JSON保存提交至本仓库

- 用户数据
- 用户做题数据
- 总题库

Github 的comment接口抓取 用户注册数据

通过Leetcode的GraphQL抓取用户对应主页的数据

## 待办

[] 实现前端页面的数据展示
[] 自动统计月维度的东西
[] 数据可视化看板
