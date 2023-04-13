const express = require('express')
const request = require('supertest')
const path = require('path')
const cookieParser = require('cookie-parser')
const jsend = require('jsend')
require('dotenv').config()

const indexRouter = require('../routes/index')
const usersRouter = require('../routes/users')
const todosRouter = require('../routes/todos')
const categoriesRouter = require('../routes/categories')
const authRouter = require('../routes/auth')
const db = require('../models')
db.sequelize.sync({ force: false })

const app = express()

app.use(jsend.middleware)

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/categories', categoriesRouter)
app.use('/todos', todosRouter)
app.use(authRouter)

describe('Todos testing', () => {
	let token

	test('POST /login - success', async () => {
		const credentials = {
			email: process.env.TEST_USER,
			password: process.env.TEST_USER_PW,
		}
		const { body } = await request(app).post('/login').send(credentials)
		expect(body).toHaveProperty('data')
		expect(body.data).toHaveProperty('token')
		token = body.data.token
	})

	let todoId
	const category = { name: 'test task' }
	const task = { name: 'test task', CategoryId: null }

	test('POST /categories - success', async () => {
		const { body } = await request(app)
			.post('/categories')
			.set('Authorization', 'Bearer ' + token)
			.send(category)

		expect(body).toHaveProperty('data')
		expect(body.data.name).toBe(task.name)
		console.log(body.data.id, body)
		task.CategoryId = body.data.id
	})

	test('POST /todos - success', async () => {
		console.log(task)
		const { body } = await request(app)
			.post('/todos')
			.set('Authorization', 'Bearer ' + token)
			.send(task)

		expect(body).toHaveProperty('data')
		expect(body.data.name).toBe(task.name)
		expect(body.data.CategoryId).toBe(task.CategoryId)
		todoId = body.data.id
	})

	test('GET /todos - success', async () => {
		const { body } = await request(app)
			.get('/todos')
			.set('Authorization', 'Bearer ' + token)

		expect(body).toHaveProperty('data')
		const addedTask = body.data.find((t) => t.id === todoId)
		expect(addedTask).toBeTruthy()
		expect(addedTask.id).toBe(todoId)
		expect(addedTask.name).toBe(task.name)
		expect(addedTask.CategoryId).toBe(task.CategoryId)
	})

	test('DELETE /todos/:id - success', async () => {
		const { body } = await request(app)
			.delete('/todos/' + todoId)
			.set('Authorization', 'Bearer ' + token)
		expect(body).toHaveProperty('status')
		expect(body.status).toBe('success')
	})

	test('GET /todos without token - fail', async () => {
		const { body } = await request(app).get('/todos')

		expect(body).toHaveProperty('status')
		expect(body.status).toBe('fail')
	})

	test('GET /todos with bad token - error', async () => {
		const { body } = await request(app).get('/todos').set('Authorization', 'Bearer gklgnkerwnf.daffe.asadfsdf')

		expect(body).toHaveProperty('status')
		expect(body.status).toBe('error')
	})
})
