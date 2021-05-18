const core = require('@actions/core');
const github = require("@actions/github");


// most @actions toolkit packages have async methods
async function run() {
  try {

    const githubToken = core.getInput("GITHUB_TOKEN", { required: true });
    const fromBranch = core.getInput("FROM_BRANCH", { required: true });
    const toBranch = core.getInput("TO_BRANCH", { required: true });

    const {
      payload: { repository: {name: repo, owner: {login: owner}} }
    } = github.context;

    const octokit = github.getOctokit(githubToken)

    const { data: pullRequest } = await octokit.rest.pulls.create({
      owner,
      repo,
      head: fromBranch ,
      base: toBranch,
      title: `sync: ${fromBranch} to ${toBranch}`,
      body: `sync-branches: New code has just landed in ${fromBranch}, so let's bring ${toBranch} up to speed!`,
    });

    
    const {data} = await octokit.rest.pulls.merge({
      owner,
      repo,
      pull_number: pullRequest.number
    });

    console.log(data)
  } catch (error) {

    core.setFailed(error.message);
  }
}

run();
