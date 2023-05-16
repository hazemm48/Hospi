import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";
import { addUser, getGeneral } from "../adminAPI.js";
import moment from "moment-timezone";
import Schedule from "../components/Schedule.js";

const AddDoctor = () => {
  const [specialities, setSpecialities] = useState();
  const [scheduleNo, setScheduleNo] = useState(1);

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
        schObj[i + 3],
      ];
      schedule.push(Object.assign({}, ...three));
    }
    console.log(schedule);
    let bd = moment(formData.get("date")).format("MM-DD-YYYY");
    let body = {
      details: {
        name: formData.get("name"),
        email: formData.get("email"),
        gender: formData.get("gender"),
        phone: formData.get("phone"),
        doctorInfo: {
          city: formData.get("city"),
          birthDate: bd,
          speciality: formData.get("speciality"),
          bio: formData.get("bio"),
          fees: {
            examin: formData.get("examinFees"),
            followUp: formData.get("followUpFees"),
          },
          room: formData.get("room"),
          schedule: schedule,
        },
        password: formData.get("password"),
        role: "doctor",
      },
    };

    let add = await addUser(body);
    console.log(add);
    if (add.message == "doctor added") {
      if (window.confirm("Doctor Added Successfully")) {
        window.location.reload();
      }
    } else {
      alert("Wrong Data");
    }
  };
  const GetSpecialities = async () => {
    let body = {
      filter: "specialities",
    };
    let general = await getGeneral(body);
    delete general.data[0].specialities[0];
    setSpecialities(general.data[0].specialities);
  };
  useEffect(() => {
    GetSpecialities();
  }, []);
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
                        <div className="form-group col-sm-5">
                          <label>speciality</label>
                          <select
                            className="form-control form-select dropdown-toggle"
                            name="speciality"
                          >
                            {specialities?.map((e) => {
                              return <option value={e}>{e}</option>;
                            })}
                          </select>
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
                          <label>Examination Fees</label>
                          <div className="input-group">
                            <input
                              type="number"
                              class="form-control"
                              name="examinFees"
                            />
                            <div class="input-group-append">
                              <span class="input-group-text" id="basic-addon2">
                                LE
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="form-group col-sm-3 ">
                          <label>Follow Up Fees</label>
                          <div className="input-group">
                            <input
                              type="number"
                              class="form-control"
                              name="followUpFees"
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
                              {[...Array(scheduleNo)].map((e, i) => {
                                return (
                                  <Schedule
                                    key={i}
                                  />
                                );
                              })}

                              <button
                                id="schBtn"
                                className="btn btn-dark-f-gr mt-4"
                                type="button"
                                onClick={() => {
                                  setScheduleNo(scheduleNo + 1);
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
                            <div className="form-group col-sm-6">
                              <input
                                type="date"
                                className="form-control"
                                name="date"
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
