import express, { response } from "express";
import { Recipe } from "../models/recipe.js";
import { Cuisine } from "../models/cuisine.js";
import { uuid } from "uuidv4";
import axios from "axios";
import * as cheerio from "cheerio";
import recipeScraper from "recipe-scraper"


const router = express.Router();

const myScrape = ( async (recipeLink)=> {
  try{
    if (recipeLink)
    console.log(recipeLink)
    const response = await axios.get(recipeLink);
    const html = response.data;
    const $ = cheerio.load(html);
    const parentElement = $('.recipe-method-section');
    const directions = parentElement.find('ul li div:nth-child(2)');
    let steps = []
    directions.each((i, direction) => {
      // each step was giving a large amount of blank space and newline tags
      // regular expression that replaces that empty space awith a single blank space
      const step = $(direction).text().replace(/\s+/g, ' ').trim();
      const brokenDownStep = step.split(". ")
      console.log(brokenDownStep);
      steps = steps.concat(brokenDownStep);
    })
    console.log("link not supported by package");
    return steps;
  }
  catch(error){
    throw new Error ("Your Scrape doesn't work: " + error);
  }
})

router.post("/scrape_recipe", async (req, res) =>{
  const {recipeLink} = req.body;
  try{
    //console.log(recipeLink)
    const response = await recipeScraper(recipeLink);
    res.status(200).json(response.instructions);
  }
  catch(error){
    try{
      const scrap = await myScrape(recipeLink);
      res.status(200).json(scrap)
    }
    catch(error){
      res.status(500).json({error: "Recipe Unavailable: " + error});
    }
  }

})
router.post("/add_recipe", async (req, res) => {
    const {
        recipeName,
        recipeSource,
        ingredientLines,
        directions,
        url,
        calories,
        servings,
        cuisine
        } = req.body;
    
    try {
        const recipeId = uuid();
        const code = cuisine.replaceAll(" ", "%20");

      const user = req.session.user;
      const checkCuisine = await Cuisine.findOne({where: {cuisineName : cuisine}});
      if(!checkCuisine){
        
        const cuisineData = {
            cuisineName : cuisine,
            cusineCode: code
        }
        const newCuisine = await Cuisine.create(cuisineData);
      }
      const newRecipe = await Recipe.create({
        userId: user.id,
        recipeId,
        recipeName,
        recipeSource,
        ingredientLines,
        directions,
        url,
        calories,
        servings,
        cuisine
      });
      res.status(200).json({recipeId: recipeId, cuisine: code})
    }
    catch(error){
        res.status(500).json({error: "Server Error: " + error});
    }
});

export default router;