import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css'; // Import your CSS file

const Home = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    if (isValidEmail(email)) {
      navigate('quiz');
    } else {
      alert('Please enter a valid email address');
    }
  };

  const isValidEmail = (input) => {
    // Use a simple email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(input);
  };

  return (
    <div className="home-container">
      <h2 className="home-title">Enter Your Email:</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@example.com"
          required
          pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
          className="email-input"
        />
        <button type="submit" className="submit-button" disabled={!isValidEmail(email)}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default Home;
