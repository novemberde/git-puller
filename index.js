#!/usr/bin/env node
'use strict';

(function () {
  const { lstatSync, readdirSync } = require('fs')
  const { join } = require('path')
  const simpleGit = require('simple-git')
  const program = require('commander');
  const packageJson = require('./package.json');

  program
    .version(packageJson.version)
    .option('-d, --directory [value]', 'Target directory')
    .option('-r, --remote [value]', 'Git Remote', 'origin')
    .option('-b, --branch [value]', 'Git branch', 'master')
    .parse(process.argv);


  program.on('--help', function () {
    console.log(`
examples: 
  git-puller -d ./                       # Current directory
  git-puller -d ../../_my_project        # Other directory
  git-puller -d ./ -r origin -b master   # Specify remote and branch

  gp -d ./                               # Current directory
  gp -d ../../_my_project                # Other directory
  gp -d ./ -r origin -b master           # Specify remote and branch`);
  });

  const branch = program.branch;
  const remote = program.remote;
  const targetPath = program.directory;

  if (!targetPath) return program.help();

  const isDirectory = source => lstatSync(source).isDirectory()
  const getDirectories = source => readdirSync(source).map(name => {
    return join(source, name)
  }).filter(isDirectory)
  const targetDirectories = getDirectories(targetPath).concat(targetPath);

  targetDirectories.map((targetDirectory) => {
    const git = simpleGit(targetDirectory);
    
    // git.checkIsRepo((err, result) => {
    // });
    git.fetch().pull(remote, branch, (err, update) => {
      if (err) return;
      console.log('\nDirectory: ', join(process.cwd(), targetDirectory));
      if(update.files.length === 0) return console.log("lastest")
      console.log(update);
    });
  });
})();