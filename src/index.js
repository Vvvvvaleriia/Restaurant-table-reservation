import express from "express";
import { router as routerUser } from "./routes/users.js";
import { sequelize } from "./db.js";

process.loadEnvFile();
const PORT = process.env.PORT;

const app = express();
app.use(express.json());

app.use("/users", routerUser);
await sequelize.authenticate();
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
