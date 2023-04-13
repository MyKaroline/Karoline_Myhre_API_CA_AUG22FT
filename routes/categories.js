const express = require('express')
const router = express.Router()
const db = require('../models')
const CategoryService = require('../services/CategoryService')
const categoryService = new CategoryService(db)
const jwt = require('jsonwebtoken')

/* GET users listing. */
router.get('/', async (req, res, next) => {
	try {
		const token = req.headers.authorization?.split(' ')[1]
		if (token) {
			jwt.verify(token, process.env.TOKEN_SECRET)
			const categories = await categoryService.getAll()
			res.jsend.success(categories)
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
			jwt.verify(token, process.env.TOKEN_SECRET)
			const { name } = req.body
			const result = await categoryService.create(name)
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
			jwt.verify(token, process.env.TOKEN_SECRET)
			const category = await categoryService.get(id)
			if (!category) return res.jsend.fail({ result: 'Category not found' })
			const { name } = req.body
			const result = await categoryService.update(id, name)
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
			jwt.verify(token, process.env.TOKEN_SECRET)
			const category = await categoryService.get(id)
			if (!category) return res.jsend.fail({ result: 'Category not found' })
			const result = await categoryService.delete(id)
			res.jsend.success(result)
		} else {
			res.jsend.fail({ result: 'No token provided' })
		}
	} catch (e) {
		res.jsend.error(e)
	}
})

module.exports = router
