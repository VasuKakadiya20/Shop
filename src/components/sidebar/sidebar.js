import React, { useEffect, useState } from 'react'
import Button from '@mui/material/Button';
import { FaAngleRight } from "react-icons/fa6";
import { SlNote } from "react-icons/sl";
import { Link } from "react-router-dom";
import { BsFillClipboardDataFill } from "react-icons/bs";
import { MdOutlineTaskAlt } from "react-icons/md";
import user from "../../img/user.png"
import { CiChat1 } from "react-icons/ci";

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState(null);
  const [isToggleSubmenu, setIsToggleSubmenu] = useState(false);

  return (
 <>
    <div className="sidebar mt-3">
      <ul>
              <li>
          <Link to="/">
            <Button className={`w-100 ${activeTab === 0 ? "active" : ""}`}>
              <span className="icons"><BsFillClipboardDataFill /></span>
              Add Client
              <span className="arrows"><FaAngleRight /></span>
            </Button>
          </Link>
        </li>
        <li>
          <Link to="/client">
            <Button className={`w-100 ${activeTab === 0 ? "active" : ""}`}>
              <span className="icons"><BsFillClipboardDataFill /></span>
               Invoice list
              <span className="arrows"><FaAngleRight /></span>
            </Button>
          </Link>
        </li>
      </ul>
    </div>
 </>
  );
};

export default Sidebar

