import React from "react";
import { addUser } from "../adminAPI.js";
import moment from "moment-timezone";

const AddDoctor = () => {
  const data = async () => {
    let formEl = document.forms.form;
    let formData = new FormData(formEl);
    let schForm = document.forms.schForm;
    let schFormData = new FormData(schForm);
    let schedule = [];
    let schObj = [];

    schFormData.forEach((value, key) => {
      let obj = {};
      obj[key] = value;
      schObj.push(obj);
    });

    for (let i = 0; i < schObj.length; i += 4) {
      const three = [
        schObj[i],
        { time: { ...schObj[i + 1], ...schObj[i + 2] } },
        schObj[i+3]
      ];
      schedule.push(Object.assign({}, ...three));
    }
    console.log(schedule);
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
        doctorInfo: {
          city: formData.get("city"),
          birthDate: bd,
          speciality: formData.get("speciality"),
          bio: formData.get("bio"),
          fees: formData.get("fees"),
          room: formData.get("room"),
          schedule: schedule,
        },
        name: formData.get("name"),
        password: formData.get("password"),
        role: "doctor",
      },
    };

    let add = await addUser(body);
    if (add.message == "doctor added") {
      if (window.confirm("Patient Added Successfully")) {
        window.location.reload();
      }
    } else {
      alert("Wrong Data");
    }
  };

  let addSch = () => {
    let schCard = document.getElementById("schedule").outerHTML;
    let schBtn = document.getElementById("schBtn");
    schBtn.insertAdjacentHTML("beforebegin", `${schCard}`);
  };
  return (
    <div className="main-content">
      <div className="container-fluid">
        <div className="section">
          <h5 className="page-title">Add Doctor</h5>
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
                          <label>Speciality</label>
                          <input className="form-control" name="speciality" />
                        </div>
                        <div className="form-group col-sm-8">
                          <label>Bioghraphy</label>
                          <textarea
                            className="form-control "
                            rows="3"
                            maxlength="150"
                            name="bio"
                          />
                        </div>
                        <div className="form-group col-sm-3 ">
                          <label>Fees</label>
                          <div className="input-group">
                            <input
                              type="text"
                              class="form-control"
                              name="fees"
                            />
                            <div class="input-group-append">
                              <span class="input-group-text" id="basic-addon2">
                                LE
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="form-group col-sm-2">
                          <label>Room</label>
                          <input className="form-control" name="room" />
                        </div>
                        <div className="form">
                          <div className="form-group col-sm-8 card">
                            <label>Schedule</label>
                            <form id="schForm" method="post">
                              <div
                                id="schedule"
                                name="schedule"
                                className="form-row"
                              >
                                <div className="form-group col-sm-5">
                                  <label>day</label>
                                  <input className="form-control" name="day" />
                                </div>
                                <div className="form-group col-sm-3">
                                  <label>From</label>
                                  <input
                                    className="form-control"
                                    placeholder="17:00"
                                    name="from"
                                  />
                                </div>
                                <div className="form-group col-sm-3">
                                  <label>To</label>
                                  <input
                                    className="form-control"
                                    placeholder="19:00"
                                    name="to"
                                  />
                                </div>
                                <div className="form-group col-sm-3">
                                  <label>Limit</label>
                                  <input
                                    className="form-control"
                                    placeholder="10"
                                    name="limit"
                                  />
                                </div>
                              </div>
                              <button
                                id="schBtn"
                                className="btn btn-dark-f-gr mt-4"
                                type="button"
                                onClick={() => {
                                  addSch();
                                }}
                              >
                                <i className="las la-plus" />
                                Add
                              </button>
                            </form>
                          </div>
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

                      <button
                        className="btn btn-dark-red-f-gr mt-4 "
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

export default AddDoctor;
