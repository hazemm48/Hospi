import moment from "moment";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link, useLocation } from "react-router-dom";
import { reserve, users } from "../../adminAPI.js";
import LoadingSpinner from "../../components/Loading.js";
import maleImg from "../../images/male.jpg";
import femaleImg from "../../images/female.jpg";

const CreateReserve = ({ role }) => {
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState();
  const [startDate, setStartDate] = useState();
  const [scheduleDay, setScheduleDay] = useState();
  const [fees, setFees] = useState("examin");

  const { state } = useLocation();

  const isWeekday = (date) => {
    const day = date.getDay(date);
    let weekDay = document.getElementById("day").value;
    let weekDayIndex = weekDay.charAt(0).toUpperCase() + weekDay.slice(1);
    return day == moment.weekdays().indexOf(weekDayIndex);
  };

  const GetDetails = async () => {
    console.log(state);
    let body = {
      filter: {
        _id: state.id,
      },
    };
    let user = await users(body);
    console.log(user);
    setUserDetails(user.users[0]);
    console.log(user.users);
    setScheduleDay(0);
  };
  useEffect(() => {
    GetDetails();
  }, []);

  const feesChange = (e) => {
    let vtIndex = e.target.selectedIndex;
    let vt = e.target.options[vtIndex].getAttribute("data");
    setFees(vt);
  };

  const submit = async () => {
    let formEl = document.forms.form;
    let formData = new FormData(formEl);
    let data = {};
    for (const pair of formData.entries()) {
      data[pair[0]] = pair[1];
    }
    data.type = state.type;
    data.doctorId = userDetails._id;
    data.docName = userDetails.name;
    data.anotherPerson = JSON.parse(data.anotherPerson);
    data.speciality = userDetails.doctorInfo?.speciality;
    let filter = {};
    data.email && role == "admin" && (filter.email = data.email);
    data.phone && role == "admin" && (filter.phone = data.phone);
    if (filter) {
      let user = await users(filter);
      if (user.users.length > 0) {
        data.patientId = user.users[0]._id;
      }
    }

    let body = {
      oper: "reserve",
      data,
    };
    let reserveData = await reserve(body);

    if (reserveData.message == "booked") {
      alert(reserveData.message + `\nTurn : ${reserveData.add[0].turnNum}`);
    } else {
      alert(reserveData.message);
    }
    setLoading(false);
    console.log(reserveData);
  };

  let time = () => {
    let time = userDetails?.doctorInfo?.schedule[scheduleDay].time;
    let timeCon = `${time.from} - ${time.to}`;
    return timeCon;
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        userDetails?.doctorInfo && (
          <div className="main-content">
            <div className="container-fluid">
              <div className="section patient-details-section">
                <div className="card ">
                  <h3>{state.type} Reserve</h3>
                  <div className="">
                    <div className="col ">
                      <div className="mini-card text-center">
                        <div className="card-header">
                          <img
                            className="rounded-circle"
                            src={
                              userDetails.image
                                ? userDetails.image
                                : userDetails.gender == "male"
                                ? maleImg
                                : femaleImg
                            }
                            loading="lazy"
                          />
                        </div>
                        <div
                          className="card-body row"
                          style={{ justifyContent: "center" }}
                        >
                          <h3>{userDetails.name}</h3>
                          <h4>{userDetails.doctorInfo.speciality}</h4>
                          {role == "admin" ? (
                            <div className="d-flex justify-content-center ">
                              <Link
                                to="/admin/doctorDetails"
                                state={userDetails._id}
                                className="btn btn-dark-red-f-gr col-md-2"
                                style={{
                                  margin: "0.3em",
                                }}
                                onClick={(e) => {}}
                              >
                                <i className="las la-edit" />
                                doctor details
                              </Link>
                            </div>
                          ) : (
                            <h6 style={{ color: "grey" }}>
                              {userDetails.doctorInfo?.bio}
                            </h6>
                          )}
                        </div>
                      </div>
                    </div>

                    <div
                      id="editDet"
                      className="col d-flex justify-content-center res"
                    >
                      <form id="form" method="post">
                        <div className="mini-card">
                          <div className="card-body">
                            <div className="row justify-content-center">
                              <div className="col-md-4">
                                <div className="form-group">
                                  <label>patient name</label>
                                  <input
                                    name="patName"
                                    className="form-control"
                                    required
                                  />
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="form-group">
                                  <label>visit type</label>
                                  <select
                                    className="selectpicker form-control form-select dropdown-toggle"
                                    name="visitType"
                                    id="vt"
                                    required
                                    data-live-search="true"
                                    onChange={(e) => {
                                      feesChange(e);
                                    }}
                                  >
                                    <option
                                      selected
                                      value="examination"
                                      data="examin"
                                    >
                                      Examination
                                    </option>
                                    <option value="follow up" data="followUp">
                                      Follow Up
                                    </option>
                                  </select>
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="form-group">
                                  <label>fees</label>
                                  <input
                                    value={userDetails?.doctorInfo?.fees[fees]}
                                    name="fees"
                                    id="fees"
                                    readOnly={role == "admin" ? false : true}
                                    className="form-control"
                                    required
                                  />
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="form-group">
                                  <label>day</label>
                                  <select
                                    className="form-control form-select dropdown-toggle"
                                    id="day"
                                    name="day"
                                    required
                                    onChange={(e) => {
                                      setScheduleDay(e.target.selectedIndex);
                                      setStartDate();
                                    }}
                                  >
                                    {userDetails?.doctorInfo?.schedule.map(
                                      (e) => {
                                        return (
                                          <option value={e.day}>{e.day}</option>
                                        );
                                      }
                                    )}
                                  </select>
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="form-group">
                                  <label>date</label>
                                  <DatePicker
                                    placeholderText="choose date"
                                    minDate={new Date()}
                                    filterDate={isWeekday}
                                    dateFormat="dd-MM-yyyy"
                                    className="form-control"
                                    selected={startDate}
                                    onChange={(date) => setStartDate(date)}
                                    required
                                    name="date"
                                  />
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="form-group">
                                  <label>time</label>
                                  <input
                                    className="form-control"
                                    value={time()}
                                    disabled
                                    required
                                  />
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="form-group">
                                  <label>another person</label>
                                  <select
                                    className="form-control form-select dropdown-toggle"
                                    name="anotherPerson"
                                    required
                                  >
                                    <option value={false}>no</option>
                                    <option value={true}>yes</option>
                                  </select>
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="form-group">
                                  <label>phone</label>
                                  <input
                                    name="phone"
                                    className="form-control"
                                    required
                                  />
                                </div>
                              </div>
                              {role == "admin" && (
                                <>
                                  <div className="col-md-4">
                                    <div className="form-group">
                                      <label>email</label>
                                      <input
                                        name="email"
                                        className="form-control"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-4">
                                    <div className="form-group">
                                      <label>patient id</label>
                                      <input
                                        name="patientId"
                                        className="form-control"
                                      />
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                            <div className="card-footer">
                              <div className="d-flex justify-content-center">
                                <button
                                  id="submit"
                                  type="button"
                                  className="btn btn-dark-red-f-gr col-md-2"
                                  onClick={(e) => {
                                    setLoading(true);
                                    submit();
                                  }}
                                >
                                  Submit
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </>
  );
};

export default CreateReserve;
