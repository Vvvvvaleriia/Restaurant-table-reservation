import UserRepository from "../repositories/user.js";
import TableTypeRepository from "../repositories/tableType.js";
import { AppError } from "../errors/AppError.js";
import TableRepository from "../repositories/table.js";
import ReservationRepository from "../repositories/reservation.js";
import AuthRepository from "../repositories/auth.js";

export async function userExists(id, transaction) {
	const user = await UserRepository.findById(id, transaction);

	if (!user) {
		throw AppError.notFound("User not found");
	}

	return user;
}

export async function checkEmailNotTaken(email) {
	const existingUser = await UserRepository.findByEmail(email);

	if (existingUser) {
		throw AppError.conflict("Email already exists");
	}
}

export async function profileExists(id) {
	const user = await AuthRepository.findProfile(id);

	if (!user) {
		throw AppError.notFound("User not found");
	}

	return user;
}

export async function tableTypeExists(id) {
	const tableType = await TableTypeRepository.findById(id);

	if (!tableType) {
		throw AppError.notFound("Table type not found");
	}

	return tableType;
}

export async function tableTypeNameExists(name) {
	const existingType = await TableTypeRepository.findByName(name);

	if (existingType) {
		throw AppError.conflict("Table type with this name already exists");
	}
}

export async function tableNumberExists(tableNumber) {
	const existingTableNumber = await TableRepository.findByNumber(tableNumber);

	if (existingTableNumber) {
		throw AppError.conflict("This table number already exists");
	}
}

export async function tableExists(id, transaction) {
	const table = await TableRepository.findById(id, transaction);

	if (!table) {
		throw AppError.notFound("Table not found");
	}

	return table;
}

export async function reservationExists(id, transaction) {
	const reservation = await ReservationRepository.findById(id, transaction);

	if (!reservation) {
		throw AppError.notFound("Reservation not found");
	}

	return reservation;
}

export async function reviewAllreadyExists(id) {
	const existingReview = await ReviewRepository.findByReservationId(id);

	if (existingReview) {
		throw AppError.conflict("Review for this reservation already exists");
	}
}

export async function reviewExists(id) {
	const review = await ReviewRepository.findById(id);

	if (!review) {
		throw AppError.notFound("Review not found");
	}

	return review;
}

export async function reservedTableExists(
	tableId,
	reservationDatetime,
	excludeReservationId,
) {
	const conflict = await ReservationRepository.findTimeConflict(
		tableId,
		reservationDatetime,
		excludeReservationId,
	);

	if (conflict) {
		throw AppError.conflict(
			"This table has active reservation for this time",
		);
	}
}
