import React, { useEffect, useState } from "react";
import { addUser, getGeneral, rooms, uploadFile } from "../../adminAPI.js";
import moment from "moment-timezone";
import Schedule from "../../components/Schedule.js";
import manImg from "../../images/man.svg";
import LoadingSpinner from "../../components/Loading.js";
import { useNavigate } from "react-router-dom";

const AddDoctor = () => {
  const [specialities, setSpecialities] = useState();
  const [scheduleNo, setScheduleNo] = useState(1);
  const [htmlData, setHtmlData] = useState();
  const [roomList, setRoomList] = useState();
  const [loading, setLoading] = useState(false);

  let navigate = useNavigate();

  let createHtmlData = (state) => {
    setHtmlData([
      ["Name", "name", "text"],
      ["Email", "email", "email"],
      ["Password", "password", "password"],
      ["City", "city", "text"],
      ["Birthday", "date", "date"],
      ["Phone Number", "phone", "number"],
    ]);
  };

  const data = async () => {
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

    for (let i = 0; i < schObj.length; i += 4) {
      const three = [
        schObj[i],
        { time: { ...schObj[i + 1], ...schObj[i + 2] } },
        schObj[i + 3],
      ];
      schedule.push(Object.assign({}, ...three));
    }
    let bd = moment(formData.get("date")).format("MM-DD-YYYY");
    let roomId = document.getElementById("room");
    let body = {
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
        roomId: roomId.options[roomId.selectedIndex].getAttribute("roomId"),
        schedule: schedule,
      },
      password: formData.get("password"),
      role: "doctor",
    };
    let file = formData.get("profile");
    console.log(body);

    let add = await addUser(body);
    console.log(add);
    alert(add.message);
    if (add.message == "doctor added") {
      await addProfilePic(file, add.added[0]._id);
      navigate("/home/doctorDetails", { state: add.added._id });
    } else {
      setLoading(false);
    }
  };

  let addProfilePic = async (file, id) => {
    let formData = new FormData();
    formData.append("fieldName", "users");
    formData.append("id", id);
    formData.append("image", file);

    let test = await uploadFile(formData, "uploadProfilePic");
    console.log(test);
  };

  const GetSpecialities = async () => {
    let body = {
      filter: "specialities",
    };
    let general = await getGeneral(body);
    delete general.data[0].specialities[0];
    setSpecialities(general.data[0].specialities);
  };
  const GetRoom = async () => {
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

  useEffect(() => {
    GetSpecialities();
    GetRoom();
    createHtmlData();
  }, []);
  return (
    <div className="main-content">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="container-fluid">
          <div className="section">
            <h5 className="page-title">Add Doctor</h5>
          </div>
          <div className="section profile-section">
            <div className="card container">
              <div className="col-md-3">
                <div className="card-header">
                  <img className="rounded-circle" src={manImg} loading="lazy" />
                </div>
              </div>
              <div className="card-body">
                <div className="sub-section col-sm-8 col-md-12 col-lg-8">
                  <div className="sub-section-body">
                    <div className="user-password-form">
                      <form id="form" className="needs-validation">
                        <div className="form">
                          <div className="form-group col-sm-8">
                            <label>Profile Picture</label>
                            <input
                              className="form-control"
                              name="profile"
                              type="file"
                              accept="image/*"
                              required
                            />
                          </div>
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
                          <div className="form-group col-sm-5">
                            <label>room</label>
                            <select
                              className="form-control form-select dropdown-toggle"
                              name="room"
                              id="room"
                              required
                            >
                              {roomList?.map((e) => {
                                return (
                                  <option value={e.name} roomId={e._id}>
                                    {e.name}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
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
                          <div className="form-group col-sm-5">
                            <label>speciality</label>
                            <select
                              className="form-control form-select dropdown-toggle"
                              name="speciality"
                              required
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
                              required
                            />
                          </div>
                          {[
                            ["Examination Fees", "examinFees"],
                            ["Follow Up Fees", "followUpFees"],
                          ].map((e) => {
                            return (
                              <div className="form-group col-sm-3 ">
                                <label>{e[0]}</label>
                                <div className="input-group">
                                  <input
                                    type="number"
                                    class="form-control"
                                    name={e[1]}
                                    required
                                  />
                                  <div class="input-group-append">
                                    <span
                                      class="input-group-text"
                                      id="basic-addon2"
                                    >
                                      LE
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                          <div className="form">
                            <div className="form-group col-sm-8 card">
                              <label>Schedule</label>
                              <form id="schForm" method="post">
                                {[...Array(scheduleNo)].map((e, i) => {
                                  return <Schedule key={i} />;
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
                        </div>

                        <button
                          className="btn btn-dark-red-f-gr mt-4 "
                          type="button"
                          onClick={() => {
                            setLoading(true);
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
      )}
    </div>
  );
};

export default AddDoctor;
