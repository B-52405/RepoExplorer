import { RepoExplorer } from "../index.js"

//仓库不存在时会自动新建一个仓库
//新建的仓库为私有仓库，无任何内容
const repo = await RepoExplorer.init("YOUR_AUTH", "YOUR_REPOSITORY_NAME")

//文件不存在则返回404
const content = await repo.get("FILE_PATH")
console.log(content)
