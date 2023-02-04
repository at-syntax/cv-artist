const { execProcess } = require("./utils");

/**
 * Prevents developers from committing to the master branch
 */
async function protectBranch() {
  const branchName = await execProcess("git rev-parse --abbrev-ref HEAD");
  const userName = await execProcess("git config user.name");
  const userEmail = await execProcess("git config user.email");
  if (
    branchName === "master" &&
    (userName !== "saikat-samanta" ||
      userEmail !== "saikatsamanta737@gmail.com")
  ) {
    console.error(
      `🚫 Operation is not possible on remote ${branchName} branch, please create separate branch and use PR.`,
    );
    process.exit(1);
  }
}

protectBranch();
