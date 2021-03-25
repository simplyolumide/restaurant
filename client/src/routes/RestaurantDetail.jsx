import React ,{ useEffect , useContext} from 'react'
import RestaurantApi from '../apis/RestaurantApi';
import { RestaurantContext } from '../context/RestaurantContext';
import { useParams } from 'react-router-dom';
import StarRating from '../components/StarRating';
import Reviews from '../components/Reviews';
import AddReview from '../components/AddReview';

const RestaurantDetail = () => {

    const { id } = useParams();

    const { selectedRestaurant, setSelectedRestaurant } = useContext(RestaurantContext);    
    useEffect(()=>{
        const fetchData = async() =>{
            console.log(id);
            const response = await RestaurantApi.get(`/${id}`);
            console.log(response.data.data);
            setSelectedRestaurant(response.data.data);
        }
        fetchData();
        // eslint-disable-next-line 
    },[]);
    return (
        <div>
            {selectedRestaurant && (
        <>
          <h1 className="text-center display-1">
            {selectedRestaurant.restaurant[0].name}
          </h1>
          <div className="text-center">
            <StarRating rating={selectedRestaurant.restaurant[0].average_rating} />
            <span className="text-warning ml-1">
              {selectedRestaurant.restaurant[0].count
                ? `(${selectedRestaurant.restaurant[0].count})`
                : "(0)"}
            </span>
          </div>
          <div className="mt-3">
            <Reviews reviews={selectedRestaurant.reviews} />
          </div>
          <AddReview />
        </>
      )}
        </div>
    )
}

export default RestaurantDetail;
