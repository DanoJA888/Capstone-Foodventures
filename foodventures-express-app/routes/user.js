import express from "express";
import bcrypt from "bcrypt";
import { User } from "../models/user.js";
import { Op } from "sequelize";

const router = express.Router();

router.get("/user", async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/user", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const userAlreadyExists = await User.findOne({
      where: { [Op.or]: [{ username }, { email }] },
    });

    if (userAlreadyExists) {
      return res
        .status(400)
        .json({ error: "Username or email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      password: hashedPassword,
      email,
    });

    req.session.user = newUser;

    res.status(200).json({ user: newUser });
  } catch (error) {
    res.status(500).json({ error: "Server error." });
  }
});

router.post("/user/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ where: { username } });

  if (user === null) {
    return res.status(401).json({ error: "Invalid username" });
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    return res.status(401).json({ error: "Invalid password." });
  }

  req.session.user = user;

  res.status(200).json({ user });
});
export default router;

router.post("/user/logout", async (req, res) => {
    req.session.destroy();
    res.status(200).send("Logged out");
})
