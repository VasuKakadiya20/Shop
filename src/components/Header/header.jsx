import Button from "@mui/material/Button";
import { MdOutlineMenu } from "react-icons/md";
import SearchBox from "../SearchBox/SearchBox";
import logo from "../../img/logo.png";
import user from "../../img/user.png";
import { MdArrowDropDown } from "react-icons/md";
import { MdOutlineMenuOpen } from "react-icons/md";
import React, { useContext, useEffect, useState } from "react";
import { data, Link, useNavigate } from "react-router-dom";
import { mycontext } from "../../App";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import { IoSettingsSharp } from "react-icons/io5";
import { IoMdPersonAdd } from "react-icons/io";
import { MdOutlineEmail } from "react-icons/md";
import LockOutlineIcon from "@mui/icons-material/LockOutline";
import "./header.css"

export const Header = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  // const [isOpennotificationsDrop, setIsOpenNotificationsDrop] = useState(null);
const Username = localStorage.getItem("username") || "";
const Email = localStorage.getItem("email") || "";
  const openMyacc = Boolean(anchorEl);
  const handleOpenMyAccDrop = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMyAccDrop = () => {
    setAnchorEl(null);
  };


  const context = useContext(mycontext);
    const navigate = useNavigate();
    const logout = () => {
    context.setislogin(false);
    localStorage.removeItem("islogin");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    handleCloseMyAccDrop();
    navigate("/login");
  }

  return (
    <>
      <header className="d-flex align-items-center">
        <div className="container-fluid w-100">
          <div className="row d-flex align-items-center w-100">
          <div className="col-sm-2 part1">
  <Link to={"#"} className="d-flex align-items-center logo gap-2">
    <img src={logo} alt="logo" className="img-fluid " />
  </Link>
  <h3>Brakery</h3>
</div>

            {context.windowWidth > 992 && (
              <div className="col-sm-3 d-flex align-items-center part2 res-hide gap-2">
                <Button
                  className="rounded-circle mr-3"
                  onClick={() =>
                    context.setIsToggleSidebar(!context.isToggleSidebar)
                  }>
                  {context.isToggleSidebar === false ? (
                    <MdOutlineMenuOpen />
                  ) : (
                    <MdOutlineMenu />
                  )}
                </Button>
                <SearchBox />
              </div>
            )}

            <div className="col-sm-7 d-flex align-items-center justify-content-end gap-3 part3">
             
                <div className="myacc-wrapper">
                  <Button
                    className="myacc d-flex align-items-center"  onClick={handleOpenMyAccDrop}>
                    <div className="user-img">
                      <span className="rounded-circle">
                        <img src={user} alt="Admin" />
                      </span>
                    </div>
                    <div className="use-info res-hide">
                     <h4>
  {Username}
  <MdArrowDropDown style={{ fontSize: "22px" }} />
</h4>

<p className="mb-0">{Email}</p>
                    </div>
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={openMyacc}
                    onClose={handleCloseMyAccDrop}
                    onClick={handleCloseMyAccDrop}
                    slotProps={{
                      paper: {
                        elevation: 0,
                        sx: {
                          overflow: "visible",
                          filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                          mt: 1.5,
                          "& .MuiAvatar-root": {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                          },
                          "&::before": {
                            content: '""',
                            display: "block",
                            position: "absolute",
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: "background.paper",
                            transform: "translateY(-50%) rotate(45deg)",
                            zIndex: 0,
                          },
                        },
                      },
                    }}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}>
                    <MenuItem onClick={handleCloseMyAccDrop}>
                      <ListItemIcon>
                        <IoMdPersonAdd fontSize="small" />
                      </ListItemIcon>
                      My account
                    </MenuItem>
                    <MenuItem onClick={handleCloseMyAccDrop}>
                      <ListItemIcon>
                        <MdOutlineEmail />
                      </ListItemIcon>
                      In Box
                    </MenuItem>
                    <MenuItem onClick={handleCloseMyAccDrop}>
                      <ListItemIcon>
                        <IoSettingsSharp />
                      </ListItemIcon>
                      Settings
                    </MenuItem>
                    <MenuItem className="logout"
                      onClick={() => logout()}>
                      <ListItemIcon>
                        <LockOutlineIcon fontSize="small" />
                      </ListItemIcon>
                      Logout
                    </MenuItem>
                  </Menu>
                </div>
              {/* )} */}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;

