import chalk from "chalk"

const log = console.log

export const logger = {
  warn: (text) => log(`${chalk.white.yellow('[warning]')} ${chalk.yellow(text)}`),
  info: (text) => log(`${chalk.cyan('[info]')} ${chalk.cyan(text)}`),
  success: (text) => log(`${chalk.cyanBright('[success]')} ${chalk.cyanBright(text)}`),
  error: (text) => log(`${chalk.red('[error]')} ${chalk.red(text)}`),
}
