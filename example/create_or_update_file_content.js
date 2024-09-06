import { RepoExplorer } from "../index.js"

//仓库不存在时会自动新建一个仓库
//新建的仓库为私有仓库，无任何内容
const repo = await RepoExplorer.init("YOUR_AUTH", "YOUR_REPOSITORY_NAME")

//如果文件不存在则会自动新建
await repo.update("FILE_PATH","CONTENT")
