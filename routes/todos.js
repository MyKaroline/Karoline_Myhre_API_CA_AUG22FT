const express = require('express')
const router = express.Router()
const db = require('../models')
const TodoService = require('../services/TodoService')
const todoService = new TodoService(db)
const jwt = require('jsonwebtoken')

/* GET users listing. */
router.get('/', async (req, res, next) => {
	try {
		const token = req.headers.authorization?.split(' ')[1]
		if (token) {
			const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET)
			const todos = await todoService.getAll(decodedToken.id)
			res.jsend.success(todos)
		} else {
			res.jsend.fail({ result: 'No token provided' })
		}
	} catch (e) {
		res.jsend.error(e)
	}
})

router.post('/', async (req, res, next) => {
	try {
		const token = req.headers.authorization?.split(' ')[1]
		if (token) {
			const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET)
			const { name, CategoryId } = req.body
			const result = await todoService.create(name, CategoryId, decodedToken.id)
			res.jsend.success(result)
		} else {
			res.jsend.fail({ result: 'No token provided' })
		}
	} catch (e) {
		res.jsend.error(e)
	}
})

router.patch('/:id', async (req, res, next) => {
	try {
		const id = Number.parseInt(req.params.id)
		const token = req.headers.authorization?.split(' ')[1]
		if (token) {
			const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET)
			const todo = await todoService.get(id, decodedToken.id)
			if (!todo) return res.jsend.fail({ result: 'Todo not found' })
			const { name, CategoryId } = req.body
			const result = await todoService.update(id, decodedToken.id, name, CategoryId)
			res.jsend.success(result)
		} else {
			res.jsend.fail({ result: 'No token provided' })
		}
	} catch (e) {
		res.jsend.error(e)
	}
})

router.delete('/:id', async (req, res, next) => {
	try {
		const id = Number.parseInt(req.params.id)
		const token = req.headers.authorization?.split(' ')[1]
		if (token) {
			const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET)
			const todo = await todoService.get(id, decodedToken.id)
			if (!todo) return res.jsend.fail({ result: 'Todo not found' })
			const result = await todoService.delete(id, decodedToken.id)
			res.jsend.success(result)
		} else {
			res.jsend.fail({ result: 'No token provided' })
		}
	} catch (e) {
		res.jsend.error(e)
	}
})

module.exports = router
