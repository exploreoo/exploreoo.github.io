---
icon: file-contract
date: 2024-12-02
category:
  - 前端 
  - 合集
tag:
  - 工具
  - git
---

# git合集



常用的工作流操作

```
git cherry-pick --no-edit [commitId1] [commitId2]  // 建议使用edit
git rebase -i [commitId]
:wq

`fatal: refusing to merge unrelated histories` 错误通常发生在尝试合并两个没有共同历史的 Git 仓库时。这个错误在子模块操作中也可能出现，特别是在你尝试更新或合并子模块时。
git pull origin main --allow-unrelated-histories

// 变基推送 
git push --force-with-lease origin master
```

