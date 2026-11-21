import UserRepository from "../repositories/user.js";
import { AppError } from "../errors/AppError.js";
import { sequelize } from "../db.js";
import { paginatedResponse, parsePagination } from "../utils/pagination.js";
import checkOwnerOrAdmin from "../utils/access.js";
import { userExists, checkEmailNotTaken } from "../utils/exists.js";
import {
	checkAllowedFields,
	checkEmail,
	checkName,
	checkPhone,
} from "../utils/validation.js";
import ReservationRepository from "../repositories/reservation.js";
import ReviewRepository from "../repositories/review.js";

export default class UserService {
	static async getAll(limit, page) {
		const parsedLimit = Number(limit);
		const parsedPage = Number(page);

		const { offset } = parsePagination(parsedLimit, parsedPage);

		const { count, rows } = await UserRepository.findAll({
			limit: parsedLimit,
			offset,
		});

		return paginatedResponse(count, rows, parsedLimit, parsedPage);
	}

	static async getById(userId, role, id) {
		checkOwnerOrAdmin(id, userId, role);

		return await userExists(id);
	}

	static async update(userId, role, id, data) {
		const allowedFields = ["name", "email", "phone"];
		checkAllowedFields(allowedFields, data);

		checkOwnerOrAdmin(id, userId, role);

		const { name, email, phone } = data;

		const user = await userExists(id);

		const changes = {};

		if (name !== undefined) {
			changes.name = checkName(name);
		}

		if (email !== undefined) {
			changes.email = checkEmail(email);

			if (changes.email !== user.email) {
				await checkEmailNotTaken(changes.email);
			}
		}

		if (phone !== undefined) {
			changes.phone = checkPhone(phone);
		}

		await UserRepository.update(user, changes);

		return {
			id: user.id,
			name: user.name,
			email: user.email,
			phone: user.phone,
		};
	}

	static async delete(userId, role, id) {
		checkOwnerOrAdmin(id, userId, role);

		const transaction = await sequelize.transaction();

		try {
			const user = await userExists(id, transaction);

			await ReservationRepository.cancelActiveByUserId(id, transaction);
			await ReviewRepository.deleteByUserId(id, transaction);
			await UserRepository.softDelete(user, transaction);

			await transaction.commit();
			return user;
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}
}
