import { User } from "../models.js";

export default class AuthRepository {
	static async findByEmail(email) {
		return await User.findOne({
			where: { email },
		});
	}

	static async findById(id) {
		return await User.findByPk(id);
	}

	static async findByRefreshToken(refreshToken) {
		return await User.FindOne({
			where: {
				refreshToken,
			},
		});
	}

	static async findProfile(id) {
		return await User.findByPk(id, {
			attributes: ["id", "email", "name", "createdAt"],
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
