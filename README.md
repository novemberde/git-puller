# git-puller
[![NPM version](https://badge.fury.io/js/badge-list.svg)](https://www.npmjs.com/package/git-puller)

Git pull all repository of directory tree from specified directory.

## Installation

Install command line interface globally.

```sh
$ npm i -g git-puller
```

## Usage

```sh
Usage: git-puller [options]

Options:

  -V, --version            output the version number
  -d, --directory [value]  Target directory
  -r, --remote [value]     Git Remote (default: origin)
  -b, --branch [value]     Git branch (default: master)
  -h, --help               output usage information
usage: git-puller -d <DIRECTORY_NAME>

examples:
  git-puller -d ./                                # Current directory
  git-puller -d ../../_my_project                # Other directory
  git-puller -d ./ -r origin -b master           # Specify remote and branch
```

## License

Provided under the terms of the [MIT license](./LICENSE)

