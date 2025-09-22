import React, { useState } from 'react';
import styles from './SearchAndFilter.module.css';

interface SearchAndFilterProps {
  onSearch: (searchTerm: string, category: string) => void;
  categories: string[];
}

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({ onSearch, categories }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm, selectedCategory);
  };

  return (
    <div className={styles.searchFilterContainer}>
      <form onSubmit={handleSearch} className={styles.searchForm}>
        <div className={styles.searchInputGroup}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={styles.categorySelect}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <button type="submit" className={styles.searchButton}>
            Search
          </button>
        </div>
      </form>
    </div>
  );
};
