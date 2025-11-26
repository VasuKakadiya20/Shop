import React, { useContext, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./login.css";
import login from "../../img/Singup1.png"
import { mycontext } from "../../App";
import google from "../../img/google.png"
import { toast, ToastContainer } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { postData } from "../../api";

function Singup() {
    const [fromdata, setformdata] = useState({
        name: "",
        email: "",
        password: "",
        cpassword: "",
    })
    const navigate = useNavigate()
    const context = useContext(mycontext)
    useEffect(() => {
        context.setIsHideSidebarAndHeader(true)
    }, [])

      const handleChange = (e) => {
    setformdata({
      ...fromdata,
      [e.target.name]: e.target.value,
    });
  };

     const handleSubmit = async (e) => {
      e.preventDefault();

      if(fromdata.password !== fromdata.cpassword){
         toast.success("password and Confirm password not match!");
      }else{
      const payload = {
        username: fromdata.name,
        Email: fromdata.email,
        password: fromdata.password,
      };
    
      try {
        const res = await postData("/login/create", payload);
        toast.success("Singup added successfully!");
        console.log(res);
        navigate("/login")
        //   context.setislogin(true)
      } catch (err) {
        toast.error("Error saving client");
        console.log(err);
      }
      setformdata({
         name: "",
        email: "",
        password: "",
        cpassword: "",
      });
      }
    };

    return (
        <>
            <ToastContainer position="top-right" autoClose={2000} theme="colored" />
            <div className="login-container d-flex justify-content-center align-items-center">
                <div className="login-card shadow-lg d-flex">
                    <div className="right-side d-flex justify-content-center align-items-center">
                        <img
                            src={login}
                            className="login-image"
                            alt="illustration"
                        />
                    </div>
                    <form className="left-side p-5" onSubmit={handleSubmit}>
                        <h2 className="fw-bold">Welcome back</h2>
                        <p className="text-muted">Please enter your details</p>

                        <label className="mt-3 mb-1">User Name</label>
                        <input
                            type="text"
                            name ="name"
                            className="form-control input-box"
                            placeholder="Enter Your User Name"
                            value={fromdata.name}
                             onChange={handleChange}
                             required
                        />

                        <label className="mt-3 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="form-control input-box"
                            placeholder="Enter Your Email"
                            value={fromdata.email}
                             onChange={handleChange}
                             required
                        />

                        <label className="mt-3 mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="form-control input-box"
                            placeholder="Enter Your Password"
                            value={fromdata.password}
                             onChange={handleChange}
                             required
                        />

                        <label className="mt-3 mb-1">Confirm Password</label>
                        <input
                            type="password"
                            name="cpassword"
                            className="form-control input-box"
                            placeholder="Enter Your Confirm-Password"
                            value={fromdata.cpassword}
                             onChange={handleChange}
                             required
                        />

                        <button className="btn btn-primary w-100 mt-4">Sign in</button>

                        <button className="btn google-btn w-100 mt-3 d-flex align-items-center justify-content-center">
                            <img
                                src={google}
                                alt="google"
                                className="google-icon"
                            />
                            <span className="ms-2">Sign in with Google</span>
                        </button>

                        <p className="text-center mt-4">
                            Already have an account ?<Link to="/login">Login</Link>
                        </p>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Singup
