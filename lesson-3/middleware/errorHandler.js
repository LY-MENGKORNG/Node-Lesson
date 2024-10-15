import { logger } from "../utils/index.js"
import { logEvents } from "./log.js"

const errorHandler = (err, req, res, next) => {
  logEvents(
    `${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
    "errLog.log"
  )
  logger.error(err.stack)

  const status = res.statusCode ? res.statusCode : 500

  res.status(status)

  res.json({ message: err.message })
}

export default errorHandler
