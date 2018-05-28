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

if(!targetPath || targetPath === "--help") {
  const helpText = `
usage: git-puller <DIRECTORY_NAME>

examples: 
  git-puller .                                # current directory
  git-puller ../../_my_project                # other directory
  git-puller ../../_my_project origin master  # git pull REMOTE BRANCH`
  console.log(helpText);
  return;
}

const targetDirectories = getDirectories(targetPath).concat(targetPath);

targetDirectories.map((targetDirectory) => {
  const git = simpleGit(targetDirectory);
  
  git.fetch().pull(remote, branch, (err, update) => {
    if(err) return;
    console.log(update);
    console.log();
  });

});