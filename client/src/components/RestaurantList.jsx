import React,{useEffect,useContext} from 'react';
import RestaurantApi from '../apis/RestaurantApi';
import { RestaurantContext } from '../context/RestaurantContext';
import { useHistory } from "react-router-dom";
import StarRating from "../components/StarRating";
const RestaurantList = (props) => {


    const {restaurants,setRestaurants} = useContext(RestaurantContext);


    let history = useHistory();

    const handleDelete = async (e,id)=>{
      e.stopPropagation();
      try {
        const response = await RestaurantApi.delete(`/${id}`);
        console.log(response);
        setRestaurants(restaurants.filter((restaurant)=>{
          return restaurant.id !== id
        }));
      }catch(err){
        console.log(err);
      }
    }

    const handleUpdate =(e,id)=>{
      e.stopPropagation();
      history.push(`restaurants/${id}/update`)
    }

    const handleRestaurantSelect =(id)=>{
      history.push(`restaurants/${id}`)
    }

    const renderRating = (restaurant)=>{
      if(!restaurant.count){
        return <span className="text-warning">0 reviews</span>
      }
      return ( <div>
      <StarRating rating={restaurant.average_rating} />
      <span className="text-warning ml-1">({restaurant.count})</span>
      </div>);
    }

    useEffect(()=>{

        const fetchData = async ()=>{
            try{
                const response = await RestaurantApi.get("/");
                console.log(response);
                setRestaurants(response.data.data.restaurants);
            }catch(err){}
        };

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);
    return (
        <div className="list-group">
        <table className="table table-hover table-dark">
          <thead>
            <tr className="bg-primary">
              <th scope="col">Restaurant</th>
              <th scope="col">Location</th>
              <th scope="col">Price Range</th>
              <th scope="col">Ratings</th>
              <th scope="col">Edit</th>
              <th scope="col">Delete</th>
            </tr>
          </thead>
          <tbody>        
          {restaurants &&
            restaurants.map((restaurant) => {
              return ( <tr 
                        onClick={() => { handleRestaurantSelect(restaurant.id) }}
              key={ restaurant.id }>
                <td>{ restaurant.name }</td>
                <td>{restaurant.location}</td>
                <td>{ "₹".repeat(restaurant.price_range) }</td>
                <td>{ renderRating(restaurant) }</td>
                <td>
                <button className="btn btn-warning" onClick ={ (e) => handleUpdate(e,restaurant.id)}>Update</button>
              </td>
              <td>
                <button className="btn btn-danger" onClick = { (e) =>  handleDelete(e,restaurant.id)}>Delete</button>
              </td>
              </tr>
            );})}   
          </tbody>
        </table>
      </div>
    )
}

export default RestaurantList
