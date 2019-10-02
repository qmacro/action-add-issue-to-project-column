const core = require('@actions/core')
const github = require('@actions/github')

(async () => {

	console.log(`You sent ${core.getInput('project')} / ${core.getInput('column')}`)

	const octokit = new github.GitHub(core.getInput('myToken'))

	const { data } = await octokit.projects.listForRepo({
		owner: github.context.payload.repository.owner.login,
		repo: github.context.payload.repository.name
	})

	const projectNames = data.map(x => x.name)

	core.setOutput('projects', JSON.stringify(projectnames))

})()
