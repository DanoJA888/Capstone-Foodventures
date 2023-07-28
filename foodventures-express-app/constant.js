
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