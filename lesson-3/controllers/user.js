import User from "../models/User.js"
import Note from "../models/Note.js"
import asyncHandler from "express-async-handler"
import bcrypt from "bcrypt"
import { logger } from "../utils/index.js"

/**
 * @description Get all users
 * @route `GET` `/users`
 * @access `Private`
 */
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").lean()
  if (!users?.length) return res.status(404).json({ message: "No users found" })

  res.json({ data: users, count: users.length })
})

/**
 * @description Get user by id
 * @route `GET` `/users/:id`
 * @access `Private`
 */
export const getUserById = asyncHandler(async (req, res) => {
  const { id: UserId } = req.params
  const user = await User.findById(UserId).lean()
  if (!user) return res.status(404).json({ message: "No users found" })

  res.json({ message: `User with ID: ${UserId}`, data: user })
})

/**
 * @description Create new users
 * @route `POST` `/users`
 * @access `Private`
 */
export const createUsers = asyncHandler(async (req, res) => {
  const { username, email, password, roles } = req.body

  // confirm data
  if (!username || !password || !Array.isArray(roles) || !roles.length)
    return res.status(400).json({ message: "Missing required fields" })

  // check for user exists
  const userExists = await User.findOne({ email })
  if (userExists)
    return res.status(400).json({ message: "User already exists" })

  // hash password
  const salt = await bcrypt.hash(password, 10) // salt rounds
  const hashedPassword = await bcrypt.hash(password, salt)

  const user = await User.create({
    username,
    password: hashedPassword,
    roles,
    email,
    active: true,
  })

  if (user)
    return res.status(201).json({ message: `New user ${username} created` })

  res.status(400).json({ message: "Invalid received data!" })
})

/**
 * @description Update users
 * @route `PATCH` `/users`
 * @access `Private`
 */
export const updateUsers = asyncHandler(async (req, res) => {
  const { id, username, email, password, roles, active } = req.body

  // confirm data
  if (
    !id ||
    !username ||
    !Array.isArray(roles) ||
    !roles.length ||
    typeof active !== "boolean"
  )
    return res.status(400).json({ message: "Missing required fields" })

  const user = await User.findById(id).exec()

  if (!user) return res.status(404).json({ message: "User not found" })

  // check for user exists
  const userExists = await User.findOne({ email }).lean().exec()

  // allow updates to the original user
  if (userExists && userExists?._id?.toString() !== id)
    return res.status(409).json({ message: "User already exists" })

  user.username = username
  user.roles = roles
  user.active = active

  if (password) user.password = password

  const updatedUser = await user.save()

  res.json({ message: `${updatedUser.username} updated` })
})

/**
 * @description Delete users
 * @route `DELETE` `/users`
 * @access `Private`
 */
export const deleteUsers = asyncHandler(async (req, res) => {
  const { id } = req.body

  if (!id) return res.status(404).json({ message: "User ID is required" })

  const notes = await Note.findOne({ user: id }).lean().exec()

  if (notes?.length)
    return res
      .status(409)
      .json({ message: "Cannot delete user with associated notes" })

  const user = await User.findById({ user: id })

  if (!user) return res.status(404).json({ message: "User not found" })

  const result = await user.deleteOne()
  res.json(`User name: ${result.username} with ID ${result._id} was deleted`)
})
