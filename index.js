const core = require('@actions/core')
const github = require('@actions/github')

async function run() {
  try {
    const token = core.getInput('myToken')
    console.log(`Token: ${token.slice(0,4)}... (total length ${token.length})`)
    console.log(`Context is '${JSON.stringify(github.context, undefined, 2)}'`)
    core.setOutput('projects', 'a,b,c')
  }
  catch (error) {
    core.setFailed(error.message)
  }
}

run()
