import dotenv from "dotenv"
import express from "express"
import path from "path"
import cookieParser from "cookie-parser"
import cors from "cors"
import mongoose from "mongoose"
import { fileURLToPath } from "url"

import router from "./routes/root.js"
import userRouter from "./routes/user.js"
import errorHandler from "./middleware/errorHandler.js"
import { log, logEvents } from "./middleware/log.js"
import { corsOptions } from "./config/corsOptions.js"
import { connectDB } from "./config/dbConn.js"
import { logger } from "./utils/index.js"

dotenv.config()
connectDB()

const app = express()
const PORT = process.env.PORT || 3000
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(log)
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())
app.use("/", express.static(path.join(__dirname, "/public")))
app.use("/", router)
app.use("/users", userRouter)

app.all("*", (req, res) => {
  res.status(404)
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"))
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" })
  } else {
    res.type("txt").send("404 Not Found")
  }
})

app.use(errorHandler)

mongoose.connection.once("open", () => {
  logger.warn(`You are running ${process.env.NODE_ENV} server 🖥️`)
  logger.success("Successfully connected to MongoDB 🎉")
  app.listen(PORT, () => {
    logger.warn(`Server is running on http://localhost:${PORT} 💥🚀`)
  })
})

mongoose.connection.on("error", (err) => {
  logger.error(err)
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log"
  )
})
