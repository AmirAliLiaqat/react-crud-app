import React, { useState } from "react";

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    profilePic: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, profilePic: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("confirmPassword", formData.confirmPassword);
    formDataToSend.append("profilePic", formData.profilePic);

    try {
      const response = await fetch("http://localhost:5000/api/user", {
        method: "POST",
        body: formDataToSend,
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="my-5"
      encType="multipart/form-data"
    >
      <div className="mb-3">
        <label htmlFor="name" className="form-label">
          Name
        </label>
        <input
          required
          type="text"
          className="form-control"
          id="name"
          name="name"
          placeholder="Enter your name"
          value={formData.name}
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          Email address
        </label>
        <input
          required
          type="email"
          className="form-control"
          id="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input
          required
          type="password"
          className="form-control"
          id="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="confirmPassword" className="form-label">
          Confirm Password
        </label>
        <input
          required
          type="password"
          className="form-control"
          id="confirmPassword"
          name="confirmPassword"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="profilePic" className="form-label">
          Profile Picture
        </label>
        <input
          required
          type="file"
          className="form-control"
          id="profilePic"
          name="profilePic"
          onChange={handleFileChange}
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Register
      </button>
    </form>
  );
};

export default RegistrationForm;
