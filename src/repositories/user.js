import { User } from "../models.js";

export default class UserRepository {
	static async findAll(limit, offset) {
		return await User.findAndCountAll({
			limit: limit,
			offset: offset,
			order: [["createdAt", "DESC"]],
			attributes: {
				exclude: ["passwordHash"],
			},
		});
	}

	static async findById(id) {
		return await User.findByPk(id, {
			attributes: {
				exclude: ["passwordHash"],
			},
		});
	}

	static async findByEmail(email) {
		return await User.findOne({
			where: {
				email,
			},
		});
	}

	static async update(user, data) {
		return await user.update(data);
	}

	static async delete(user) {
		return await user.destroy();
	}
}
