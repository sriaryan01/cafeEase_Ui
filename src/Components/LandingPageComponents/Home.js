import React from "react";
import BannerBackground from "../../Assets/home-banner-background.png";
import BannerImage from "../../Assets/home-banner-image.png";
import { FiArrowRight } from "react-icons/fi";

const Home = () => {

  

  return (
    <div className="home-container" >
      <div className="home-banner-container">
        <div className="home-bannerImage-container">
          <img src={BannerBackground} alt="" />
        </div>
        <div className="home-text-section" id="Home">
          <h1 className="primary-heading">
            Welcome to CafeEase!
          </h1>
          <p className="primary-text">
            Discover a seamless and enjoyable experience with us. Browse through a wide variety of products and categories tailored to meet your needs.
          </p>
          <a href="#Login"><button className="secondary-button">
            Order Now <FiArrowRight />{""}
          </button></a>

        </div>
        <div className="home-image-section">
          <img src={BannerImage} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Home;
