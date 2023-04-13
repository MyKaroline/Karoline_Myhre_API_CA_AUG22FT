class CategoryService {
	constructor(db) {
		this.client = db.sequelize
		this.Category = db.Category
	}

	async get(id) {
		return this.Category.findOne({ where: { id } })
	}

	async getAll() {
		return this.Category.findAll()
	}

	async update(id, name) {
		return this.Category.update({ name }, { where: { id } })
	}

	async create(name) {
		return this.Category.create({ name })
	}

	async delete(id) {
		return this.Category.destroy({ where: { id } })
	}
}

module.exports = CategoryService
