import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      if (onSearch) {
        onSearch(query);
      }
    }
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="검색... (구역, 이벤트)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="search-input"
      />
      <button type="submit" className="search-button">
        🔍
      </button>
    </form>
  );
}

export default SearchBar;

