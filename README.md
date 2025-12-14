# git-puller

[![NPM version](https://badge.fury.io/js/git-puller.svg)](https://www.npmjs.com/package/git-puller)
[![CI](https://github.com/novemberde/git-puller/actions/workflows/ci.yml/badge.svg)](https://github.com/novemberde/git-puller/actions/workflows/ci.yml)

A modern TypeScript CLI tool to pull all git repositories in a directory tree from a specified directory.

## Features

- Written in modern TypeScript with full type safety
- Async/await based for better performance
- Comprehensive test coverage with Vitest
- Automated linting and formatting with ESLint and Prettier
- Pre-commit hooks with Husky
- CI/CD with GitHub Actions
- Supports Node.js 18+

## Installation

Install the command line interface globally:

```sh
npm install -g git-puller
```

Or use with npx:

```sh
npx git-puller -d ./
```

## Usage

```sh
Usage: git-puller [options]

Options:
  -V, --version           output the version number
  -d, --directory <path>  Target directory
  -r, --remote <name>     Git remote (default: "origin")
  -b, --branch <name>     Git branch (auto-detects: main > master > current)
  -h, --help              display help for command

Examples:
  $ git-puller -d ./                       # Pull all repos (auto-detects branch)
  $ git-puller -d ../../_my_project        # Pull all repos (auto-detects branch)
  $ git-puller -d ./ -r origin -b main     # Specify remote and branch

  $ gplr -d ./                             # Using short alias (auto-detects branch)
  $ gplr -d ../../_my_project              # Pull repos (auto-detects branch)
  $ gplr -d ./ -r origin -b main           # Specify remote and branch
```

## Development

```sh
# Install dependencies
npm install

# Build the project
npm run build

# Run in development mode
npm run dev

# Run tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Format code
npm run format

# Check formatting
npm run format:check
```

## Requirements

- Node.js >= 18.0.0

## License

Provided under the terms of the [ISC license](./LICENSE)

