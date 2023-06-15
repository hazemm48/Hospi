import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import maleImg from "../images/male.jpg";
import femaleImg from "../images/female.jpg";
import moment from "moment";

const CardView = (props) => {
  const [users, setUsers] = useState([]);

  const favDoc = (e, id) => {
    let label = e.target.closest("div").querySelector("label");
    if (!label.classList.contains("active")) {
      label.classList.add("active");
    } else {
      label.classList.remove("active");
    }
    props.addDocFavFun(id);
  };

  useEffect(() => {
    setUsers(props.data);
  }, []);
  console.log(props.role);

  return (
    <div id="cv" className="section patients-card-view">
      <div className="row">
        {users.length > 0 &&
          users.map((user, i) => {
            let cl = "";
            console.log(props.favDocs);

            if (props.favDocs?.includes(user._id)) {
              cl = "active";
            }
            return (
              <div className="col-md-4">
                <div className="card">
                  <div className="card-header">
                    <div className="card-img-top">
                      <img
                        className="rounded-circle"
                        src={
                          user.image
                            ? user.image
                            : user.gender == "male"
                            ? maleImg
                            : femaleImg
                        }
                        loading="lazy"
                      />
                      {["admin","doctor"].includes(props.role) ? (
                        <Link
                          to={`/${props.role}/${props.type}Details`}
                          state={user._id}
                          className="view-more"
                        >
                          view profile
                        </Link>
                      ) : (
                        <div className="float-right">
                          <label
                            className={`heart ${cl}`}
                            onClick={(e) => {
                              favDoc(e, { id: user._id });
                            }}
                          >
                            ❤
                          </label>
                        </div>
                      )}
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
                      {props.type != "admin" && (
                        <>
                          <label className="text-muted">
                            {props.type == "doctor"
                              ? "schedule"
                              : "date of birth"}{" "}
                          </label>
                          <p>
                            {props.type == "doctor"
                              ? user.scheduleDays.join(" , ")
                              : user[`${props.type}Info`]?.birthDate &&
                                moment(
                                  user[`${props.type}Info`].birthDate
                                ).format("DD/MM/YYYY")}
                          </p>
                        </>
                      )}
                      <label className="text-muted">gender</label>
                      <p>{user.gender}</p>
                    </div>
                  </div>
                  {props.type == "doctor" && (
                    <div className="card-footer">
                      <Link
                        to={`/${props.role}/addReserve`}
                        state={{ id: user._id, type: "doctor" }}
                        className="float-right"
                      >
                        <button className="btn btn-dark-red-f-gr">
                          reserve
                        </button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default CardView;
