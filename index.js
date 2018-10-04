#!/usr/bin/env node
'use strict';

const { lstatSync, readdirSync } = require('fs')
const { join  } = require('path')
const simpleGit = require('simple-git')
const program = require('commander');

const packageJson = require('./package.json');

program
  .version(packageJson.version)
  .option('-d, --directory [value]', 'Target directory')
  .option('-r, --remote [value]', 'Git Remote', 'origin')
  .option('-b, --branch [value]', 'Git branch', 'master')
  .parse(process.argv);

program.on('--help', function(){
  console.log(`usage: git-puller -d <DIRECTORY_NAME>

examples: 
  git-puller -d .                                # Current directory
  git-puller -d ../../_my_project                # Other directory
  git-puller -d ./ -r origin -b master           # Specify remote and branch`);
});

const branch = program.branch;
const remote = program.remote;
const targetPath = program.directory;

if(!targetPath) return program.help();

const isDirectory = source => lstatSync(source).isDirectory()
const getDirectories = source => readdirSync(source).map(name => join(source, name)).filter(isDirectory)
const targetDirectories = getDirectories(targetPath).concat(targetPath);

targetDirectories.map((targetDirectory) => {
  const git = simpleGit(targetDirectory);

  git.fetch().pull(remote, branch, (err, update) => {
    if(err) return;
    console.log('\nDirectory: ', join(process.cwd(), targetDirectory));
    console.log(update);
    console.log();
  });
});