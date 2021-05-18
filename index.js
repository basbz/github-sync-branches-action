const core = require('@actions/core');
const github = require("@actions/github");


// most @actions toolkit packages have async methods
async function run() {
  try {
     const {
      payload: { repository }
    } = github.context;

    const githubToken = core.getInput("GITHUB_TOKEN", { required: true });
    const octokit = github.getOctokit(githubToken)
    const fromBranch = "main"
    const toBranch = "develop"

    const { data: pullRequest } = await octokit.rest.pulls.create({
        owner: repository.owner.login,
        repo: repository.name,
        head: fromBranch ,
        base: toBranch,
        title: `sync: ${fromBranch} to ${toBranch}`,
        body: `sync-branches: New code has just landed in ${fromBranch}, so let's bring ${toBranch} up to speed!`,
      });


    console.log(pullRequest)
  } catch (error) {

    core.setFailed(error.message);
  }
}

run();
