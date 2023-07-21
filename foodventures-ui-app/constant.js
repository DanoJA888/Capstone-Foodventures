
export const API_ID = "305eeabe";
export const API_KEY = "9e7c1459f48822c0c067d0077d3d3962";

export function url(recipeId = null, cuisine = null, q = null){
  const linkFront = `https://api.edamam.com/api/recipes/v2`
  const linkBack = `?type=public&app_id=${API_ID}&app_key=${API_KEY}`
  let generalLink = linkFront+linkBack;
  if(recipeId){
    return linkFront + "/" + recipeId + linkBack;
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


export const API_CALL = `https://api.edamam.com/api/recipes/v2`

