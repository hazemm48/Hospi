import React, { useEffect, useState } from "react";
import { addUser } from "../adminAPI.js";
import FeedBack from "../components/FeedBack.js";

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
      details: {
        email: formData.get("email"),
        name: formData.get("name"),
        password: formData.get("password"),
        role: "admin",
      },
    };
    let add = await addUser(body);
    console.log(add);
    if (add.message == "admin added") {
      if (window.confirm("admin Added Successfully")) {
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
          <h5 className="page-title">Add Admin</h5>
        </div>
        <div className="section profile-section">
          <div className="card container">
            <div className="card-body">
              <div className="sub-section col-sm-8 col-md-12 col-lg-8">
                <div className="sub-section-body">
                  <div className="user-password-form">
                    <form id="form">
                      <div className="form-row">
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
