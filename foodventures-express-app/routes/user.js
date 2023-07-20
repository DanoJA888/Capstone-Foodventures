import express from "express";
import bcrypt from "bcrypt";
import { User } from "../models/user.js";
import { Op } from "sequelize";

const router = express.Router();

//
function compareOcurrance(c1, c2) {
  return c2 - c1;
}

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
      favCuisines: {},
      favIngs: {}
    });

    req.session.user = newUser;

    res.status(200).json({ user: newUser });
  } catch (error) {
    res.status(500).json({ error: "Server error" +error });
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

router.get("/user_cuisines", async (req, res) =>{
  try{
    const user = req.session.user;
    const cuisineArr = Object.keys(user.favCuisines).map((cuisine) => ({
      name: cuisine,
      occurrence: user.favCuisines[cuisine]
    }));
    cuisineArr.sort((c1, c2) => compareOcurrance(c1.occurrence, c2.occurrence));
    console.log(cuisineArr);
    let topCuisines = [];
    if (cuisineArr.length < 3){
      for(let i = 0; i < cuisineArr.length; i++){
        topCuisines.push(cuisineArr[i].name);
      }
    }
    else{
      topCuisines = [
        cuisineArr[0].name,
        cuisineArr[1].name,
        cuisineArr[2].name
      ]
    }
    console.log(topCuisines)
    res.status(200).json({topCuisines});
  }
  catch(error){
    res.status(500).json({error: "server error: " + error})
  }
})
export default router;
