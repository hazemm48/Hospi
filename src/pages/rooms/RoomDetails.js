import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  rooms,
} from "../../adminAPI.js";
import LoadingSpinner from "../../components/Loading.js";

const RoomDetails = () => {
  const [loading, setLoading] = useState(true);
  const [roomList, setRoomList] = useState();
  let [htmlData, setHtmlData] = useState();

  let createHtmlData = (data) => {
    setHtmlData([
      ["Name", "name", "text", data.name],
      ["Level", "level", "number", data.level],
    ]);
  };

  const id = useLocation();
  const navigate = useNavigate();

  const GetRoom = async () => {
    let body = {
      filter: { _id: id.state },
    };
    let room = await rooms(body, "POST", "get");
    console.log(room);
    setRoomList(room.room[0]);
    setLoading(false);
    createHtmlData(room.room[0]);
  };

  const roomDelete = async () => {
    if (window.confirm("Are you sure you want to delete this room")) {
      let newRoom = window.prompt("type the new room id");
      if (!(newRoom.length < 24 || newRoom.length > 24)) {
        console.log(newRoom);
        let body = {
          room: document.getElementById("room").value,
          newRoomId: newRoom,
          oldRoomId: id.state,
        };
        let deleted = await rooms(body, "DELETE");
        alert(deleted.message);
        if (deleted.message == "deleted") {
          navigate("/home/rooms");
        }
        console.log(deleted);
      }
    }
  };

  useEffect(() => {
    GetRoom();
    setLoading(true);
  }, []);

  const editRoom = () => {
    let elements = document.forms.form.querySelectorAll("input,select");
    console.log(elements);
    let x = false;
    elements.forEach((e, i) => {
      if (e.hasAttribute("disabled")) {
        e.removeAttribute("disabled");
        document.getElementById("editPat").innerHTML = "submit";
        return (x = false);
      } else {
        return (x = true);
      }
    });
    x && updateRoom();
  };

  const updateRoom = async () => {
    let formEl = document.forms.form;
    let formData = new FormData(formEl);

    let body = {
      name: formData.get("name"),
      level: formData.get("level"),
      type: formData.get("type"),
      id: id.state,
    };
    console.log(body);
    let update = await rooms(body, "PUT");
    console.log(update);
    alert(update.message);
    if (update.message == "room updated") {
      window.location.reload();
    }
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="main-content">
          {roomList && (
            <div className="container-fluid">
              <div className="section row title-section">
                <div className="col-md-8">
                  <div aria-label="breadcrumb">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item">
                        <Link to="/home/rooms">
                          <a>rooms</a>
                        </Link>
                      </li>
                      <li
                        className="breadcrumb-item active"
                        aria-current="page"
                      >
                        {roomList._id}
                      </li>
                    </ol>
                  </div>
                </div>
                <div className="col-md-4">
                  <button
                    id="editPat"
                    className="btn btn-dark-red-f-gr"
                    onClick={() => {
                      editRoom();
                    }}
                  >
                    <i className="las la-edit" />
                    edit room
                  </button>
                </div>
              </div>
              <div className="section patient-details-section">
                <div className="row">
                  <div className="col-md-8">
                    <div className="row">
                      <div className="col-sm-12">
                        <div className="card container">
                          <div className="card-body">
                            <form id="form">
                              <div className="form">
                                {htmlData.map((e) => {
                                  return (
                                    <div className="col-md-12">
                                      <div className="form-group">
                                        <label>{e[0]}</label>
                                        <input
                                          name={e[1]}
                                          className="form-control"
                                          type={e[2]}
                                          disabled
                                          defaultValue={e[3]}
                                        />
                                      </div>
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
                                    disabled
                                  >
                                    {["consult", "operation"].map((e) => {
                                      if (e == roomList.type) {
                                        return (
                                          <option selected value={e}>
                                            {e}
                                          </option>
                                        );
                                      } else {
                                        return <option value={e}>{e}</option>;
                                      }
                                    })}
                                  </select>
                                </div>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                      {roomList.type == "consult" && (
                        <div className="col-md-12">
                          <div className="card files-card">
                            <div className="card-header">
                              <h5>current</h5>
                            </div>
                            <div className="card-body">
                              <div className="list-group list-group-flush">
                                <div className="row">
                                  {roomList.history?.map((e) => {
                                    return (
                                      <div className="col-sm-6">
                                        <div className="list-group-item ">
                                          <i className="las la-stethoscope" />
                                          <Link
                                            to={"/home/DoctorDetails"}
                                            state={e}
                                            className="view-more"
                                          >
                                            {e}
                                          </Link>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="col-sm-12">
                        <div className="card">
                          <button
                            className="btn btn-red-f-gr"
                            onClick={() => {
                              roomDelete();
                            }}
                          >
                            <i className="las la-trash" />
                            delete room
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {roomList.type == "consult" && (
                    <div className="col-md-4">
                      <div className="card files-card">
                        <div className="card-header">
                          <h5>history</h5>
                        </div>
                        <div className="card-body">
                          <div className="list-group list-group-flush">
                            {roomList.history?.map((e) => {
                              return (
                                <div className="list-group-item">
                                  <i className="las la-stethoscope" />
                                  <Link
                                    to={"/home/DoctorDetails"}
                                    state={e}
                                    className="view-more"
                                  >
                                    {e}
                                  </Link>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default RoomDetails;
