const core = require('@actions/core')
const github = require('@actions/github')

async function run() {
  try {
    const repo = core.getInput('repo')
    console.log(`Repo '${repo}' specified`)
    console.log(`Context is '${JSON.stringify(github.context, undefined, 2)}'`)
    core.setOutput('projects', 'a,b,c')
  }
  catch (error) {
    core.setFailed(error.message)
  }
}

run()
