import React, { useEffect, useState } from "react";
import moment from "moment-timezone";
import { addUser } from "../adminAPI.js";

const AddPatient = () => {
  let [htmlData, setHtmlData] = useState();

  let createHtmlData = (state) => {
    setHtmlData([
      ["Name", "name","text"],
      ["Email", "email","email"],
      ["Password", "password", "password"],
      ["City", "city","text"],
      ["Address", "address","text"],
      ["Birthday", "date", "date"],
      ["Phone Number", "phone", "number"],
    ]);
  };

  useEffect(()=>{
    createHtmlData()
  },[])

  const data = async () => {
    let formEl = document.forms.form;
    console.log(formEl);
    let formData = new FormData(formEl);
    let bd = moment(formData.get("date")).format("MM-DD-YYYY");
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
                        {htmlData?.map((e) => {
                          return (
                            <div className="form-group col-sm-8">
                              <label>{e[0]}</label>
                              <input
                                className="form-control"
                                name={e[1]}
                                type={e[2] ? e[2] : ""}
                                required
                              />
                            </div>
                          );
                        })}
                        <div className="form-group col-sm-2">
                          <label>Gender</label>
                          <select
                            className="form-control form-select dropdown-toggle"
                            name="gender"
                            required
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
