const child_process = require("child_process");
const exec = command => {
  return new Promise((resolve, reject) => {
    child_process.exec(command, (err, stdout, stderr) => {
      if(err) return reject(stderr);
      return resolve(stdout);
    });
  });
}
const args = process.argv.slice(2);

let promiseList = [];
let directoryName = null;

if (args[0]) directoryName = `${args[0]}/*/`;
else directoryName = "*/"

return exec(`ls -d ${directoryName}`)
.then(stdout => {
  let directoryList = stdout.split('/\n').map(d => {
    const lastSlashIndex = d.lastIndexOf("/");

    return d.slice(lastSlashIndex+1);
  });
})
.catch(err => console.error(err));