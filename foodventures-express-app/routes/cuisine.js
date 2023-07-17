import express from "express";
import { Cuisine } from "../models/cuisine.js";


const router = express.Router();

router.get("/get_cuisines", async (req, res) => {
    try {  
      const cuisines = await Cuisine.findAll();
      res.json(cuisines);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server Error" });
    }
});

export default router;