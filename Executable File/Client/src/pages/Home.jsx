import React, { useEffect, useState } from 'react';
import '../styles/Home.css';
import Products from '../components/Products';
import Footer from '../components/Footer';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [bannerImg, setBannerImg] = useState('');

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const res = await axios.get('http://localhost:6001/fetch-banner');
        setBannerImg(res.data);
      } catch (err) {
        console.error('Failed to fetch banner:', err);
      }
    };
    fetchBanner();
  }, []);

  return (
    <div className="HomePage">
      {/* Banner */}
      <div className="home-banner">
        {bannerImg && <img src={bannerImg} alt="ShopEZ promotional banner" />}
      </div>

      {/* Categories */}
      <div className="home-categories-container">
        {[
          {
            label: 'Fashion',
            path: 'Fashion',
            img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZQjXpWVVQhkT_A2n03XMo2KDV4yPSLBcoNA&usqp=CAU',
          },
          {
            label: 'Electronics',
            path: 'Electronics',
            img: 'https://5.imimg.com/data5/ANDROID/Default/2023/1/SE/QC/NG/63182719/product-jpeg-500x500.jpg',
          },
          {
            label: 'Mobiles',
            path: 'mobiles',
            img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3jUW7v1WFJL9Ylax9a4vazyKXwG-ktSinI4Rd7qi7MkhMr79UlIyyrNkbiK0Cz5u6WYw&usqp=CAU',
          },
          {
            label: 'Groceries',
            path: 'Groceries',
            img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXbpV_yQ_zCtZt_1kNebjvFqXvdDnLuuJPsQ&usqp=CAU',
          },
          {
            label: 'Sports Equipment',
            path: 'Sports-Equipment',
            img: 'https://a.storyblok.com/f/112937/568x464/82f66c3a21/all_the_english-_football_terms_you_need_to_know_blog-hero-low.jpg/m/620x0/filters:quality(70)/',
          },
        ].map((cat) => (
          <div
            className="home-category-card"
            key={cat.label}
            onClick={() => navigate(`/category/${cat.path}`)}
          >
            <img src={cat.img} alt={`${cat.label} category`} />
            <h5>{cat.label}</h5>
          </div>
        ))}
      </div>

      {/* Products */}
      <div id="products-body"></div>
      <Products category="all" />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
