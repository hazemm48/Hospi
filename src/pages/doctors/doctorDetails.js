import moment from "moment-timezone";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  updateUser,
  users,
  getGeneral,
  deleteUser,
  removeFile,
  uploadFile,
} from "../../adminAPI.js";
import FilesCard from "../../components/FilesCard.js";
import LoadingSpinner from "../../components/Loading.js";
import NotesCard from "../../components/NotesCard.js";
import Schedule from "../../components/Schedule.js";
import manImg from "../../images/man.svg";
import Calendar from "../Calender.js";

const DoctorDetails = () => {
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState();
  const [htmlData, setHtmlData] = useState([]);
  const [specialities, setSpecialities] = useState();
  const [calView, setCalView] = useState(false);
  const [scheduleNo, setScheduleNo] = useState(0);

  const id = useLocation();
  const navigate = useNavigate();

  let createHtmlData = (state) => {
    setHtmlData([
      ["gender", state.gender, "gender"],
      ["phone", state.phone, "phone number"],
      ["room", state.doctorInfo.room, "room"],
      ["examinFees", state.doctorInfo.fees.examin, "examination fees"],
      ["followUpFees", state.doctorInfo.fees.followUp, "follow up fees"],
      ["city", state.doctorInfo.city, "city"],
      [
        "bd",
        moment(state.doctorInfo.birthDate).format("DD/MM/YYYY"),
        "date of birth",
      ],
      ["sta", state.isLoggedIn ? "Online" : "Offline", "member status"],
      [
        "reg",
        moment(state.createdAt).local().format("DD/MM/YYYY"),
        "registered date",
      ],
    ]);
  };

  const GetDetails = async () => {
    console.log(id);
    let body = {
      id: id.state,
    };
    let user = await users(body);
    console.log(user);
    setState(user.users);
    createHtmlData(user.users);
    setLoading(false);
  };

  const GetSpecialities = async () => {
    let body = {
      filter: "specialities",
    };
    let general = await getGeneral(body);
    delete general.data[0].specialities[0];
    setSpecialities(general.data[0].specialities);
  };

  const userDelete = async () => {
    let body = {
      id: id.state,
    };
    if (window.confirm("Are you sure you want to delete this user")) {
      let deleted = await deleteUser(body);
      alert(deleted.message);
      if (deleted.message == "user deleted") {
        navigate("/home/doctors");
      }
    }
  };

  useLayoutEffect(() => {
    setLoading(true);
    GetDetails();
    GetSpecialities();
  }, []);

  const editDoc = () => {
    let schDet = Array.from(
      document.querySelector("#schDet").querySelectorAll("input,select")
    );
    let docDet = Array.from(
      document
        .querySelector("#docDet")
        .querySelectorAll("input,textArea,select")
    );
    let elements = docDet.concat(schDet);
    let x = false;
    elements.forEach((e, i) => {
      if (!["sta", "reg"].includes(e.name)) {
        if (e.hasAttribute("disabled")) {
          e.removeAttribute("disabled");
          document.querySelectorAll("#delSchBtn").forEach((e) => {
            e.removeAttribute("hidden");
          });
          document.querySelector("#schBtn").removeAttribute("hidden");
          document.getElementById("editDoc").innerHTML = "submit";
          return (x = false);
        } else {
          return (x = true);
        }
      }
    });
    x && updateDoc();
  };

  const updateDoc = async () => {
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
    console.log(schedule);
    let body = {
      details: {
        name: document.getElementById("name").value,
        email: formData.get("email"),
        gender: formData.get("gender"),
        phone: formData.get("phone"),
        doctorInfo: {
          city: formData.get("city"),
          room: formData.get("room"),
          fees: {
            examin: formData.get("examinFees"),
            followUp: formData.get("followUpFees"),
          },
          bio: formData.get("bio"),
          birthDate: moment(formData.get("bd"), "DDMMYYYY").format(
            "MM-DD-YYYY"
          ),
          speciality: formData.get("speciality"),
          schedule: schedule,
        },
      },
      id: state._id,
    };
    console.log(body);
    let update = await updateUser(body);
    if (update.message == "update success") {
      if (window.confirm("Doctor Updated Successfully")) {
        window.location.reload();
      }
    } else {
      alert("Wrong Data");
    }
  };

  let addProfilePic = async (e) => {
    console.log(e.target.files);
    let formData = new FormData();
    formData.append("fieldName", "users");
    formData.append("id", state._id);
    formData.append("image", e.target.files[0]);

    let add = await uploadFile(formData, "uploadProfilePic");
    if (add.message == "done") {
      setLoading(true);
      GetDetails();
    }
    console.log(add);
  };

  const removeProfilePic = async () => {
    let body = {
      id: state._id,
      path: state.image,
    };
    let deleted = await removeFile(body, "removeProfilePic");
    if (deleted.message == "image deleted") {
      setLoading(true);
      GetDetails();
    }
  };

  return (
    <React.Fragment>
      {loading ? (
        <LoadingSpinner />
      ) : calView ? (
        <Calendar filter={{ doctorId: id.state }} />
      ) : (
        <div className="main-content">
          {state ? (
            <div className="container-fluid">
              <div className="section row title-section">
                <div className="col-md-8">
                  <div aria-label="breadcrumb">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item">
                        <Link to="/home/doctors">
                          <a>doctors</a>
                        </Link>
                      </li>
                      <li
                        className="breadcrumb-item active"
                        aria-current="page"
                      >
                        {state.name}
                      </li>
                    </ol>
                  </div>
                </div>
                <div className="col-md-4">
                  <button
                    id="editDoc"
                    className="btn btn-dark-red-f-gr"
                    onClick={() => {
                      editDoc();
                    }}
                  >
                    <i className="las la-edit" />
                    edit doctor
                  </button>
                </div>
              </div>
              <div className="section patient-details-section">
                <div className="row">
                  <div className="col-md-8">
                    <div className="row">
                      <div id="docDet" className="col-sm-12">
                        <div className="card">
                          <div className="row">
                            <div className="col-md-4">
                              <div className="mini-card text-center">
                                <div className="card-header">
                                  <img
                                    className="rounded-circle"
                                    src={state.image ? state.image : manImg}
                                    loading="lazy"
                                  />
                                </div>
                                <div className="card-body">
                                  <div className="">
                                    <button
                                      className="btn btn-red-f-gr btn-sm float-center"
                                      style={{ margin: "1em" }}
                                      onClick={() => {
                                        removeProfilePic();
                                      }}
                                    >
                                      <i className="las la-trash" />
                                      delete
                                    </button>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      id="imgupload"
                                      style={{ display: "none" }}
                                      onChange={(e) => {
                                        addProfilePic(e);
                                      }}
                                    />
                                    <button
                                      className="btn btn-dark-red-f btn-sm float-center"
                                      style={{ margin: "1em" }}
                                      onClick={() => {
                                        document
                                          .getElementById("imgupload")
                                          .click();
                                      }}
                                    >
                                      <i className="las la-image" />
                                      change
                                    </button>
                                  </div>
                                  <input
                                    name="name"
                                    id="name"
                                    className="form-control"
                                    defaultValue={state.name}
                                    disabled
                                    style={{ textAlign: "center" }}
                                  />

                                  <small className="text-muted">
                                    {state._id}
                                  </small>
                                  <h5>Age</h5>
                                  <p>
                                    {moment().diff(
                                      state?.doctorInfo?.birthDate,
                                      "years"
                                    )}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div
                              id="editDet"
                              className="col-md-8 doctors-details-card-wrapper"
                            >
                              <form id="form">
                                <div className="mini-card">
                                  <div className="card-body">
                                    <div className="row">
                                      <div className="col-md-4">
                                        <div className="form-group">
                                          <label>speciality</label>
                                          <select
                                            className="form-control form-select dropdown-toggle"
                                            name="speciality"
                                            disabled
                                            required
                                          >
                                            {specialities?.map((e) => {
                                              if (
                                                e ==
                                                state.doctorInfo?.speciality
                                              ) {
                                                return (
                                                  <option value={e} selected>
                                                    {e}
                                                  </option>
                                                );
                                              } else {
                                                return (
                                                  <option value={e}>{e}</option>
                                                );
                                              }
                                            })}
                                          </select>
                                        </div>
                                      </div>
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
                      <div id="schDet" className="col-sm-12">
                        <div className="card">
                          <form id="schForm">
                            <div className="mini-card">
                              <div className="card-body">
                                <div className="row">
                                  {state.doctorInfo?.schedule.map((e, i) => {
                                    return (
                                      <Schedule
                                        docDetails={true}
                                        key={i}
                                        schDetails={e}
                                        index={i}
                                      />
                                    );
                                  })}
                                  {[...Array(scheduleNo)].map((e, i) => {
                                    return <Schedule key={i} />;
                                  })}
                                </div>
                              </div>
                            </div>
                            <button
                              id="schBtn"
                              className="btn btn-dark-f-gr mt-4"
                              type="button"
                              hidden
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
                      <div className="col-sm-12">
                        <div className="card">
                          <button
                            className="btn btn-dark-red-f-gr"
                            onClick={() => {
                              setCalView(true);
                            }}
                          >
                            <i className="las la-calendar-day" />
                            View Calendar
                          </button>
                        </div>
                      </div>
                      <div className="col-sm-12">
                        <div className="card">
                          <button
                            className="btn btn-red-f-gr"
                            onClick={() => {
                              userDelete();
                            }}
                          >
                            <i className="las la-trash" />
                            delete user
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <NotesCard id={state._id} />
                    <FilesCard files={state.files} id={state._id} />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      )}
    </React.Fragment>
  );
};

export default DoctorDetails;
