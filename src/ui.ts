import chalk from 'chalk';
import Table from 'cli-table3';

export const colors = {
  success: chalk.green,
  error: chalk.red,
  warning: chalk.yellow,
  info: chalk.cyan,
  dim: chalk.dim,
  bold: chalk.bold,
  primary: chalk.blue,
};

export const symbols = {
  success: chalk.green('✓'),
  error: chalk.red('✗'),
  warning: chalk.yellow('⚠'),
  info: chalk.cyan('ℹ'),
  arrow: chalk.cyan('→'),
  dot: chalk.dim('•'),
  branch: chalk.yellow(''),
  repo: chalk.blue(''),
};

export function printHeader(remote: string, branch: string): void {
  console.log('');
  console.log(
    chalk.bold.cyan('┌─────────────────────────────────────────────────┐')
  );
  console.log(
    chalk.bold.cyan('│') +
      chalk.bold('         Git Puller - Pulling Repositories       ') +
      chalk.bold.cyan('│')
  );
  console.log(
    chalk.bold.cyan('└─────────────────────────────────────────────────┘')
  );
  console.log('');
  console.log(
    `${symbols.branch} Remote: ${colors.bold(remote)}  ${symbols.dot}  Branch: ${colors.bold(branch === 'auto' ? 'auto-detect' : branch)}`
  );
  console.log('');
}

export function printRepositoryResult(
  path: string,
  success: boolean,
  message: string,
  changes?: number,
  filesChanged?: number
): void {
  const symbol = success ? symbols.success : symbols.error;
  const pathColor = success ? colors.dim : colors.error;

  console.log(symbol + ' ' + pathColor(path));

  if (success) {
    if (changes === 0) {
      console.log('  ' + colors.dim('Already up to date'));
    } else {
      console.log(
        '  ' +
          colors.success(`Updated: ${changes} change${changes !== 1 ? 's' : ''}`)
      );
      if (filesChanged && filesChanged > 0) {
        console.log(
          '  ' +
            colors.info(
              `Files changed: ${filesChanged} file${filesChanged !== 1 ? 's' : ''}`
            )
        );
      }
    }
  } else {
    if (message !== 'Not a git repository') {
      console.log('  ' + colors.error(message));
    } else {
      console.log('  ' + colors.dim('Skipped (not a git repository)'));
    }
  }
  console.log('');
}

export function printSummary(
  total: number,
  successful: number,
  failed: number,
  skipped: number
): void {
  const table = new Table({
    head: [
      chalk.bold.cyan('Status'),
      chalk.bold.cyan('Count'),
      chalk.bold.cyan('Percentage'),
    ],
    style: {
      head: [],
      border: ['cyan'],
    },
    colWidths: [20, 10, 15],
  });

  table.push(
    [
      chalk.green('✓ Successful'),
      chalk.bold(successful.toString()),
      chalk.dim(((successful / total) * 100).toFixed(1) + '%'),
    ],
    [
      chalk.yellow('○ Up to date'),
      chalk.bold(skipped.toString()),
      chalk.dim(((skipped / total) * 100).toFixed(1) + '%'),
    ],
    [
      chalk.red('✗ Failed'),
      chalk.bold(failed.toString()),
      chalk.dim(((failed / total) * 100).toFixed(1) + '%'),
    ]
  );

  console.log(table.toString());
  console.log('');

  if (failed === 0) {
    console.log(
      chalk.green.bold('  All repositories processed successfully! ') +
        chalk.green('')
    );
  } else {
    console.log(
      chalk.yellow.bold(
        `  Completed with ${failed} error${failed !== 1 ? 's' : ''} `
      ) + chalk.yellow('⚠')
    );
  }
  console.log('');
}

export function printFooter(): void {
  console.log(chalk.dim('─'.repeat(50)));
  console.log('');
}
