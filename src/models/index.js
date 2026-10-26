import { User } from "./user.js";
import { Reservation } from "./reservation.js";
import { Review } from "./review.js";
import { TableType } from "./tableType.js";
import { Table } from "./table.js";

User.hasMany(Reservation, { foreignKey: "userId", as: "reservations" });
Reservation.belongsTo(User, { foreignKey: "userId", as: "user" });

User.hasMany(Review, { foreignKey: "userId", as: "reviews" });
Review.belongsTo(User, { foreignKey: "userId", as: "user" });

TableType.hasMany(Table, { foreignKey: "tableTypeId", as: "tables" });
Table.belongsTo(TableType, { foreignKey: "tableTypeId", as: "tableType" });

Table.hasMany(Reservation, { foreignKey: "tableId", as: "reservations" });
Reservation.belongsTo(Table, { foreignKey: "tableId", as: "table" });

Reservation.hasOne(Review, { foreignKey: "reservationId", as: "review" });
Review.belongsTo(Reservation, {
	foreignKey: "reservationId",
	as: "reservation",
});

export { User, Table, Reservation, TableType, Review };
