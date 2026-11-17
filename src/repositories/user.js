import { User } from "../models/index.js";

export default class UserRepository {
	static async findAll({ limit, offset }) {
		return await User.findAndCountAll({
			where: {
				deletedAt: null,
			},
			limit,
			offset,
			order: [["createdAt", "DESC"]],
			attributes: {
				exclude: ["passwordHash", "refreshToken"],
			},
		});
	}

	static async findById(id) {
		return await User.findOne({
			where: {
				id: id,
				deletedAt: null,
			},
			attributes: {
				exclude: ["passwordHash", "refreshToken"],
			},
		});
	}

	static async findByEmail(email) {
		return await User.findOne({
			where: {
				email: email,
				deletedAt: null,
			},
		});
	}

	static async update(user, data) {
		return await user.update(data);
	}

	static async delete(id, transaction) {
		const user = await User.findByPk(id, { transaction });

		if (!user) {
			return null;
		}

		await user.destroy({ transaction });
		return user;
	}
}
