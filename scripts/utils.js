const { join } = require("path");
const { readFile } = require("fs");
const { exec } = require("child_process");
const util = require("util");
const readFilePromisified = util.promisify(readFile);

async function getReleaseTag() {
  const lernaRaw = await readFilePromisified(join(process.cwd(), "../../lerna.json"));
  const lernaJSON = JSON.parse(lernaRaw);
  const tag = lernaJSON.version;
  return `v${tag}`;
}

/**
 * Async. executes a CLI command
 * @param {*} command
 * @returns
 */
async function execProcess(command) {
  const execPromise = new Promise((resolve, reject) => {
    const processHandle = exec(command);
    if (command === "yarn workspaces info") {
      processHandle.stdout.on("data", (data) => {
        let parsedData = data;
        try {
          parsedData = JSON.parse(data);
          resolve(parsedData);
        } catch {}
      });
    } else {
      processHandle.stdout.on("data", (data) => {
        let parsedData = data;
        try {
          parsedData = JSON.parse(data);
        } catch (e) {
          console.error(`"${command}" output data could not be parsed into JSON. Data is: ${data}`);
          parsedData = parsedData.trim();
        } finally {
          resolve(parsedData);
        }
      });
    }

    processHandle.stdout.on("error", (err) => {
      reject(err);
    });
  });
  return execPromise;
}

/**
 * Returns internal dependencies' graph (@cv-artist/xyz packages only)
 * @param {boolean} isMermaid Indicate whether the dependency graph should be in Mermaid Markdown format.
 */
async function getInternalDependencyGraph(isMermaid) {
  let graph = await execProcess("yarn workspaces info");

  // Remove external dependencies from the graph
  for (const key in graph) {
    graph[key] = graph[key].workspaceDependencies;
  }

  // Generate markdown format
  if (isMermaid === true) {
    const mermaidNodes = ["graph LR;"];
    for (const [package, dependencies] of Object.entries(graph)) {
      for (const dependency of dependencies) {
        mermaidNodes.push(
          `${dependency.replace("@", "")}["${dependency}"] --> ${package.replace("@", "")}["${package}"];`
        );
      }
    }
    graph = mermaidNodes.join("\n");
  }

  return graph;
}

module.exports = { getReleaseTag, execProcess, getInternalDependencyGraph };
