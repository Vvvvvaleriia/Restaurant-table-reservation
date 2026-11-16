import { User } from "./user.js";
import { Reservation } from "./reservation.js";
import { Review } from "./review.js";
import { TableType } from "./tableType.js";
import { Table } from "./table.js";

User.hasMany(Reservation, {
	foreignKey: "userId",
	as: "reservations",
	onDelete: "RESTRICT",
});
Reservation.belongsTo(User, {
	foreignKey: "userId",
	as: "user",
	onDelete: "RESTRICT",
});

User.hasMany(Review, {
	foreignKey: "userId",
	as: "reviews",
	onDelete: "CASCADE",
});
Review.belongsTo(User, {
	foreignKey: "userId",
	as: "user",
	onDelete: "CASCADE",
});

TableType.hasMany(Table, {
	foreignKey: "tableTypeId",
	as: "tables",
	onDelete: "RESTRICT",
});
Table.belongsTo(TableType, {
	foreignKey: "tableTypeId",
	as: "tableType",
	onDelete: "RESTRICT",
});

Table.hasMany(Reservation, {
	foreignKey: "tableId",
	as: "reservations",
	onDelete: "RESTRICT",
});
Reservation.belongsTo(Table, {
	foreignKey: "tableId",
	as: "table",
	onDelete: "RESTRICT",
});

Reservation.hasOne(Review, {
	foreignKey: "reservationId",
	as: "review",
	onDelete: "CASCADE",
});
Review.belongsTo(Reservation, {
	foreignKey: "reservationId",
	as: "reservation",
	onDelete: "CASCADE",
});

export { User, Table, Reservation, TableType, Review };
