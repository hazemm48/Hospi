import React, { useEffect, useState } from "react";
import maleImg from "../images/male.jpg";
import femaleImg from "../images/female.jpg";
import ChangePassword from "../components/ChangePassword.js";
import DoctorScheduleCard from "../components/DoctorScheduleCard.js";
import moment from "moment";

const DoctorSettings = ({ user }) => {
  const [htmlData, setHtmlData] = useState([]);

  let createHtmlData = () => {
    setHtmlData([
      ["speciality", user.doctorInfo.speciality, "speciality"],
      ["room", user.doctorInfo.room, "room"],
      ["gender", user.gender, "gender"],
      ["phone", user.phone, "phone number"],
      ["examin", user.doctorInfo.fees.examin, "examination fees"],
      ["followUp", user.doctorInfo.fees.followUp, "follow up fees"],
      ["city", user.doctorInfo.city, "city"],
      [
        "birthDate",
        moment(user.doctorInfo.birthDate).format("DD-MM-YYYY"),
        "date of birth",
      ],
    ]);
  };

  useEffect(() => {
    createHtmlData();
  }, []);

  return (
    <div className="main-content">
      <div className="container-fluid">
        <div className="section">
          <h5 className="page-title">settings</h5>
        </div>
        <div className="section profile-section">
          <div className="card container">
            <div className="card-header">
              <h5>personal details</h5>
            </div>
            <div className="card-body">
            <div className="row justify-content-center">
              <img
                className="rounded-circle"
                src={
                  user.image
                    ? user.image
                    : user.gender == "male"
                    ? maleImg
                    : femaleImg
                }
              />
              <div className="section patient-details-section">
                <div className="row">
                  <div
                    id="editDet"
                    className="col-md-12 doctors-details-card-wrapper"
                  >
                    <form id="form">
                      <div className="mini-card">
                        <div className="card-body">
                          <div className="row">
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
                                  defaultValue={user.email}
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
                                  defaultValue={user.doctorInfo?.bio}
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
            </div>
            <DoctorScheduleCard user={user} />
          </div>
          <ChangePassword />
        </div>
      </div>
    </div>
  );
};

export default DoctorSettings;
