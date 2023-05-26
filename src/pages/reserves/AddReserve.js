import moment from "moment";
import React, { useEffect, useLayoutEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { reserve, users } from "../../adminAPI.js";
import LoadingSpinner from "../../components/Loading.js";
import manImg from "../../images/man.svg";

const CreateReserve = () => {
  let navigate = useNavigate();
  const { state } = useLocation();
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState();
  const [startDate, setStartDate] = useState();
  const [scheduleDay, setScheduleDay] = useState();
  const [fees, setFees] = useState("examin");

  const isWeekday = (date) => {
    const day = date.getDay(date);
    let weekDay = document.getElementById("day").value;
    let weekDayIndex = weekDay.charAt(0).toUpperCase() + weekDay.slice(1);
    return day == moment.weekdays().indexOf(weekDayIndex);
  };

  const GetDetails = async (id) => {
    let body = {
      id: id,
    };
    let user = await users(body);
    setUserDetails(user.users);
    console.log(user.users);
    setScheduleDay(0);
  };
  useEffect(() => {
    GetDetails(state.id);
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
    data.time = userDetails.doctorInfo?.schedule[scheduleDay].time;
    data.type = state.type;
    data.doctorId = userDetails._id;
    data.docName = userDetails.name;
    data.anotherPerson = JSON.parse(data.anotherPerson);
    data.speciality = userDetails.doctorInfo?.speciality;
    if (data.email || data.phone) {
      let user = await users({ email: data.email, phone: data.phone });
      if (user.users.length > 0) {
        data.patientId = user.users[0]._id;
      }
    }
    let body = {
      oper: "reserve",
      data,
    };
    let reserveData = await reserve(body);
    reserveData.err
      ? alert(`ERROR: ${reserveData.err}`)
      : alert(reserveData.message + `\nTurn : ${reserveData.add[0].turnNum}`);
    console.log(reserveData);
  };

  let time = () => {
    let time = userDetails?.doctorInfo?.schedule[scheduleDay].time;
    let timeCon = `${time.from} - ${time.to}`;
    return timeCon;
  };

  return (
    <React.Fragment>
      {loading ? (
        <LoadingSpinner />
      ) : userDetails?.doctorInfo ? (
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
                          src={manImg}
                          loading="lazy"
                        />
                      </div>
                      <div
                        className="card-body row"
                        style={{ justifyContent: "center" }}
                      >
                        <h3>{userDetails.name}</h3>
                        <h4>{userDetails.doctorInfo.speciality}</h4>

                        <div className="d-flex justify-content-center ">
                          <Link
                            to="/home/doctorDetails"
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
                                <label>phone</label>
                                <input
                                  name="phone"
                                  className="form-control"
                                  required
                                />
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form-group">
                                <label>email</label>
                                <input name="email" className="form-control" />
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
                                <label>patient id</label>
                                <input
                                  name="patientId"
                                  className="form-control"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="card-footer">
                            <div className="d-flex justify-content-center">
                              <button
                                id="submit"
                                type="button"
                                className="btn btn-dark-red-f-gr col-md-2"
                                onClick={(e) => {
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
      ) : (
        ""
      )}
    </React.Fragment>
  );
};

export default CreateReserve;
