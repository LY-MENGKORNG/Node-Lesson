import router from "./routes/root"
import express from "express"
import path from "path"
import errorHandler from "./middleware/errorHandler"
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { logger } from "./middleware/logger"
import { corsOptions } from './config/corsOptions'

const app = express()
const PORT = process.env.PORT || 3000

app.use(logger)
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())
app.use("/", express.static(path.join(__dirname, "/public")))
app.use("/", router)

app.all("*", (req: any, res: any) => {
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
