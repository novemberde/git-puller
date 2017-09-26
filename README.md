# git-puller
Git pull all repository of directory tree from specified directory or current path.

# Install

Install command line interface globally.

```sh
$ npm install -g git-puller
```

# Usage

```sh
$ git-puller <DirectoryName>

# Example
$ git-puller .
# Example
$ git-puller .  # current directory
$ git-puller ../../_my_project # other directory
Execute:  ls -d ../../_my_project/*/
Directory list:
  ../../_my_project/Repository1
  ../../_my_project/Repository2
  ../../_my_project/Repository3
  ../../_my_project/Repository4

Execute:  cd ../../_my_project && git fetch && git pull origin
fatal: Not a git repository (or any of the parent directories): .git

Execute:  cd ../../_my_project/Repository1 && git fetch && git pull origin
Already up-to-date.
...
```

License

[MIT licensed](./LICENSE).