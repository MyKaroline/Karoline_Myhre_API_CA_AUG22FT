const express = require('express')
const router = express.Router()
const db = require('../models')
const crypto = require('crypto')
const util = require('util')
const UserService = require('../services/UserService')
const userService = new UserService(db)
const jwt = require('jsonwebtoken')

const pbkdf2 = util.promisify(crypto.pbkdf2)

router.post('/login', async (req, res, next) => {
	const { email, password } = req.body
	try {
		const user = await userService.getOne(email)
		if (user === null) {
			return res.jsend.fail({ result: 'Incorrect email or password' })
		}
		const hashedPassword = await pbkdf2(password, user.salt, 310000, 32, 'sha256')
		if (!crypto.timingSafeEqual(user.encryptedPassword, hashedPassword)) {
			return res.jsend.fail({ result: 'Incorrect email or password' })
		}
		try {
			const token = jwt.sign({ id: user.id, email: user.email }, process.env.TOKEN_SECRET, { expiresIn: '1h' })
			res.jsend.success({ result: 'You are logged in', id: user.id, email: user.email, token: token })
		} catch (err) {
			console.error(err)
			res.jsend.error('Something went wrong with creating JWT token')
		}
	} catch (e) {
		res.jsend.error(e)
	}
})

module.exports = router
