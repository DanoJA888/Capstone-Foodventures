import express from "express";
import cors from "cors";
import morgan from "morgan";
import { sequelize } from "./database.js";
import userRouter from "./routes/user.js";

const app = express();
const port = process.env.PORT || 3001;


app.use(cors());
app.use(express.json());
app.use(morgan());

app.get("/", async (req, res) =>{
    res.json({ping1: 'pong'});
})

app.use(userRouter);

app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});

sequelize.sync({ alter: true });