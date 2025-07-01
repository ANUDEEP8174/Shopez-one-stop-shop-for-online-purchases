import React, { useEffect, useState } from 'react';
import '../styles/Products.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Products = ({ category }) => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [sortFilter, setSortFilter] = useState('popularity');
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [genderFilter, setGenderFilter] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const productRes = await axios.get('http://localhost:6001/fetch-products');
      const fetchedProducts = productRes.data;

      const filtered = category === 'all'
        ? fetchedProducts
        : fetchedProducts.filter(p => p.category === category);

      setProducts(filtered);
      setVisibleProducts(filtered);

      const categoryRes = await axios.get('http://localhost:6001/fetch-categories');
      setCategories(categoryRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const handleSortFilterChange = (e) => {
    const value = e.target.value;
    setSortFilter(value);

    const sorted = [...visibleProducts]; // clone to avoid mutating state
    if (value === 'low-price') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (value === 'high-price') {
      sorted.sort((a, b) => b.price - a.price);
    } else if (value === 'discount') {
      sorted.sort((a, b) => b.discount - a.discount);
    }
    setVisibleProducts(sorted);
  };

  const handleCategoryCheckBox = (e) => {
    const { value, checked } = e.target;
    setCategoryFilter(prev =>
      checked ? [...prev, value] : prev.filter(c => c !== value)
    );
  };

  const handleGenderCheckBox = (e) => {
    const { value, checked } = e.target;
    setGenderFilter(prev =>
      checked ? [...prev, value] : prev.filter(g => g !== value)
    );
  };

  useEffect(() => {
    let filtered = products;

    if (categoryFilter.length > 0) {
      filtered = filtered.filter(product => categoryFilter.includes(product.category));
    }

    if (genderFilter.length > 0) {
      filtered = filtered.filter(product => genderFilter.includes(product.gender));
    }

    setVisibleProducts(filtered);
  }, [categoryFilter, genderFilter, products]);

  return (
    <div className="products-container">
      <aside className="products-filter">
        <h4>Filters</h4>
        <div className="product-filters-body">
          {/* Sort Filter */}
          <div className="filter-sort">
            <h6>Sort By</h6>
            <div className="filter-sort-body sub-filter-body">
              {['popularity', 'low-price', 'high-price', 'discount'].map((option, i) => (
                <div className="form-check" key={i}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name="sortFilter"
                    id={`sort-${option}`}
                    value={option}
                    checked={sortFilter === option}
                    onChange={handleSortFilterChange}
                  />
                  <label className="form-check-label" htmlFor={`sort-${option}`}>
                    {option === 'popularity'
                      ? 'Popular'
                      : option === 'low-price'
                      ? 'Price (low to high)'
                      : option === 'high-price'
                      ? 'Price (high to low)'
                      : 'Discount'}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          {category === 'all' && (
            <div className="filter-categories">
              <h6>Categories</h6>
              <div className="filter-categories-body sub-filter-body">
                {categories.map((cat, i) => (
                  <div className="form-check" key={i}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={cat}
                      id={`category-${cat}`}
                      checked={categoryFilter.includes(cat)}
                      onChange={handleCategoryCheckBox}
                    />
                    <label className="form-check-label" htmlFor={`category-${cat}`}>
                      {cat}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Gender Filter */}
          <div className="filter-gender">
            <h6>Gender</h6>
            <div className="filter-gender-body sub-filter-body">
              {['Men', 'Women', 'Unisex'].map((gender, i) => (
                <div className="form-check" key={i}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value={gender}
                    id={`gender-${gender}`}
                    checked={genderFilter.includes(gender)}
                    onChange={handleGenderCheckBox}
                  />
                  <label className="form-check-label" htmlFor={`gender-${gender}`}>
                    {gender}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Product Listing */}
      <section className="products-body">
        <h3>All Products</h3>
        <div className="products">
          {visibleProducts.map((product) => (
            <div className="product-item" key={product._id}>
              <div className="product" onClick={() => navigate(`/product/${product._id}`)}>
                <img src={product.mainImg} alt={product.title} />
                <div className="product-data">
                  <h6>{product.title}</h6>
                  <p>{product.description.slice(0, 30)}...</p>
                  <h5>
                    ₹{Math.floor(product.price - (product.price * product.discount) / 100)}{' '}
                    <s>{product.price}</s>{' '}
                    <span>({product.discount}% off)</span>
                  </h5>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Products;
