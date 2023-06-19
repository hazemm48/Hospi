import moment from "moment-timezone";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  updateUser,
  users,
  deleteUser,
  rooms,
  resetPassword,
  categoriesApi,
} from "../../adminAPI.js";
import DetailsBottom from "../../components/DetailsBottom.js";
import DetailsHeader from "../../components/DetailsHeader.js";
import DetailsLeftSection from "../../components/DetailsLeftSection.js";
import DoctorScheduleCard from "../../components/DoctorScheduleCard.js";
import FilesCard from "../../components/FilesCard.js";
import LoadingSpinner from "../../components/Loading.js";
import NotesCard from "../../components/NotesCard.js";
import Schedule from "../../components/Schedule.js";
import Calendar from "../Calender.js";

const DoctorDetails = ({ role, userId, superAdmin }) => {
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState();
  const [htmlData, setHtmlData] = useState([]);
  const [bottomBtns, setBottomBtns] = useState([]);
  const [specialities, setSpecialities] = useState();
  const [calView, setCalView] = useState(false);
  const [roomList, setRoomList] = useState([]);

  const id = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    !id.state && (id.state = userId);
  }, []);

  let createHtmlData = (state) => {
    setHtmlData([
      ["gender", state.gender, "gender"],
      ["phone", state.phone, "phone number"],
      ["examin", state.doctorInfo.fees.examin, "examination fees"],
      ["followUp", state.doctorInfo.fees.followUp, "follow up fees"],
      ["city", state.doctorInfo.city, "city"],
      [
        "birthDate",
        moment(state.doctorInfo.birthDate).format("DD-MM-YYYY"),
        "date of birth",
      ],
      ["sta", state.isLoggedIn ? "Online" : "Offline", "member status"],
      [
        "reg",
        moment(state.createdAt).local().format("DD/MM/YYYY"),
        "registered date",
      ],
    ]);
    let arr = [
      [
        "-dark",
        () => {
          setCalView(true);
        },
        "view calendar",
        "la-calendar-day",
      ],
      [
        "-dark",
        () => {
          navigate("/admin/addReserve", {
            state: { id: state._id, type: "doctor" },
          });
        },
        "Reserve Doctor",
        "la-stethoscope",
      ],
      [
        "",
        () => {
          resetPass();
        },
        "reset password",
        "la-lock",
      ],
    ];
    superAdmin &&
      arr.push([
        "",
        () => {
          userDelete();
        },
        "delete user",
        "la-trash",
      ]);
    setBottomBtns(arr);
  };

  const GetDetails = async () => {
    console.log(id);
    let body = {
      filter: {
        _id: id.state,
      },
    };
    let user = await users(body);
    console.log(user);
    setState(user.users[0]);
    createHtmlData(user.users[0]);
    setLoading(false);
  };

  const GetSpecialities = async () => {
    let body = {
      filter: {
        type: "speciality",
      },
    };
    let { message, results } = await categoriesApi(body, "POST", "get");
    results = results.map((e) => {
      return e.name;
    });
    setSpecialities(results);
  };

  const GetRooms = async () => {
    let body = {
      filter: { type: "consult" },
      select: "name",
    };
    let room = await rooms(body, "POST", "get");
    setRoomList(
      room.room.sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      })
    );
  };

  const userDelete = async () => {
    let body = {
      id: id.state,
    };
    if (window.confirm("Are you sure you want to delete this user")) {
      let deleted = await deleteUser(body);
      alert(deleted.message);
      if (deleted.message == "user deleted") {
        navigate("/admin/doctors");
      }
    }
  };

  const resetPass = async () => {
    if (window.confirm("Are you sure you want to reset user password")) {
      let body = {
        id: state._id,
      };
      let reset = await resetPassword(body);
      alert(reset.message);
      console.log(reset);
    }
  };

  useEffect(() => {
    setLoading(true);
    GetDetails();
    GetSpecialities();
    GetRooms();
  }, []);

  const updateUserDetails = async () => {
    let formEl = document.forms.form;
    let formData = new FormData(formEl);
    let schForm = document.forms.schForm;
    let schFormData = new FormData(schForm);
    let schedule = [];
    let schObj = [];

    schFormData.forEach((value, key) => {
      let obj = {};
      if (["from", "to"].includes(key)) {
        value = moment(value, "h:mm A").format("HH:mm");
      }
      obj[key] = value;
      schObj.push(obj);
    });
    console.log(schObj);
    for (let i = 0; i < schObj.length; i += 4) {
      const three = [
        schObj[i],
        { time: { ...schObj[i + 1], ...schObj[i + 2] } },
        schObj[i + 3],
      ];
      schedule.push(Object.assign({}, ...three));
    }

    let details = {
      doctorInfo: {
        fees: {},
      },
    };
    for (const pair of formData.entries()) {
      if (!["email", "gender", "phone"].includes(pair[0])) {
        if (["examin", "followUp"].includes(pair[0])) {
          details.doctorInfo.fees[pair[0]] = pair[1];
        } else {
          details.doctorInfo[pair[0]] = pair[1];
        }
      } else {
        details[pair[0]] = pair[1];
      }
    }
    details.name = document.getElementById("name").value;
    details.doctorInfo.schedule = schedule;
    console.log(details.doctorInfo.birthDate);
    details.doctorInfo.birthDate = moment(
      details.doctorInfo.birthDate,
      "DD-MM-YYYY"
    ).format("MM-DD-YYYY");
    let currentRoom = document.getElementById("room");
    details.doctorInfo.room=currentRoom.options[currentRoom.selectedIndex].innerHTML
    let body = {
      details,
      id: state._id,
    };
    console.log(body);
    if (
      !(
        currentRoom.options[currentRoom.selectedIndex].innerHTML ==
        state.doctorInfo.room
      )
    ) {
      for (let i = 0; i < currentRoom.length; i++) {
        console.log(currentRoom.options[i].value);
        if (currentRoom.options[i].innerHTML == state.doctorInfo.room) {
          body.oldRoom = currentRoom.options[i].value;
          body.roomId = currentRoom.options[currentRoom.selectedIndex].value;
        }
      }
    }
    let update = await updateUser(body);
    alert(update.message);
    if (update.message == "update success") {
    }
  };

  return (
    <div className="main-content">
      <div className="container-fluid">
        {loading ? (
          <LoadingSpinner />
        ) : calView ? (
          <Calendar filter={{ doctorId: id.state }} role={role} />
        ) : (
          state && (
            <>
              <DetailsHeader
                role={role}
                superAdmin={superAdmin}
                name={state.name}
                type={"doctor"}
                updateUserDetails={updateUserDetails}
              />
              <div className="section patient-details-section">
                <div className="row">
                  <div className="col-md-8">
                    <div className="row">
                      <div id="userDet" className="col-sm-12">
                        <div className="card">
                          <div className="row">
                            <DetailsLeftSection
                              data={state}
                              role={role}
                              superAdmin={superAdmin}
                              type={"doctor"}
                              GetDetails={GetDetails}
                              setLoading={setLoading}
                            />

                            <div
                              id="editDet"
                              className="col-md-8 doctors-details-card-wrapper"
                            >
                              <form id="form">
                                <div className="mini-card">
                                  <div className="card-body">
                                    <div className="row">
                                      {[
                                        ["speciality", specialities],
                                        ["room", roomList],
                                      ].map((e) => {
                                        return (
                                          <div className="col-md-4">
                                            <div className="form-group">
                                              <label>{e[0]}</label>
                                              <select
                                                className="form-control form-select dropdown-toggle"
                                                name={e[0]}
                                                id={e[0]}
                                                disabled
                                                required
                                              >
                                                {e[1]?.map((o) => {
                                                  let d = "";
                                                  if (e[0] == "room") {
                                                    d = o._id;
                                                    o = o.name;
                                                  } else {
                                                    d = o;
                                                  }
                                                  if (
                                                    o == state.doctorInfo[e[0]]
                                                  ) {
                                                    return (
                                                      <option
                                                        value={d}
                                                        selected
                                                      >
                                                        {o}
                                                      </option>
                                                    );
                                                  } else {
                                                    return (
                                                      <option value={d}>
                                                        {o}
                                                      </option>
                                                    );
                                                  }
                                                })}
                                              </select>
                                            </div>
                                          </div>
                                        );
                                      })}
                                      {htmlData.map((e) => {
                                        return (
                                          <div className="col-md-4">
                                            <div className="form-group">
                                              <label>{e[2]}</label>
                                              <input
                                                name={e[0]}
                                                className="form-control"
                                                disabled
                                                required
                                                defaultValue={e[1]}
                                              />
                                            </div>
                                          </div>
                                        );
                                      })}

                                      <div className="col-md-12">
                                        <div className="form-group">
                                          <label>email</label>
                                          <input
                                            name="email"
                                            className="form-control"
                                            disabled
                                            required
                                            defaultValue={state.email}
                                          />
                                        </div>
                                      </div>
                                      <div className="col-md-12">
                                        <div className="form-group">
                                          <label>bioghraphy</label>
                                          <textarea
                                            name="bio"
                                            className="form-control"
                                            rows={6}
                                            disabled
                                            required
                                            defaultValue={state.doctorInfo?.bio}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>
                      <DoctorScheduleCard user={state} />
                      <DetailsBottom arr={bottomBtns} />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <NotesCard id={state._id} role={role} />
                    <FilesCard
                      role={role}
                      files={state.files}
                      id={state._id}
                      fieldName={"users"}
                    />
                  </div>
                </div>
              </div>
            </>
          )
        )}
      </div>
    </div>
  );
};

export default DoctorDetails;
