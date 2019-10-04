const core = require('@actions/core')
const github = require('@actions/github')

/**
 * Assign a new issue to a project. This is at the repo level (there are projects
 * at other levels in GitHub too). To achieve this assignment, what is actually
 * necessary is the creation of a new Card in a specific Column of the specified
 * Project.
 *
 * The ultimate API call via Octokit for this is projects.createCard, which
 * takes three parameters for this purpose:
 * - column_id    : the ID of the column in the project that the new card is to be put in
 * - content_id   : the ID of the issue that is to be associated with this new card
 * - content_type : we use the string value 'Issue' to denote that what is associated
 *                  with the new card is an issue
 *
 * We can get the value for the content_id (the ID of the issue) from the rich context
 * that is made available to us (via github.context). To get the column_id, we need first
 * to find the projects in the repo, identify the desired project, then list the columns in
 * that project, getting the ID of the column required.
 *
 * Then we can call projects.createCard, noting that it seems that column ID is unique
 * across projects, as we don't have to specify a project ID that the column belongs to.
 */


// Helper functions
const byName = name => x => x.name === name


// Main code in an async block because Octokit's calls are async and we want to use await.
async function main() {

	try {

		// We get the rich context of the event for free. We also grab the values of the
		// three explicit step parameters 'project', 'column' and token (in the workflow YAML).
		const ctx = github.context.payload
		const prj = core.getInput('project')
		const col = core.getInput('column')
		const tkn = core.getInput('token')

		// See https://octokit.github.io/rest.js for this library. To be able to make
		// requests where authentication is required, we must pass in the token we get
		// from the job step.
		const octokit = new github.GitHub(tkn)

		core.info(`Attempting to assign new issue "${ctx.issue.title}" to repo project "${prj}" column "${col}"`)

		// Step 1 → projects.listForRepo()
		// -------------------------------

		// Get the repo's projects
		const { data: projects } = await octokit.projects.listForRepo({
			owner: ctx.repository.owner.login,
			repo: ctx.repository.name
		})
		core.info(`${projects.length} projects found for repo`)

		// Now find the specific project requested
		const project = projects.find(byName(prj))
		core.info(`Project '${prj}' found, ID is ${project.id}`)

		// Step 2 → projects.listColumns()
		// -------------------------------

		// List the columns for the requested project
		const { data: columns } = await octokit.projects.listColumns({
			project_id: project.id
		})
		core.info(`Columns found for project '${prj}': ${columns.map(x => x.name).join(', ')}`)

		// Now select the specific column requested
		const column = columns.find(byName(col))
		core.info(`Column '${col}' found, ID is ${column.id}`)

		// Step 3 → projects.createCard()
		// ------------------------------

		// Create the card with the issue ID associated with it, in the column specified
		// (nothing returned from this).
		await octokit.projects.createCard({
			column_id: column.id,
			content_id: ctx.issue.id,
			content_type: 'Issue'
		})
		core.info(`Assignment complete`)

	}
	catch (error) {

		core.setFailed(error.message)

	}

}

main()
