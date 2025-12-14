#!/usr/bin/env node

import { join } from 'path';
import { simpleGit, SimpleGit, PullResult } from 'simple-git';
import { Command } from 'commander';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { getDirectories } from './utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface PullOptions {
  directory: string;
  remote: string;
  branch: string;
}

interface PullResultWithPath {
  path: string;
  result: PullResult;
  error?: Error;
}

const packageJson = JSON.parse(
  readFileSync(join(__dirname, '../package.json'), 'utf-8')
);

async function detectBranch(
  git: SimpleGit,
  remote: string
): Promise<string> {
  try {
    // Get all remote branches
    const branches = await git.branch(['-r']);
    const remoteBranches = branches.all.map((b) =>
      b.replace(`${remote}/`, '')
    );

    // Check for main branch first
    if (remoteBranches.includes('main')) {
      return 'main';
    }

    // Check for master branch second
    if (remoteBranches.includes('master')) {
      return 'master';
    }

    // Fall back to current branch
    const currentBranch = await git.revparse(['--abbrev-ref', 'HEAD']);
    return currentBranch.trim();
  } catch (error) {
    // If detection fails, fall back to current branch
    try {
      const currentBranch = await git.revparse(['--abbrev-ref', 'HEAD']);
      return currentBranch.trim();
    } catch {
      return 'master'; // Ultimate fallback
    }
  }
}

async function pullRepository(
  targetDirectory: string,
  remote: string,
  branch: string
): Promise<PullResultWithPath> {
  const git: SimpleGit = simpleGit(targetDirectory);

  try {
    const isRepo = await git.checkIsRepo();
    if (!isRepo) {
      throw new Error('Not a git repository');
    }

    await git.fetch();

    // Auto-detect branch if set to 'auto'
    const targetBranch = branch === 'auto' ? await detectBranch(git, remote) : branch;

    const result = await git.pull(remote, targetBranch);

    return {
      path: targetDirectory,
      result,
    };
  } catch (error) {
    return {
      path: targetDirectory,
      result: {} as PullResult,
      error: error as Error,
    };
  }
}

async function pullAllRepositories(options: PullOptions): Promise<void> {
  const { directory, remote, branch } = options;

  const directories = await getDirectories(directory);
  const targetDirectories = [...directories, directory];

  console.log(`\nPulling from ${remote}/${branch}...\n`);

  const results = await Promise.all(
    targetDirectories.map((dir) => pullRepository(dir, remote, branch))
  );

  results.forEach(({ path, result, error }) => {
    const absolutePath = join(process.cwd(), path);
    console.log(`\nDirectory: ${absolutePath}`);

    if (error) {
      if (error.message !== 'Not a git repository') {
        console.error(`Error: ${error.message}`);
      }
      return;
    }

    if (result.files && result.files.length === 0) {
      console.log('Already up to date');
    } else {
      console.log(`Updated: ${result.summary?.changes || 0} changes`);
      if (result.files && result.files.length > 0) {
        console.log(`Files changed: ${result.files.length}`);
      }
    }
  });

  console.log('\nDone!');
}

function main(): void {
  const program = new Command();

  program
    .name('git-puller')
    .description('Git pull all repository of directory tree from specified directory')
    .version(packageJson.version)
    .option('-d, --directory <path>', 'Target directory')
    .option('-r, --remote <name>', 'Git remote', 'origin')
    .option('-b, --branch <name>', 'Git branch (auto-detects: main > master > current)', 'auto')
    .addHelpText(
      'after',
      `
Examples:
  $ git-puller -d ./                       # Current directory (auto-detects branch)
  $ git-puller -d ../../_my_project        # Other directory (auto-detects branch)
  $ git-puller -d ./ -r origin -b main     # Specify remote and branch

  $ gplr -d ./                             # Current directory (auto-detects branch)
  $ gplr -d ../../_my_project              # Other directory (auto-detects branch)
  $ gplr -d ./ -r origin -b main           # Specify remote and branch
`
    )
    .action(async (options) => {
      if (!options.directory) {
        program.help();
        return;
      }

      await pullAllRepositories({
        directory: options.directory,
        remote: options.remote,
        branch: options.branch,
      });
    });

  program.parse();
}

main();
