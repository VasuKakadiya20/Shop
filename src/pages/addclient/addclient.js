import "./addClient.css";
import { mycontext } from "../../App";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import React, { useContext, useEffect, useState } from "react";
import { postData } from "../../api";

const AddClient = () => {
  const context = useContext(mycontext);
   context.setislogin(true)
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    context.setIsHideSidebarAndHeader(false);
  }, []);

 const handleSubmit = async (e) => {
  e.preventDefault();

  const payload = {
    cname: form.name,
    Email: form.email,
    phonenumber: form.phone,
  };

  try {
    const res = await postData("/client/create", payload);
    toast.success("Client added successfully!");
    console.log(res);
  } catch (err) {
    toast.error("Error saving client");
    console.log(err);
  }

  setForm({
    name: "",
    phone: "",
    email: "",
  });
};


  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} theme="colored" />
      <div className="slideDown attendance mt-5">
        <div className="attendance-container mt-5">
          <div className="table-wrapper">
            {/* Header */}
            <div className="table-header">
              <span>Add Client</span>
            </div>

          {/* Add Client From */}
            <div className="add-employee-container">
              <h2 className="form-title">New Client</h2>

              <form className="employee-form" onSubmit={handleSubmit}>

                <div className="form-row">
                  <div className="form-group">
                    <label>Name*</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Enter client name"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone Number*</label>
                    <input
                      type="number"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Email*</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Enter email"
                      required
                    />
                  </div>
                  <div className="form-group"></div>
                </div>

                <button type="submit" className="submit-btn mt-3">
                  Submit
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default AddClient;
