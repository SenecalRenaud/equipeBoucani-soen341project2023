import React from 'react';
import './searchbar.css';

const SearchBar = ({keyword,setKeyword}) => {
  const BarStyling = {flexGrow: 2};//width:"20rem",background:"#F2F1F9", border:"none", padding:"0.5rem"};
  return (
    <input
        type='search'
        id='postingsSearchBar'
     style={BarStyling}
     key="random1"
     value={keyword}
     placeholder={"Search for a posting"}
     onChange={(e) => setKeyword(e.target.value)}
    />
  );
}

export default SearchBar