import React from "react";
import { Link } from 'react-router-dom';
import { Carousel, Card} from "react-bootstrap";

export default function RecipeCarousel({groupedRecipes}) {
  return(
    <Carousel interval={5000} indicators={true} className="col-md-12s info-box">
      {groupedRecipes.map((recipes) => (
        <Carousel.Item>
          <div className="d-flex justify-content-around">
            {recipes.map((recipe) => (
              <div className="border border-dark border-2 p-4 text-center bg-white rounded">
                {recipe.recipe !== undefined ? (
                  <>
                  <Card style={{ width: '15rem', border: '2px solid', borderColor: '#4fb354', height: '325px'}}>
                    <Card.Img variant="top" src={recipe.recipe.image} />
                    <Card.Body>
                    <Link className="link" to={`/searched/${recipe.recipeId}`}>
                      <p className=" text-primary">{recipe.recipe.label}</p>
                    </Link>
                    </Card.Body>
                  </Card>
                  </>
                ) : (
                  <>
                    <Card style={{ width: '15rem', border: '2px solid', borderColor: '#4fb354', height: '325px'}}>
                    <Card.Img variant="top" src={recipe.image} />
                    <Card.Body>
                    <Link className="link" to={`/searched/${recipe.recipeId}`}>
                      <p className=" text-primary">{recipe.recipeName}</p>
                    </Link>
                    </Card.Body>
                  </Card>
                  </>
                )}
              </div>
            ))}
          </div>
        </Carousel.Item>
      ))}
    </Carousel>
  )
}