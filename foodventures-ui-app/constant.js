export const API_ID = "305eeabe";
export const API_KEY = "9e7c1459f48822c0c067d0077d3d3962";
export const API_CALL = `https://api.edamam.com/api/recipes/v2`

export function url({recipeId = null, cuisine = null, q = null}){

  const linkBack = `?type=public&app_id=${API_ID}&app_key=${API_KEY}&random=true`
  let generalLink = API_CALL+linkBack;
  if(recipeId){
    return API_CALL + "/" + recipeId + linkBack;
  }
  if(cuisine){
    generalLink += `&cuisineType=${cuisine}`;
  }
  if(q){
    const search = q.replaceAll(" ", "%20")
    generalLink += `&q=${search}`;
  }
  return generalLink;
}

export const fetchCuisines = async () => {
  const response = await fetch("http://localhost:3001/get_cuisines", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return data;
};

const timeMeasurements = new Set(["minutes", "minute", "mins", "min", 
"seconds", "second", "secs", "sec", "hours", "hour", "hrs", "hr"]);
//handles case for word representation of time intervals
const timeInWords = {
  "a" : "1",
  "an" : "1",
  "few" : "2"
}

export function calculateDifficulty(ingredients, directions){
  const ingredientAmount = ingredients.length;
  const amountOfSteps = directions.length;
  let timeTaken = 0.0;
  let difficultyInfo = {
    difficulty: "",
    factors: 1
  };

  if (amountOfSteps > 0){
    difficultyInfo.factors = 3;
    directions.forEach((step) => {
      let words = step.split(' ');
      words.forEach((word, index) => {
        // this regex removes periods from the word, noticed that "hour." wasnt being recognized as part of the set
        const cleanWord = word.replace(/\./g, '');
        if(timeMeasurements.has(cleanWord)){
          //gets the string before the time measurement to add to time
          let number = words[index-1];
          console.log(number)
          if(number in timeInWords){
            console.log(timeInWords[number])
            number = timeInWords[number];
          }
          const timeValue = (parseInt(number[number.length-1]));
          let timeUnit = cleanWord.toLowerCase();
          // converting total time to minutes
          if (timeUnit.includes('hour') || timeUnit.includes('hr')) {
            timeTaken += timeValue * 60;
          } else if (timeUnit.includes('second') || timeUnit.includes('sec')) {
            timeTaken += timeValue / 60;
          }
          else{
            timeTaken += timeValue
          }
        }
        console.log(timeTaken);
      });
    });
    console.log(timeTaken);
    // giving points based on approximate time of prep
    let rank = 0
    if(timeTaken <= 20){
      rank +=1;
    }  else if(timeTaken >=45){
      rank +=3;
    } else{
      rank += 2;
    }
    //giving points based on average of ingredients and steps
    const stepAndIngDifficulty = (ingredientAmount + amountOfSteps) / 2;
    console.log(stepAndIngDifficulty);
    if(stepAndIngDifficulty <= 10){
      rank +=1;
    } else if(stepAndIngDifficulty >=25){
      rank +=3;
    } else{
      rank += 2;
    }
    //assigning a final rank based on the average of all 3 points
    const finalRank = rank / 2;
    console.log(finalRank);
    if(finalRank <= 1){
      difficultyInfo.difficulty = "Easy"
    } else if(finalRank <= 2){
      difficultyInfo.difficulty = "Medium";
    } else{
      difficultyInfo.difficulty = "Hard";
    }
    return difficultyInfo
  }
  //assigning a score based on #of ingredeints only if scrape is not supported
  if(ingredientAmount <= 10){
    difficultyInfo.difficulty=  "Easy";
  } else if(ingredientAmount >=25){
    difficultyInfo.difficulty =  "Hard";
  } else{
    difficultyInfo.difficulty =  "Medium";
  }
  return difficultyInfo;
}

//tooltip messages
export const difficultyFactorMessage = {
  1: `Based on total ingredients`,
  3: `Based on recipe ingredients, recipe steps, and approximate time`
}