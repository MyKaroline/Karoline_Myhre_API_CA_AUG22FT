const express = require('express')
const router = express.Router()
const db = require('../models')
const crypto = require('crypto')
const util = require('util')
const UserService = require('../services/UserService')
const userService = new UserService(db)

const pbkdf2 = util.promisify(crypto.pbkdf2)

/* GET users listing. */
router.get('/', function (req, res, next) {
	res.jsend.success('respond with a resource')
})

router.post('/', async (req, res, next) => {
	const { name, email, password } = req.body
	try {
		const salt = crypto.randomBytes(16)
		const hashedPassword = await pbkdf2(password, salt, 310000, 32, 'sha256')

		await userService.create(name, email, hashedPassword, salt)
		res.jsend.success({ result: 'You created an account.' })
	} catch (e) {
		res.jsend.error(e)
	}
})

module.exports = router
