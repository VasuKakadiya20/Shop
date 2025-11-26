import React, { useContext, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./login.css";
import login from "../../img/login.png"
import { mycontext } from "../../App";
import google from "../../img/google.png"
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import { postData } from "../../api";

export default function Login() {
  const context = useContext(mycontext)
  const [fromdata, setfromdata] = useState({
    email: "",
    password: ""
  })
  useEffect(() => {
    context.setIsHideSidebarAndHeader(true)
  }, [])

  const handleChange = (e) => {
    setfromdata({
      ...fromdata,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      Email: fromdata.email,
      password: fromdata.password,
    };

    try {
      const res = await postData("/login/loginuser", payload);
      toast.success("login successfully!");
      console.log(res);
      localStorage.setItem("islogin", true);
      localStorage.setItem("username", res.user.username);
      localStorage.setItem("email", res.user.Email);
      context.setislogin(true)
    } catch (err) {
      toast.error("Invaild Password and Email!");
      console.log(err);
    }
    setfromdata({
      email: "",
      password: ""
    });
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} theme="colored" />
      <div className="login-container d-flex justify-content-center align-items-center">
        <div className="login-card shadow-lg d-flex">
          <form className="left-side p-5" onSubmit={handleSubmit}>
            <h2 className="fw-bold">Welcome back</h2>
            <p className="text-muted">Please enter your details</p>

            <label className="mt-3 mb-1">Email</label>
            <input
              type="text"
              name="email"
              className="form-control input-box"
              placeholder="Enter Your User email"
              value={fromdata.email}
              onChange={handleChange}
            />

            <label className="mt-3 mb-1">Password</label>
            <input
              type="password"
              name="password"
              className="form-control input-box"
              placeholder="Enter Your Password"
              value={fromdata.password}
              onChange={handleChange}
            />

            <button className="btn btn-primary w-100 mt-4" >Sign in</button>

            <button className="btn google-btn w-100 mt-3 d-flex align-items-center justify-content-center">
              <img
                src={google}
                alt="google"
                className="google-icon"
              />
              <span className="ms-2">Sign in with Google</span>
            </button>

            <p className="text-center mt-4">
              Don’t have an account? <Link to="/singup">Sign up</Link>
            </p>
          </form>

          <div className="right-side d-flex justify-content-center align-items-center">
            <img
              src={login}
              className="login-image"
              alt="illustration"
            />
          </div>
        </div>
      </div>
    </>
  );
}
