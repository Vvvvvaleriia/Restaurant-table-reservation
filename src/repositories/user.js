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

	static async findById(id, transaction) {
		return await User.findOne({
			where: {
				id,
				deletedAt: null,
			},
			attributes: {
				exclude: ["passwordHash", "refreshToken"],
			},
			transaction,
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

	static async update(user, data, transaction) {
		return await user.update(data, { transaction });
	}

	static async updateRefreshToken(user, transaction) {
		return await user.update({ refreshToken: null }, { transaction });
	}

	static async softDelete(user, transaction) {
		return await user.destroy({ transaction });
	}
}
