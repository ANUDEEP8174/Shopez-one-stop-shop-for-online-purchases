import React, { useEffect, useState } from 'react';
import '../../styles/AllProducts.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AllProducts = () => {
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
      const [productsRes, categoriesRes] = await Promise.all([
        axios.get('http://localhost:6001/fetch-products'),
        axios.get('http://localhost:6001/fetch-categories')
      ]);
      setProducts(productsRes.data);
      setVisibleProducts(productsRes.data);
      setCategories(categoriesRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const handleCategoryCheckBox = (e) => {
    const { value, checked } = e.target;
    setCategoryFilter((prev) =>
      checked ? [...prev, value] : prev.filter((c) => c !== value)
    );
  };

  const handleGenderCheckBox = (e) => {
    const { value, checked } = e.target;
    setGenderFilter((prev) =>
      checked ? [...prev, value] : prev.filter((g) => g !== value)
    );
  };

  const handleSortFilterChange = (e) => {
    const value = e.target.value;
    setSortFilter(value);
    const sorted = [...visibleProducts];
    if (value === 'low-price') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (value === 'high-price') {
      sorted.sort((a, b) => b.price - a.price);
    } else if (value === 'discount') {
      sorted.sort((a, b) => b.discount - a.discount);
    }
    setVisibleProducts(sorted);
  };

  useEffect(() => {
    let filtered = products;

    if (categoryFilter.length > 0) {
      filtered = filtered.filter((p) => categoryFilter.includes(p.category));
    }

    if (genderFilter.length > 0) {
      filtered = filtered.filter((p) => genderFilter.includes(p.gender));
    }

    setVisibleProducts(filtered);
  }, [categoryFilter, genderFilter, products]);

  return (
    <div className="all-products-page">
      <div className="all-products-container">
        <aside className="all-products-filter">
          <h4>Filters</h4>
          <div className="all-product-filters-body">
            <div className="all-product-filter-sort">
              <h6>Sort By</h6>
              <div className="all-product-filter-sort-body all-product-sub-filter-body">
                {['popularity', 'low-price', 'high-price', 'discount'].map((sortKey, idx) => (
                  <div className="form-check" key={idx}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="sortFilter"
                      id={`sort-${sortKey}`}
                      value={sortKey}
                      checked={sortFilter === sortKey}
                      onChange={handleSortFilterChange}
                    />
                    <label className="form-check-label" htmlFor={`sort-${sortKey}`}>
                      {{
                        'popularity': 'Popularity',
                        'low-price': 'Price (low to high)',
                        'high-price': 'Price (high to low)',
                        'discount': 'Discount'
                      }[sortKey]}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="all-product-filter-categories">
              <h6>Categories</h6>
              <div className="all-product-filter-categories-body all-product-sub-filter-body">
                {categories.map((cat) => (
                  <div className="form-check" key={cat}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={cat}
                      id={`cat-${cat}`}
                      checked={categoryFilter.includes(cat)}
                      onChange={handleCategoryCheckBox}
                    />
                    <label className="form-check-label" htmlFor={`cat-${cat}`}>
                      {cat}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="all-product-filter-gender">
              <h6>Gender</h6>
              <div className="all-product-filter-gender-body all-product-sub-filter-body">
                {['Men', 'Women', 'Unisex'].map((gender) => (
                  <div className="form-check" key={gender}>
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

        <section className="all-products-body">
          <h3>All Products</h3>
          <div className="all-products">
            {visibleProducts.map((product) => (
              <div className="all-product-item" key={product._id}>
                <div className="all-product">
                  <img src={product.mainImg} alt={product.title} />
                  <div className="all-product-data">
                    <h6>{product.title}</h6>
                    <p>{product.description.slice(0, 30)}...</p>
                    <h5>
                      ₹{Math.floor(product.price - (product.price * product.discount) / 100)}{' '}
                      <s>{product.price}</s> <span>({product.discount}% off)</span>
                    </h5>
                  </div>
                  <button onClick={() => navigate(`/update-product/${product._id}`)}>Update</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AllProducts;
