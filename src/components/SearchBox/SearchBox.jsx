import React from "react";
import { IoSearch } from "react-icons/io5";


const SearchBox = () => {
    return(
        <>
            <div className="search-box posotion-relative d-flex align-items-center">
                <IoSearch className="mr-2" />
                <input  placeholder="Search here..." />
            </div>
        </>
    )
}

export default SearchBox;
