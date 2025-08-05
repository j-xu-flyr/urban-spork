(async function () {
  // Board page view
  const queryMatches = window.location.search.match(/selectedIssue=(\w+-\d+)/);
  // Main ticket page
  const pathnameMatches = window.location.pathname.match(/browse\/(\w+-\d+)/);
  const ticketID = queryMatches
    ? queryMatches[1]
    : pathnameMatches
    ? pathnameMatches[1]
    : "";
  if (!ticketID) {
    console.warn("No open jira ticket found in this page");
    return;
  }

  const issue = await jQuery.getJSON("/rest/api/3/issue/" + ticketID);
  const jiraTicketTitle = issue.fields.summary
    .replace(/[^a-z0-9A-Z]/g, " ") // Replace anything else with space
    .replace(/  /g, " ") // Replace double space
    .trim();
  const jiraTicketType = issue.fields.issuetype.name.toLowerCase();

  const ticketToGithubTitle = {
    bug: "fix",
    // add any other special mapping Jira to GitHub title here, apart from featrures
  };
  const githubPRType = ticketToGithubTitle?.[jiraTicketType] || "feat";
  const githubPRTitle = `${githubPRType}: ${ticketID} ${jiraTicketTitle}`;

  const ticketToGithubBranch = {
    bug: "fix",
    // add any other special mapping Jira to GitHub branch type here, apart from featrures
  };
  const githubBranchType = ticketToGithubBranch?.[jiraTicketType] || "feature";

  const githubBranch = `${githubBranchType}/${ticketID}`;

  prompt("Copy your branch name:", githubBranch);
  if (githubBranchType === "fix") {
    prompt(
      "Copy your hotfix branch name:",
      `hotfix-integration/${githubBranch}`
    );
    prompt("Copy your hotfix branch name:", `hotfix-prod/${githubBranch}`);
  }
  prompt("Copy your PR title:", githubPRTitle);
})();
