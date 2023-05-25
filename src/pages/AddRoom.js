import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addUser, rooms } from "../adminAPI.js";

const AddRoom = () => {
  let [htmlData, setHtmlData] = useState([
    ["Name", "name", "text", 20],
    ["Level", "level", "number", 3],
  ]);

  const navigate = useNavigate();

  const data = async () => {
    let formEl = document.forms.form;
    let formData = new FormData(formEl);
    let body = {
      name: formData.get("name").toLowerCase(),
      level: formData.get("level"),
      type: formData.get("type"),
    };
    let add = await rooms(body, "POST");
    console.log(add);
    alert(add.message);

    if (add.message == "room added") {
      navigate("/home/roomDetails", { state: add.added[0]._id });
    }
  };
  return (
    <div className="main-content">
      <div className="container-fluid">
        <div className="section">
          <h5 className="page-title">Add Room</h5>
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
                        <div className="form-group col-sm-5">
                          <label>Type</label>
                          <select
                            className="form-control form-select dropdown-toggle"
                            name="type"
                            id="room"
                            required
                          >
                            {["consult", "operation"].map((e) => {
                              return <option value={e}>{e}</option>;
                            })}
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

export default AddRoom;
