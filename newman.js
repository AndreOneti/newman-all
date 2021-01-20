require("dot_functions_utils");
const newman = require('newman'); // require newman in your project
const { execSync } = require('child_process');
const { readdirSync, rmdirSync } = require('fs');

rmdirSync(`./newman`, { recursive: true });

const executeNewman = newmanObj => new Promise((resolve, reject) => {
  newman.run(newmanObj, function (err) {
    if (err) return reject(err);
    console.log('collection run complete!');
    return resolve('collection run complete!');
  });
});

async function newmanFnc(opts) {
  opts.envPath
  opts.collectionPath
  opts.collectionfolderPath

  let newmanObj = {
    reporters: ['cli', 'json', 'htmlextra'],
  }

  if (opts.collectionPath) {
    console.log("------------------------------------------------------------------------------------------------------------------------------");
    console.log(opts.collectionPath);
    let commitInfo = execSync(`git log -1 --date=short --pretty=format:"Last commit by %an on %ad" -- ${opts.collectionPath}`).toString();
    commitInfo ? console.log(`\n${commitInfo}\n`) : console.log(`\nNo commit yet\n`);

    newmanObj.collection = require(opts.collectionPath);
    if (opts.envPath) newmanObj.environment = require(opts.envPath);

    await executeNewman(newmanObj);
  } else {
    const files = readdirSync(opts.collectionfolderPath, { encoding: "utf-8" });
    files.forEachSync(async collection => {
      console.log("------------------------------------------------------------------------------------------------------------------------------");
      console.log(`${opts.collectionfolderPath}/${collection}`);
      let commitInfo = execSync(`git log -1 --date=short --pretty=format:"Last commit by %an on %ad" -- ${opts.collectionfolderPath}/${collection}`).toString();
      commitInfo ? console.log(`\n${commitInfo}\n`) : console.log(`\nNo commit yet\n`);

      newmanObj.collection = require(`${opts.collectionfolderPath}/${collection}`);
      if (opts.envPath) newmanObj.environment = require(opts.envPath);

      await executeNewman(newmanObj);
    });
  }
}

module.exports = newmanFnc;
