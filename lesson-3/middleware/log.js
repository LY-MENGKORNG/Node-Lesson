import { format } from "date-fns"
import { v4 as uuid } from "uuid"
import fs from "fs"
import path from "path"
import { logger} from "../utils/index.js"
import { fileURLToPath } from "url"

const fsPromises = fs.promises
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const logEvents = async (message, logFileName) => {
  const dateTime = `${format(new Date(), "yyyMMdd\tHH:mm:ss")}`
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`

  try {
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "..", "logs"))
    }
    await fsPromises.appendFile(
      path.join(__dirname, "..", "logs", logFileName),
      logItem
    )
  } catch (err) {
    const { message } = err
    logger.error(message)
  }
}

export const log = (req, res, next) => {
  logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, `reqLog.log`)

  logger.success(`${req.method} ${req.path}`)
  next()
}
