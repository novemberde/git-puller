# git-puller 🚀

[![NPM version](https://badge.fury.io/js/git-puller.svg)](https://www.npmjs.com/package/git-puller)
[![CI](https://github.com/novemberde/git-puller/actions/workflows/ci.yml/badge.svg)](https://github.com/novemberde/git-puller/actions/workflows/ci.yml)

A modern, beautiful CLI tool to pull all git repositories in a directory tree with smart branch detection and colorful output.

## ✨ Features

### Smart Branch Detection
- 🎯 **Auto-detects** the right branch: tries `main` → `master` → current branch
- No more guessing which branch to use across different repositories
- Override with custom branch when needed

### Modern CLI Interface
- 🎨 **Colorful output** with syntax highlighting
- ⏳ **Progress indicators** for scanning and pulling operations
- 📊 **Summary table** showing success/failure statistics
- ✅ **Clear status symbols** for easy scanning

### Developer Experience
- ⚡ **Parallel pulling** for maximum performance
- 📁 **Recursive directory scanning** handles nested repos
- 🛡️ **TypeScript** with full type safety
- ✨ **Modern async/await** architecture
- 🧪 **Comprehensive test coverage** with Vitest
- 🎯 **ESLint + Prettier** for code quality
- 🪝 **Pre-commit hooks** with Husky
- 🚀 **CI/CD** with GitHub Actions
- 💻 Supports **Node.js 18+**

## Installation

Install the command line interface globally:

```sh
npm install -g git-puller
```

Or use with npx:

```sh
npx git-puller -d ./
```

## 🚀 Quick Start

```sh
# Pull all repos in current directory (auto-detects branch)
git-puller -d ./

# Or use the short alias
gplr -d ./
```

## 📖 Usage

```sh
Usage: git-puller [options]

🚀 Pull all git repositories in a directory tree with smart branch detection

Options:
  -V, --version           output the version number
  -d, --directory <path>  Target directory (required)
  -r, --remote <name>     Git remote (default: "origin")
  -b, --branch <name>     Git branch (auto | main | master | custom) (default: "auto")
  -h, --help              display help for command
```

### Smart Branch Detection

When using the default `"auto"` mode, git-puller will:
1. ✅ Check for `main` branch first
2. ✅ Fall back to `master` if main doesn't exist
3. ✅ Use current branch if neither exists

### Examples

#### Basic Usage
```sh
# Pull all repos in current directory
git-puller -d ./

# Pull all repos in a projects folder
git-puller -d ~/projects

# Using the short alias
gplr -d ./
```

#### Advanced Usage
```sh
# Force a specific branch across all repos
git-puller -d ./ -b main

# Use a different remote
git-puller -d ./ -r upstream

# Combine options
gplr -d ~/work -r origin -b develop
```

### Output Example

```
┌─────────────────────────────────────────────────┐
│         Git Puller - Pulling Repositories       │
└─────────────────────────────────────────────────┘

 Remote: origin  •  Branch: auto-detect

✓ Found 5 directories to check

✓ /path/to/repo1
  Updated: 3 changes
  Files changed: 2 files

✓ /path/to/repo2
  Already up to date

┌────────────────────┬──────────┬───────────────┐
│ Status             │ Count    │ Percentage    │
├────────────────────┼──────────┼───────────────┤
│ ✓ Successful       │ 1        │ 20.0%         │
├────────────────────┼──────────┼───────────────┤
│ ○ Up to date       │ 4        │ 80.0%         │
├────────────────────┼──────────┼───────────────┤
│ ✗ Failed           │ 0        │ 0.0%          │
└────────────────────┴──────────┴───────────────┘

  All repositories processed successfully!
```

## 💡 Why git-puller?

### Problem
Managing multiple git repositories across different directories is tedious:
- Different repos use different default branches (`main` vs `master`)
- Manually pulling each repository is time-consuming
- No visibility into which repos were updated
- Error-prone when managing dozens of projects

### Solution
git-puller solves this by:
- ✅ **Auto-detecting** the correct branch for each repository
- ✅ **Pulling all repos** in parallel for speed
- ✅ **Beautiful output** showing exactly what happened
- ✅ **Summary statistics** for quick overview
- ✅ **Error handling** that doesn't stop on single failures

Perfect for:
- 👨‍💻 Developers managing multiple projects
- 📁 Keeping workspace repositories in sync
- 🏢 Teams with many microservices
- 🎓 Students with multiple course repositories

## 🛠️ Development

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

### Project Structure
```
git-puller/
├── src/
│   ├── index.ts        # Main CLI entry point
│   ├── ui.ts           # Modern UI components
│   ├── utils.ts        # Directory utilities
│   └── utils.test.ts   # Unit tests
├── dist/               # Compiled JavaScript
└── package.json
```

## 📋 Requirements

- **Node.js** >= 18.0.0
- **Git** installed and accessible from command line

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

Provided under the terms of the [MIT license](./LICENSE).

## 🙏 Acknowledgments

Built with:
- [simple-git](https://github.com/steveukx/git-js) - Git command wrapper
- [commander](https://github.com/tj/commander.js) - Command-line interface
- [chalk](https://github.com/chalk/chalk) - Terminal styling
- [ora](https://github.com/sindresorhus/ora) - Elegant terminal spinners
- [cli-table3](https://github.com/cli-table/cli-table3) - Beautiful tables

---

**Made with ❤️ for developers who manage multiple repositories**

