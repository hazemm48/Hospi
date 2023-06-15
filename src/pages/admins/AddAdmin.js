import React, { useEffect, useState } from "react";
import { addUser } from "../../adminAPI.js";
import FeedBack from "../../components/FeedBack.js";

const AddAdmin = () => {
  let [htmlData, setHtmlData] = useState();

  let createHtmlData = (state) => {
    setHtmlData([
      ["Name", "name", "text"],
      ["Email", "email", "email"],
      ["Password", "password", "password"],
    ]);
  };

  useEffect(() => {
    createHtmlData();
  }, []);

  const data = async () => {
    let formEl = document.forms.form;
    let formData = new FormData(formEl);
    let body = {
      email: formData.get("email"),
      name: formData.get("name"),
      password: formData.get("password"),
      gender: formData.get("gender"),
      role: "admin",
    };
    let {message} = await addUser(body);
    console.log(message);
    alert(message);
  };
  return (
    <div className="main-content">
      <div className="container-fluid">
        <div className="section">
          <h5 className="page-title">Add Admin</h5>
        </div>
        <div className="section profile-section">
          <div className="card container">
            <div className="card-body">
              <div className="sub-section col-sm-8 col-md-12 col-lg-8">
                <div className="sub-section-body">
                  <div className="user-password-form">
                    <form id="form">
                      <div className="form">
                        {htmlData?.map((e) => {
                          return (
                            <div className="form-group col-sm-8">
                              <label>{e[0]}</label>
                              <input
                                name={e[1]}
                                className="form-control"
                                type={e[2]}
                                required
                              />
                            </div>
                          );
                        })}
                        <div className="form-group col-sm-5">
                          <label>Gender</label>
                          <select
                            className="form-control form-select dropdown-toggle"
                            name="gender"
                            required
                          >
                            <option disabled selected>
                              -- choose gender --
                            </option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                          </select>
                        </div>
                      </div>
                      <button
                        className="btn btn-dark-red-f-gr mt-4"
                        type="button"
                        onClick={() => {
                          data();
                        }}
                      >
                        <i className="las la-save" />
                        submit
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAdmin;
