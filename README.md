# Action to automatically add a new issue to a project

This is based on the [actions/javascript-action](https://github.com/actions/javascript-action) template. It is a JavaScript action, rather than a Docker action. See [Action Types](https://github.com/actions/toolkit/blob/master/docs/action-types.md) for background info.

It is designed to run within the context of a repo, in other words, the issues we're talking about here are issues created in that repo's context, and the project is also specific to that repo (it's possible to have projects at other levels, e.g. org, but this action is for repo-specific projects).

To use it, create a workflow definition in your repo (this needs to be in `.github/workflows/`) that has a step using this action, and specify values for the following parameters which are required:

- `project`: the name of the project to which you want the issue auto-added
- `column`: the name of the specific column in that project in which you want the issue to appear

Note that when you add an issue to a project, you are actually, either explicitly or implicitly, adding it to a specific column in that project. Moreover (as background info) the issue isn't added 'directly'; the direct children of columns in a project are cards, and issues (as well as other entities) can be connected to a card. So basically what has to happen is that a new card has to be created, connected to the issue, and that card is added to a column in the project.

There's also another required parameter that you must specify:

- `token`: the secret that GitHub generates automatically for the context of this action's execution

The value of this token can be specified as `${{ secrets.GITHUB_TOKEN }}`.

Here's an example of a workflow definition that uses this action:

```yaml
on:
  issues:
    types: opened

jobs:
  list_projects:
    runs-on: ubuntu-latest
    name: Assign new issue to project
    steps:
    - name: Create new project card with issue
      id: list
      uses: qmacro/action-add-issue-to-project-column@v1
      with:
        token: ${{ secrets.GITHUB_TOKEN }}
        project: 'project1'
        column: 'Submitted'
```

Note that this action is designed to be executed on an "issue opened" event, hence the `on:` specification here.

Note that you should reference the '[v1](https://github.com/qmacro/action-add-issue-to-project-column/releases/tag/v1)' of this action, as shown here in the `uses:` line.

Make sure you specify the name of your project and project column accurately. The values here are just examples. You can use the `token: ${{ secrets.GITHUB_TOKEN }}` verbatim.
