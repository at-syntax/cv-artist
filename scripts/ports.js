const { getPortsDictionary } = require("./utils");

getPortsDictionary().then((dictionary) => {
  console.log(dictionary[process.argv[2] ?? process.env.npm_package_name]); // Used in CLI via command substitution
});
