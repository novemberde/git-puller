#!/usr/bin/env node
'use strict';

const child_process = require("child_process");
const exec = command => {
  console.log("Execute: ",command)

  return new Promise((resolve, reject) => {
    return child_process.exec(command, (err, stdout, stderr) => {
      if(err) return reject(stderr, command);
      return resolve(stdout, command);
    });
  });
}
const args = process.argv.slice(2);

function* generatorFunction (cmdList) {
  for(let i=0; i<cmdList.length; i++) {
    yield exec(cmdList[i])
  }
}
function recursiveGenerator (cmdGen) {
  const genResult = cmdGen.next();

  if(genResult.done === true) return;

  return genResult.value.then( (stdout, command) => {
    console.log(stdout);
    return recursiveGenerator(cmdGen);
  })
  .catch( err => {
    console.error(err)
    return recursiveGenerator(cmdGen);
  });
  
}

let promiseList = [];
let directoryName = null;

if (args[0]) directoryName = `${args[0]}/*/`;
else directoryName = "*/"

return exec(`ls -d ${directoryName}`)
.then(stdout => {
  let directoryList = stdout.split('/\n').filter(d => d.length>0)

  console.log("Directory list: ");
  for(let i=0; i<directoryList.length; i++) {
    console.log(`  ${directoryList[i]}`);
  }
  console.log();

  // Default is specified Directory
  let cmdList = [`cd ${args[0]} && git fetch && git pull origin`];

  for(let i=0; i<directoryList.length; i++) {
    let cmd = "cd ";

    cmd += directoryList[i];
    cmd += " && git fetch && git pull origin";

    cmdList.push(cmd);
  }

  const cmdGen = generatorFunction(cmdList);

  return recursiveGenerator(cmdGen);
})
.catch((err, cmd) => {
  console.error("Occured an error: ",cmd);
  console.error(err);
});