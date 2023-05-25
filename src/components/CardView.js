import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { uploadFile, users } from "../adminAPI";
import manImg from "../images/man.svg";
import moment from "moment";
import LoadingSpinner from "./Loading.js";

const CardView = (props) => {
  const [users, setUsers] = useState(props.data);

  return (
    <div id="cv" className="section patients-card-view">
      <div className="row">
        {users &&
          users.map((user) => {
            return (
              <div className="col-md-4">
                <div className="card">
                  <div className="card-header">
                    <div className="card-img-top">
                      <img
                        className="rounded-circle"
                        src={user.image ? user.image : manImg}
                        loading="lazy"
                      />
                      <Link
                        to={`/home/${props.type}Details`}
                        state={user._id}
                        className="view-more"
                      >
                        view profile
                      </Link>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="card-subsection-title">
                      <h5>{user.name}</h5>
                    </div>
                    <div className="card-subsection-body">
                      <label className="text-muted">
                        {props.type == "doctor" ? "speciality" : "email"}
                      </label>
                      <p>
                        {props.type == "doctor"
                          ? user.doctorInfo?.speciality
                          : user.email}
                      </p>
                      <label className="text-muted">date of birth</label>
                      <p>
                        {user[`${props.type}Info`]?.birthDate &&
                          moment(user[`${props.type}Info`].birthDate).format(
                            "DD/MM/YYYY"
                          )}
                      </p>
                      <label className="text-muted">gender</label>
                      <p>{user.gender}</p>
                    </div>
                  </div>
                  <div className="card-footer" />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default CardView;
