import { User } from "../models/index.js";

export default class AuthRepository {
	static async findByEmail(email) {
		return await User.findOne({
			where: { email, deletedAt: null },
		});
	}

	static async findById(id) {
		return await User.findOne({
			where: { id, deletedAt: null },
		});
	}

	static async findByRefreshToken(refreshToken) {
		return await User.findOne({
			where: {
				refreshToken,
			},
		});
	}

	static async findProfile(id) {
		return await User.findOne({
			where: { id, deletedAt: null },
			attributes: ["id", "email", "name", "phone", "role", "createdAt"],
		});
	}

	static async create(data) {
		return await User.create(data);
	}

	static async updateRefreshToken(id, refreshToken) {
		return await User.update(
			{ refreshToken },
			{
				where: { id },
			},
		);
	}
}
