import React ,{ useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom';
import RestaurantApi from '../apis/RestaurantApi';

const UpdateRestaurant = (props) => {
    const {id} = useParams();
    const [name,setName] = useState("");
    const [location,setLocation] = useState("");
    const [priceRange,setPriceRange] = useState("Price Range");
    let history = useHistory();

    useEffect(()=>{
        const fetchData = async() =>{

            const response = await RestaurantApi.get(`/${id}`);
            console.log(response.data.data.restaurant[0].id);
            setName(response.data.data.restaurant[0].name);
            setLocation(response.data.data.restaurant[0].location);
            setPriceRange(response.data.data.restaurant[0].price_range);
        }
        fetchData();
        // eslint-disable-next-line 
    },[]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedRestaurant = await RestaurantApi.put(`/${id}`, {
          name,
          location,
          price_range: priceRange,
        });
        console.log(updatedRestaurant);
        history.push("/");
      };

      
    return (
        <div>
            <form>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Name"
                        value = { name }
                        onChange = {(e)=>setName(e.target.value)}
                        />
                </div>
                <div className="form-group">
                    <label htmlFor="location">Location</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Location"
                        value = { location }
                        onChange = {(e)=>setLocation(e.target.value)}
                        />
                </div>
                <div className="form-group">
                <label htmlFor="price_range">Price Range</label>
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
                <button className="btn btn-primary" onClick={handleSubmit}>Update</button>
            </form>
        </div>
    )
}

export default UpdateRestaurant;
