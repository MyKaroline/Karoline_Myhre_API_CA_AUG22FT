class TodoService {
	constructor(db) {
		this.client = db.sequelize
		this.Todo = db.Todo
	}

	async get(id, userId) {
		return this.Todo.findOne({ where: { id, UserId: userId } })
	}

	async getAll(userId) {
		return this.Todo.findAll({ where: { UserId: userId } })
	}

	async update(id, userId, name, CategoryId) {
		return this.Todo.update({ name, CategoryId }, { where: { id, UserId: userId } })
	}

	async create(name, CategoryId, UserId) {
		return this.Todo.create({
			name,
			CategoryId,
			UserId,
		})
	}

	async delete(id, userId) {
		return this.Todo.destroy({ where: { id, UserId: userId } })
	}
}

module.exports = TodoService
