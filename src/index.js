import "./config/index.js";
import express from "express";
import { router as routerAuth } from "./routes/auth.js";
import { router as routerUser } from "./routes/users.js";
import { router as routerTableType } from "./routes/tableTypes.js";
import { router as routerTable } from "./routes/tables.js";
import { router as routerReview } from "./routes/reviews.js";
import { router as routerReservation } from "./routes/reservations.js";
import { sequelize } from "./db.js";

const PORT = process.env.PORT;

const app = express();
app.use(express.json());

app.use("/auth", routerAuth);
app.use("/users", routerUser);
app.use("/tableTypes", routerTableType);
app.use("/tables", routerTable);
app.use("/reservations", routerReservation);
app.use("/reviews", routerReview);
await sequelize.authenticate();
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
