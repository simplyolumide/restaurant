require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 5001;
const redis_port = process.env.REDIS_PORT || 6379; 
const morgan = require('morgan');
const db = require('./db');
const cors = require('cors');
const redis = require('redis');


const client = redis.createClient(redis_port);

app.use(morgan("dev"));
app.use(cors());
app.use(express.json()); // To read post requests
app.use(express.urlencoded({ extended: true }));


//Cache middleware
function cache(req,res,next){
    const { id } = req.params;

    client.get(id,(err,data)=>{
        if(err) {
            throw err;
        }
        if(data !== null ){
            const details = JSON.parse(data);
            console.log(details.restaurant[0]);
            res.status(200).json({
                status : "Success",
                results : details.restaurant.rowCount,
                data : {
                    restaurant : details.restaurant,
                    reviews : details.reviews
                }
            });
        }
        else{
            next();
        }
    })
}
/* Returns all restaurants */
app.get("/api/v1/restaurants",async (req,res)=>{
   
    try{
    //const results = await db.query("select * from restaurants");
    const restaurantRatingsData = await db.query(
        "select * from restaurants left join (select restaurant_id, COUNT(*), TRUNC(AVG(rating),1) as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id;"
      );
    // console.log(restaurantRatingsData.rows);
    res.status(200).json({
        status : "Success",
        results : restaurantRatingsData.rowCount,
        data : {
            restaurants : restaurantRatingsData.rows,
        }
    });
    }
    catch(err){
        res.status(400).json({
            error : err
        });
    };
});

/* Returns restaurant for id */
app.get("/api/v1/restaurants/:id",cache,async (req,res)=>{

    
    try{
        const restaurant = await db.query(
            "select * from restaurants left join (select restaurant_id, COUNT(*), TRUNC(AVG(rating),1) as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id where id = $1",
            [req.params.id]
          );        
        const reviews = await db.query(
            "select * from reviews where restaurant_id = $1",
            [req.params.id]
          );
          //console.log(restaurant.rows);
          client.setex(req.params.id,600,JSON.stringify(
            {
                restaurant : restaurant.rows,
                reviews : reviews.rows
            }
          ))
        res.status(200).json({
            status : "Success",
            results : restaurant.rowCount,
            data : {
                restaurant : restaurant.rows,
                reviews : reviews.rows
            }
        });
        }
        catch(err){
            res.status(400).json({
                error : err
            });
        };
});

/* Create a restaurant */
app.post("/api/v1/restaurants",async (req,res)=>{

    try{
        const results = await db.query("INSERT INTO restaurants (name,location,price_range) values($1,$2,$3) returning *", [req.body.name, req.body.location, req.body.price_range]);
        res.status(200).json({
            status : "Success",
            results : results.rowCount,
            data : {
                restaurants : results.rows[0]
            }
        });
        }
        catch(err){
            res.status(400).json({
                error : err
            });
        };
});

/* Update a restaurant */
app.put("/api/v1/restaurants/:id", async (req,res)=>{

    
    try{
        const results = await db.query("UPDATE restaurants SET  name = $1, location = $2, price_range =$3 where id = $4 returning *", [req.body.name, req.body.location, req.body.price_range,req.params.id]);
        res.status(200).json({
            status : "Success",
            results : results.rowCount,
            data : {
                restaurants : results.rows[0]
            }
        });
        }
        catch(err){
            res.status(400).json({
                error : err
            });
        };
    
});

/* Delete a restaurant */
app.delete("/api/v1/restaurants/:id", async (req,res)=>{
    console.log(req.params.id);
    try{
        const results = await db.query("DELETE FROM restaurants  where id = $1", [req.params.id]);
        res.status(200).json({
            status : "Success",
        });
        }
        catch(err){
            res.status(400).json({
                error : err
            });
        };
});


app.post("/api/v1/restaurants/:id/addReview", async (req, res) => {
    try {
      const newReview = await db.query(
        "INSERT INTO reviews (restaurant_id, name, review, rating) values ($1, $2, $3, $4) returning *;",
        [req.params.id, req.body.name, req.body.review, req.body.rating]
      );
      console.log(req.body);
      res.status(201).json({
        status: "success",
        data: {
          review: newReview.rows[0],
        },
      });
    } catch (err) {
      console.log(err);
    }
  });


app.listen(port,()=>{
    console.log(`Server Started on port ${port}`);
});