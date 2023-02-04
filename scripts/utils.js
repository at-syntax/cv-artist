const { join } = require("path");
const { readFile } = require("fs");
const { spawn, exec } = require("child_process");
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

function spawnProcess({ command, args, cwd }) {
  const taskPromise = new Promise((resolve, reject) => {
    const commandString = `${command} ${args.join(" ")}`;

    console.log(`Starting ${commandString}`);

    const handle = spawn(command, args, { cwd });

    handle.stdout.on("data", (data) => {
      console.log(`stdout: ${data}`);
    });

    handle.stderr.on("data", (data) => {
      console.log(`stderr: ${data}`);
    });

    handle.on("close", (code) => {
      console.log(`${commandString} successful. Child process exited with code ${code}.`);
      resolve(true);
    });

    handle.stderr.on("error", (data) => {
      console.error(`${commandString} failed. Error: ${data}`);
      reject(false);
    });
  });

  return taskPromise;
}

/**
 * Returns internal dependencies' graph (@manufac-analytics/xyz packages only)
 * @param {boolean} isMermaid Indicate whether the dependency graph should be in Mermaid Markdown format.
 */
async function getInternalDependenyGraph(isMermaid) {
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

/**
 * Get package-name:ports dictionary
 */
async function getPortsDictionary() {
  let graph = await execProcess("yarn workspaces info");
  const dependencies = Object.keys(graph);
  const basePortNumber = 6001;
  const portsDictionary = dependencies.reduce((acc, curr) => {
    return { ...acc, [curr]: basePortNumber + Object.keys(acc).length };
  }, {});
  return portsDictionary;
}

module.exports = { getReleaseTag, execProcess, spawnProcess, getInternalDependenyGraph, getPortsDictionary };