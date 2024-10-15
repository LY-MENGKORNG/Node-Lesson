import express from 'express'
const router = express.Router()
import path from 'path'
router.get("^/$|index(.html)?", (req: any, res: any) => {
  res.sendFile(path.join(__dirname, "..", "views", "index.html"))
})

export default router