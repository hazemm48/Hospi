import React from "react";
import moment from "moment-timezone";
import { addUser } from "../adminAPI.js";

const AddPatient = () => {
  const data = async () => {
    let formEl = document.forms.form;
    console.log(formEl);
    let formData = new FormData(formEl);
    let bd = moment(
      formData.get("day") +
        "/" +
        formData.get("month") +
        "/" +
        formData.get("year")
    )
      .tz("GMT+2")
      .format("MM-DD-YYYY");
    let body = {
      details: {
        email: formData.get("email"),
        gender: formData.get("gender"),
        phone: formData.get("phone"),
        patientInfo: {
          city: formData.get("city"),
          address: formData.get("address"),
          birthDate: bd,
        },
        name: formData.get("name"),
        password: formData.get("password"),
        role: "patient",
      },
    };

    let add = await addUser(body);
    if (add.message == "patient added") {
      if (window.confirm("Patient Added Successfully")) {
        window.location.reload();
      }
    } else {
      alert("Wrong Data");
    }
  };

  return (
    <div className="main-content">
      <div className="container-fluid">
        <div className="section">
          <h5 className="page-title">Add Patient</h5>
        </div>
        <div className="section profile-section">
          <div className="card container">
            <div className="card-body">
              <div className="sub-section col-sm-8 col-md-12 col-lg-8">
                <div className="sub-section-body">
                  <div className="user-password-form">
                    <form id="form" method="post">
                      <div className="form">
                        <div className="form-group col-sm-8">
                          <label>Name</label>
                          <input className="form-control" name="name" />
                        </div>
                        <div className="form-group col-sm-8">
                          <label>Email</label>
                          <input className="form-control" name="email" />
                        </div>
                        <div className="form-group col-sm-8">
                          <label>Password</label>
                          <input
                            className="form-control"
                            type="password"
                            name="password"
                          />
                        </div>
                        <div className="form-group col-sm-8">
                          <label>City</label>
                          <input className="form-control" name="city" />
                        </div>
                        <div className="form-group col-sm-8">
                          <label>Address</label>
                          <input className="form-control" name="address" />
                        </div>
                        <div className="form-group col-sm-6">
                          <label>Birthday</label>
                          <div className="form-row">
                            <div className="form-group col-sm-3">
                              <label>Day</label>
                              <input
                                className="form-control"
                                maxLength="2"
                                name="day"
                              />
                            </div>
                            <div className="form-group col-sm-3">
                              <label>Month</label>
                              <input
                                className="form-control"
                                maxLength="2"
                                name="month"
                              />
                            </div>
                            <div className="form-group col-sm-3">
                              <label>Year</label>
                              <input
                                className="form-control"
                                maxLength="4"
                                name="year"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="form-group col-sm-8">
                          <label>Phone Number</label>
                          <input className="form-control" name="phone" />
                        </div>
                        <div className="form-group col-sm-2">
                          <label>Gender</label>
                          <select
                            className="form-control form-select dropdown-toggle"
                            name="gender"
                          >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                          </select>
                        </div>
                      </div>
                    </form>
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

export default AddPatient;
