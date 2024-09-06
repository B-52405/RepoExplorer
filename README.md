# RepoExplorer

RepoExplorer 是一个基于Octokit的库，提供以类似读写本地文件的方式，读写Github仓库中文件的功能。


# 使用方式

### 浏览器

```
<script type="module">
    import { RepoExplorer } from "https://esm.sh/repo-explorer";
</script>
```

### Node

```
import { RepoExplorer } from "repo-explorer";
```

# API

### 初始化

```
import { RepoExplorer } from "repo-explorer";

//仓库不存在时会自动新建一个仓库
//新建的仓库中无任何内容
const repo = await RepoExplorer.init("YOUR_AUTH", "YOUR_REPOSITORY_NAME");
```

### 读取文件内容

```
//文件路径格式例如：src/index.js
const content = await repo.get("FILE_PATH");
```

### 新建或更新文件

```
//如果文件不存在则会自动新建
//content为可选参数，默认为空
await repo.update("FILE_PATH","CONTENT");
```

### 检查文件是否存在

```
const exist = await repo.exist("FILE_PATH");
```

### 删除文件

```
//如果文件存在则删除文件
await repo.del("FILE_PATH");
```

### 获取用户ID

```
//打印AUTH对应的Github用户的用户名
console.log(repo.owner())
```

### 获取文件链接

```
//打印仓库中原始文件链接
//branch可选，默认值为"main"
console.log(repo.raw("YOUR_FILE_PATH","BRANCH"))
```
