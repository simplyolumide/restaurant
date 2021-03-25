import React from 'react'
import AddRestaurant from '../components/AddRestaurant'
import Header from '../components/Header'
import RestaurantList from '../components/RestaurantList'

const home = () => {
    return (
        <div>
            <Header></Header>
            <AddRestaurant></AddRestaurant>
            <RestaurantList></RestaurantList>
        </div>
    )
}

export default home;
