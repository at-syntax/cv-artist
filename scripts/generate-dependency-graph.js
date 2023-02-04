const { getInternalDependencyGraph } = require("./utils");

getInternalDependencyGraph(true)
  .then((response) => {
    console.log("Dependency graph successfully generated.");
    console.log(response);
  })
  .catch((e) => {
    console.error("Dependency graph could not be generated.");
  });
