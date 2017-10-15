#!/usr/bin/env node
'use strict';

const { lstatSync, readdirSync } = require('fs')
const { join } = require('path')
const simpleGit = require('simple-git')
const path = require('path')

const isDirectory = source => lstatSync(source).isDirectory()
const getDirectories = source => readdirSync(source).map(name => join(source, name)).filter(isDirectory)

const [
  targetPath,
  remote="origin",
  branch="master"
] = process.argv.slice(2);

const targetDirectories = getDirectories(targetPath).concat(targetPath);

targetDirectories.map((targetDirectory) => {
  const git = simpleGit(path.join(__dirname, targetDirectory));
  
  git.fetch().pull(remote, branch, (err, update) => {
    if(err) return console.error(err);
    console.log("Directory: ", targetDirectory);
    console.log(update);
    console.log();
  });

});