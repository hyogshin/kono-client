import React from 'react';
import { IoIosSearch } from 'react-icons/io';

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search for coins',
  value,
  onChange,
  onSearch,
}) => {
  return (
    <div className="relative mt-4">
      <input
        type="text"
        className="w-full py-2 px-3 mx-6 rounded-xl border border-grayBg focus:outline-none focus:ring-2 focus:ring-konoBlue"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onSearch();
          }
        }}
      />

      <button
        className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-konoBlue"
        onClick={onSearch}
      >
        <IoIosSearch className="text-2xl" />
      </button>
    </div>
  );
};

export default SearchBar;
