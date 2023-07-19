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
  const {
    username,
    email,
    password,
    firstName,
    lastName,
    heightFt,
    heightIn,
    weight,
  } = req.body;

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
      firstName,
      lastName,
      heightFt,
      heightIn,
      weight,
      favCuisines: {}
    });

    req.session.user = newUser;

    res.status(200).json({ user: newUser });
  } catch (error) {
    res.status(500).json({ error: "Server error." });
  }
});

router.post("/user/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });

    if (user === null) {
      return res.status(401).json({ error: "Invalid username" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid password." });
    }

    req.session.user = user;
    console.log(req.session.user);

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({error: "Server Error: " + error});
  }
});

router.put("/update_cuisine", async (req, res) => {
  const user = req.session.user;
  const changeUser = await User.findByPk(user.id);
  const {recipeId, recipeName, recipeCuisine} = req.body;
  try{
    {changeUser.favCuisines[recipeCuisine] ? 
      (changeUser.favCuisines[recipeCuisine] +=1) 
      : 
      (changeUser.favCuisines[recipeCuisine] =1)
    }
    await changeUser.save();
    res.status(200).json({user: changeUser})
  }
  catch(error){
    res.status(500).json({error: "Server Error: " + error});
  }
})
export default router;
