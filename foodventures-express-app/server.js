import express from "express";
import cors from "cors";
import morgan from "morgan";
import { sequelize } from "./database.js";
import userRouter from "./routes/user.js";
import session from "express-session";
import SequelizeStoreInit from 'connect-session-sequelize';
import favoritesRouter from "./routes/favorites.js"

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(morgan());

const SequelizeStore = SequelizeStoreInit(session.Store);
const sessionStore = new SequelizeStore({
  db: sequelize
});

app.use(
    session({
        secret: "foodventures",
        resave: false,
        saveUninitialized: false,
        store: sessionStore,
        cookie: {
            sameSite: false,
            secure: false,
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
        }
    })
);
sessionStore.sync();

app.get("/", async (req, res) => {
  res.json({ ping1: "pong" });
});
app.use(userRouter);
app.use(favoritesRouter);

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});

sequelize.sync({ alter: true });
