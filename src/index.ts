#!/usr/bin/env node

import { join } from 'path';
import { simpleGit, SimpleGit, PullResult } from 'simple-git';
import { Command } from 'commander';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import ora from 'ora';
import { getDirectories } from './utils.js';
import {
  printHeader,
  printRepositoryResult,
  printSummary,
  printFooter,
} from './ui.js';

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

async function detectBranch(git: SimpleGit, remote: string): Promise<string> {
  try {
    // Get all remote branches
    const branches = await git.branch(['-r']);
    const remoteBranches = branches.all.map((b) => b.replace(`${remote}/`, ''));

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
  } catch {
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
    const targetBranch =
      branch === 'auto' ? await detectBranch(git, remote) : branch;

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

  // Print header
  printHeader(remote, branch);

  // Discover repositories
  const spinner = ora('Scanning for repositories...').start();
  const directories = await getDirectories(directory);
  const targetDirectories = [...directories, directory];
  spinner.succeed(
    `Found ${targetDirectories.length} director${targetDirectories.length !== 1 ? 'ies' : 'y'} to check`
  );

  console.log('');

  // Pull all repositories with progress
  const pullSpinner = ora('Pulling repositories...').start();
  const results = await Promise.all(
    targetDirectories.map((dir) => pullRepository(dir, remote, branch))
  );
  pullSpinner.stop();

  // Track statistics
  let successful = 0;
  let failed = 0;
  let skipped = 0;

  // Display results
  results.forEach(({ path, result, error }) => {
    const absolutePath = join(process.cwd(), path);

    if (error) {
      if (error.message === 'Not a git repository') {
        skipped++;
        printRepositoryResult(absolutePath, true, error.message, 0, 0);
      } else {
        failed++;
        printRepositoryResult(absolutePath, false, error.message);
      }
      return;
    }

    const changes = result.summary?.changes || 0;
    const filesChanged = result.files?.length || 0;

    if (changes === 0) {
      skipped++;
    } else {
      successful++;
    }

    printRepositoryResult(absolutePath, true, 'Success', changes, filesChanged);
  });

  // Print summary
  printSummary(targetDirectories.length, successful, failed, skipped);
  printFooter();
}

function main(): void {
  const program = new Command();

  program
    .name('git-puller')
    .description(
      '🚀 Pull all git repositories in a directory tree with smart branch detection'
    )
    .version(packageJson.version)
    .option('-d, --directory <path>', 'Target directory (required)')
    .option('-r, --remote <name>', 'Git remote', 'origin')
    .option(
      '-b, --branch <name>',
      'Git branch (auto | main | master | custom)',
      'auto'
    )
    .addHelpText(
      'after',
      `
Smart Branch Detection:
  When using default "auto" mode, git-puller will:
    1. Check for "main" branch first
    2. Fall back to "master" if main doesn't exist
    3. Use current branch if neither exists

Examples:
  Basic Usage:
    $ git-puller -d ./                     Pull repos in current directory
    $ git-puller -d ~/projects             Pull all repos in projects folder
    $ gplr -d ./                           Using short alias

  Advanced:
    $ git-puller -d ./ -b main             Force specific branch
    $ git-puller -d ./ -r upstream         Use different remote
    $ gplr -d ~/work -r origin -b develop  Combine options

Features:
  ✓ Auto-detects main/master branches
  ✓ Colored output with progress indicators
  ✓ Summary statistics table
  ✓ Handles nested directories
  ✓ Parallel repository pulling

Need help? https://github.com/novemberde/git-puller
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
