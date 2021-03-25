import React from 'react';
// import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import { RestaurantContextProvider } from './context/RestaurantContext';
import Home from './routes/Home';
import RestaurantDetail from './routes/RestaurantDetail';
import RestaurantUpdate from './routes/RestaurantUpdate';


const App = () =>{
  return ( 
  <RestaurantContextProvider>
  <div className="container">
    <Router>
      <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/restaurants/:id/update" component={RestaurantUpdate} />
      <Route exact path="/restaurants/:id" component={RestaurantDetail} />
      </Switch>  
    </Router>
  </div>
  </RestaurantContextProvider>
  )
};

export default App;