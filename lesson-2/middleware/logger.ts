import { format } from 'date-fns'
import { v4 as uuid } from 'uuid'
import fs from 'fs'
import path from 'path'

const fsPromises = fs.promises

export const logEvents = async (message: string, logFileName: string) => {
  const dateTime = `${format(new Date(), 'yyyMMdd\tHH:mm:ss')}`
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`

  try {
    if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
      await fsPromises.mkdir(path.join(__dirname, '..', 'logs'))
    }
    await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logFileName), logItem)
  } catch (err: any) {
    const { message } = err
    console.error(message)
  }
}

export const logger = (req: any, res: any, next: Function) => {
  logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, `reqLog.log`)

  console.log(`${req.method} ${req.path}`)
  next()
}