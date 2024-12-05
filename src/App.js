import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/school/:id" element={<SchoolDetailPage />} />
        <Route path="/add-school" element={<AddSchoolPage />} />
      </Routes>
    </Router>
  );
};

const HomePage = () => {
  const [schools, setSchools] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 8 });  // Show 8 schools per page
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);

  const fetchSchools = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5001/api/schools', {
        params: {
          name: searchQuery,
          page: pagination.page,
          limit: pagination.limit,
        },
      });
      setSchools(response.data);
    } catch (error) {
      console.error('Error fetching schools:', error);
      alert('Error fetching schools. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchSchools();
  }, [fetchSchools]);

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 2) {
      setSuggestionsLoading(true);
      try {
        const response = await axios.get('http://localhost:5001/api/schools/suggestions', { params: { query } });
        setSuggestions(response.data);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        alert('Error fetching search suggestions. Please try again later.');
      } finally {
        setSuggestionsLoading(false);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handlePagination = (direction) => {
    setPagination((prev) => ({
      ...prev,
      page: direction === 'next' ? prev.page + 1 : prev.page - 1,
    }));
  };

  return (
    <div className="HomePage">
      <header>
        <h1>SchoolHive</h1>
        <div className="search-bar">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by School Name, City, or State"
          />
          <div className="suggestions">
            {suggestionsLoading ? (
              <p>Loading suggestions...</p>
            ) : (
              suggestions.length > 0 && searchQuery.length > 2 && (
                <ul>
                  {suggestions.map((school) => (
                    <li key={school.id}>
                      <Link to={`/school/${school.id}`}>{school.name}</Link>
                    </li>
                  ))}
                </ul>
              )
            )}
          </div>
        </div>
        <Link className="add-school-button" to="/add-school">
          Add New School
        </Link>
      </header>

      <main>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="school-list">
            {schools.length > 0 ? (
              schools.map((school) => (
                <div className="school-card" key={school.id}>
                  <img
                    src={school.image ? `http://localhost:5001/schoolImages/${school.image}` : '/default-school.jpg'}
                    alt="School"
                  />
                  <h2>{school.name}</h2>
                  <p>{school.address}</p>
                  <p>
                    {school.city}, {school.state}
                  </p>
                  <Link to={`/school/${school.id}`} className="view-details-btn">
                    View Details
                  </Link>
                </div>
              ))
            ) : (
              <p>No schools found.</p>
            )}
          </div>
        )}

        <div className="pagination">
          <button onClick={() => handlePagination('prev')} disabled={pagination.page === 1}>
            Previous
          </button>
          <button onClick={() => handlePagination('next')} disabled={schools.length < pagination.limit}>
            Next
          </button>
        </div>
      </main>
    </div>
  );
};

const SchoolDetailPage = () => {
  const { id } = useParams();
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchoolDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/schools/${id}`);
        setSchool(response.data);
      } catch (error) {
        console.error('Error fetching school details:', error);
        alert('Error fetching school details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSchoolDetails();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="SchoolDetailPage">
      <main>
        <div className="school-details-container">
          <h1>{school.name}</h1>
          <img
            src={school.image ? `http://localhost:5001/schoolImages/${school.image}` : '/default-school.jpg'}
            alt="School"
            className="school-image"
          />
          <div className="details">
            <p>
              <strong>Address:</strong> {school.address}
            </p>
            <p>
              <strong>City:</strong> {school.city}
            </p>
            <p>
              <strong>State:</strong> {school.state}
            </p>
            <p>
              <strong>Contact:</strong> {school.contact}
            </p>
            <p>
              <strong>Email:</strong> {school.email}
            </p>
          </div>
        </div>
      </main>
      <Link className="back-to-home-btn" to="/">Back to Home</Link>
    </div>
  );
};

const AddSchoolPage = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('address', data.address);
    formData.append('city', data.city);
    formData.append('state', data.state);
    formData.append('contact', data.contact);
    formData.append('email', data.email);
    formData.append('image', data.image[0]);

    try {
      await axios.post('http://localhost:5001/api/schools', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      reset();
      alert('School added successfully!');
    } catch (error) {
      console.error('Error adding school:', error);
      alert('Error adding school. Please try again later.');
    }
  };

  return (
    <div className="AddSchoolPage">
      <main>
        <div className="form-container">
          <h1>Add New School</h1>
          <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
            <input {...register('name', { required: 'School name is required' })} placeholder="School Name" />
            <p>{errors.name?.message}</p>

            <input {...register('address', { required: 'Address is required' })} placeholder="Address" />
            <p>{errors.address?.message}</p>

            <input {...register('city', { required: 'City is required' })} placeholder="City" />
            <p>{errors.city?.message}</p>

            <input {...register('state', { required: 'State is required' })} placeholder="State" />
            <p>{errors.state?.message}</p>

            <input {...register('contact', { required: 'Contact number is required' })} placeholder="Contact" />
            <p>{errors.contact?.message}</p>

            <input
              type="email"
              {...register('email', { required: 'Email is required', pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/ })}
              placeholder="Email"
            />
            <p>{errors.email?.message}</p>

            <input type="file" {...register('image', { required: 'School image is required' })} />
            <p>{errors.image?.message}</p>

            <button type="submit">Add School</button>
          </form>
        </div>
      </main>
      <Link className="back-to-home-btn" to="/">Back to Home</Link>
    </div>
  );
};

export default App;
