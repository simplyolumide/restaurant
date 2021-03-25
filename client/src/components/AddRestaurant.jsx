import React, { useState , useContext } from 'react'
import RestaurantApi from '../apis/RestaurantApi';
import { RestaurantContext } from '../context/RestaurantContext';
const AddRestaurant = () => {

    const { addRestaurants } = useContext(RestaurantContext);
    const [name,setName] = useState("");
    const [location,setLocation] = useState("");
    const [priceRange,setPriceRange] = useState("Price Range");

    const handleSubmit = async (e)=>{
      e.preventDefault();

      try{

        const response =  await RestaurantApi.post("/", {
          name,
          location,
          price_range : priceRange
        }
        );
        console.log(response);
        addRestaurants(response.data.data.restaurants);
        setName("");
        setPriceRange("Price Range");
        setLocation("");
      }catch(err){}

    }
    return (
        <div className="mb-4">
      <form action="">
        <div className="form-row">
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Name"
              value = { name }
              onChange = {(e)=>setName(e.target.value)}
            />
          </div>
          <div className="col">
            <input
              className="form-control"
              type="text"
              placeholder="Location"
              value = { location }
              onChange = {(e)=>setLocation(e.target.value)}
            />
          </div>
          <div className="col">
            <select
              value = { priceRange }
              onChange = {(e)=>setPriceRange(e.target.value)}
              className="custom-select my-1 mr-sm-2"
            >
              <option disabled>Price Range</option>
              <option value="1">₹</option>
              <option value="2">₹₹</option>
              <option value="3">₹₹₹</option>
              <option value="4">₹₹₹₹</option>
              <option value="5">₹₹₹₹₹</option>
            </select>
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            onClick = {handleSubmit}
          >
            Add
          </button>
        </div>
      </form>
    </div>
    )
}

export default AddRestaurant
