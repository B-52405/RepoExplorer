import { Octokit } from "@octokit/rest"

class RepoExplorer {
    #octokit
    #owner
    #repo
    #sha = {}

    static #default_header = {
        'X-GitHub-Api-Version': '2022-11-28',
        accept: 'application/vnd.github+json'
    }

    constructor() {
        this.init = async (auth, repo) => {
            this.#octokit = new Octokit({
                auth: auth
            })

            await this.#octokit.request('GET /user', {
                headers: RepoExplorer.#default_header
            })
                .then(response => {
                    this.#owner = response.data.login
                })

            await this.#octokit.request('GET /repos/{owner}/{repo}', {
                owner: this.#owner,
                repo: repo,
                headers: RepoExplorer.#default_header
            })
                .then(response => {
                    this.#repo = repo
                })
                .catch(async error => {
                    await this.#octokit.request('POST /user/repos', {
                        name: repo,
                        'private': false,
                        headers: RepoExplorer.#default_header
                    })
                        .then(response => {
                            this.#repo = repo
                        })
                })
        }
    }

    async #get_repository_content(path) {
        return await this.#octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
            owner: this.#owner,
            repo: this.#repo,
            path: path,
            headers: RepoExplorer.#default_header
        })
    }

    async #create_or_update_file_contents(path, content, action) {
        return await this.#octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
            owner: this.#owner,
            repo: this.#repo,
            path: path,
            message: `${action} ${path}. ${new Date().toLocaleString("zh-CN")}`,
            content: btoa(content),
            sha: this.#sha[path],
            headers: RepoExplorer.#default_header
        })
    }

    async #get_sha(path) {
        if (this.#sha[path] === undefined) {
            await this.#get_repository_content(path)
                .then(response => {
                    this.#sha[path] = response.data.sha
                })
                .catch(error => {
                    if (error.status !== 404) {
                        throw error
                    }
                })
        }
        return this.#sha[path]
    }

    async exist(path) {
        return await this.#get_repository_content(path)
            .then(response => {
                return true
            })
            .catch(error => {
                if (error.status !== 404) {
                    throw error
                }
                return false
            })
    }

    async get(path) {
        return await this.#get_repository_content(path)
            .then(response => {
                this.#sha[path] = response.data.sha
                return atob(response.data.content)
            })
    }

    async update(path, content) {
        await this.#get_sha(path)
        const action = this.#sha[path] === undefined ? "Create" : "Update"

        await this.#create_or_update_file_contents(path, content, action)
            .then(response => {
                this.#sha[path] = response.data.content.sha
            })
    }

    async del(path) {
        const sha = this.#get_sha(path)

        if (sha !== undefined) {
            await this.#octokit.request('DELETE /repos/{owner}/{repo}/contents/{path}', {
                owner: this.#owner,
                repo: this.#repo,
                path: path,
                message: `Delete ${path}. ${new Date().toLocaleString("zh-CN")}`,
                sha: this.#sha[path],
                headers: RepoExplorer.#default_header
            })
                .then(response => {
                    delete this.#sha[path]
                })
        }
    }

    owner() {
        return this.#owner
    }

    raw(path, branch = "main") {
        return `https://raw.githubusercontent.com/${this.#owner}/${this.#repo}/${branch}/${path}`
    }
}

const repo_explorer_factory = {
    init: async (auth, repo) => {
        const repo_explorer = new RepoExplorer()
        await repo_explorer.init(auth, repo)
        delete repo_explorer.init
        return repo_explorer
    }
}

export {
    repo_explorer_factory as RepoExplorer
}
