import React from "react";
import Pasta from"../../Assets/Pasta.jpg"
import Pizza from"../../Assets/pizza.png"
import Shakes from"../../Assets/shakes.jpg"

const Category = () => {
  const workInfoData = [
    {
      image: Pasta,
      title: "Lovely Pastas",
      text: "Customer Rating : 4.98/5",
    },
    {
      image: Pizza,
      title: "Delicious Pizzas",
      text: "Customer Rating : 4.95/5",
    },
    {
      image: Shakes,
      title: "Healthy Shakes",
      text: "Customer Rating : 4.9/5",
    },
  ];

  
  return (
    <div className="category-section-wrapper" id="Category">
      <div className="category-section-top" >
        <p className="primary-subheading">Category</p>
        <h1 className="primary-heading">Our Top Rated Categories</h1>
        <p className="primary-text" >
          Based on the valuable feedback of the customers.... 
        </p>
      </div>
      <div className="category-section-bottom">
        {workInfoData.map((data) => (
          <div className="category-section-info" key={data.title}>
            <div className="info-boxes-img-container">
              <img src={data.image} alt="" className="top-category-img"/>
            </div>
            <h2>{data.title}</h2>
            <p>{data.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;
