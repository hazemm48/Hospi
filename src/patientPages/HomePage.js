import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { users, reserve } from "../../src/adminAPI";
import whatsapp from "../images/whatsapp.jpg";
import sick from "../images/sick.jpg";
import drugs from "../images/drugs.jpg";
import examin from "../images/hello.jpg";
import maleImg from "../images/male.jpg";
import LoadingSpinner from "../components/Loading.js";
import moment from "moment";

const HomePage = (props) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(props.user);
  const [resLength, setResLength] = useState(0);
  const [reserves, setReserves] = useState([]);

  const GetDetails = async () => {
    let body = {};
    let data = await users(body);
    let resBody = {
      oper: "get",
      data: {
        filter: {
          patientId: data.users._id,
        },sort: "date time.from",
      },
    };
    let reserves = await reserve(resBody);
    console.log(reserves);
    let filtered = reserves.reservations.filter((e) => {
      return e.status == false;
    });
    setResLength(reserves.reservations.length);
    setReserves(filtered);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    GetDetails();
  }, []);

  let cards = [
    ["/patient/doctors", "la-clinic-medical", "clinic visit"],
    ["/patient/reserve/lab", "la-vials", "lab analysis"],
    ["/patient/reserve/rad", "la-x-ray", "radiations"],
    ["/patient/firstAid", "la-medkit", "first aid"],
    ["/patient/medicalRecord", "la-notes-medical", "medical record"],
  ];

  return (
    <div className="main-content">
      <div className="container-fluid">
        {loading ? (
          <LoadingSpinner />
        ) : (
          user && (
            <>
              <div className="section">
                <div className="row">
                  <div className="col-md-6">
                    <h5 className="page-title">Home</h5>
                  </div>
                </div>
              </div>
              <div className="section welcome-section">
                <div className="section-content">
                  <div className="card-deck">
                    <div className="card welcome-content-card">
                      <div className="card-body">
                        <div className="row">
                          <div className="col-lg-8 welcome-text-wrapper align-self-center">
                            <h3>
                              Hello,{" "}
                              <span style={{ color: "#0466c8" }}>
                                {user.name}
                              </span>
                            </h3>
                            <h5>Welcome to HOSPI</h5>
                          </div>
                          <div class="col-md-4 welcome-img-wrapper">
                            <img style={{ width: "45%" }} src={examin} />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card app-stats-card">
                      <div className="card-body">
                        <div className="row text-center">
                          <div className="col-md-6">
                            <i className="las la-stethoscope la-3x align-self-center" />
                            <p>fav doctors</p>
                            <h4>{user.patientInfo?.favDoctors.length}</h4>
                          </div>
                          <div className="col-md-6">
                            <i className="las la-calendar-check la-3x align-self-center" />
                            <p>total reservations</p>
                            <h4>{resLength}</h4>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="section functionality-section">
                <div className="section-content">
                  <div className="card-deck">
                    {cards.map((e) => {
                      return (
                        <Link
                          to={e[0]}
                          state={user._id}
                          className="card text-center"
                        >
                          <div className="card-title">
                            <div className="icon-wrapper">
                              <i className={`las ${e[1]}`} />
                            </div>
                          </div>
                          <div className="card-body">
                            <p>{e[2]}</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="section welcome-section">
                <div className="section-content">
                  <div className="card-deck">
                    <div className="card welcome-content-card">
                      <div className="card-body">
                        <div className="row">
                          <div style={{ maxWidth: "35%" }} class="col-md-3">
                            <img className="patHomeImg" src={whatsapp} />
                          </div>
                          <div className="col-lg-9 welcome-text-wrapper align-self-center">
                            <h5>
                              now you can ask for help on{" "}
                              <a
                                href="https://wa.me/1282610966"
                                target="_blank"
                                style={{ color: "green" }}
                              >
                                whatsApp
                              </a>
                            </h5>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card welcome-content-card">
                      <div className="card-body">
                        <div className="row">
                          <div style={{ maxWidth: "35%" }} className="col-md-3">
                            <img className="patHomeImg" src={sick} />
                          </div>
                          <div className="col-lg-9 welcome-text-wrapper align-self-center">
                            <h5>
                              not feeling good ? check on your self with our{" "}
                              <Link
                                to="/patient/symptomChecker"
                                style={{ color: "orange" }}
                              >
                                symptom checker system
                              </Link>
                            </h5>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card welcome-content-card">
                      <div className="card-body">
                        <div className="row">
                          <div style={{ maxWidth: "35%" }} className="col-md-1">
                            <img className="patHomeImg" src={drugs} />
                          </div>
                          <div className="col-lg-10 welcome-text-wrapper align-self-center">
                            <h5>
                              you can check if there is any interaction between drugs with our{" "}
                              <Link
                                to="/patient/drugsInteraction"
                                style={{ color: "#0466c8" }}
                              >
                                check drugs interaction system
                              </Link>
                            </h5>
                          </div>
                        </div>
                      </div>
                    </div>
                </div>
              </div>
              <div className="section card-summaries">
                <div className="section-content">
                  <div className="card-deck">
                    <div className="card">
                      <div className="card-header">
                        <h5>upcoming reservations</h5>
                      </div>
                      <div className="card-body">
                        <table className="table table-borderless table-hover table-responsive-md">
                          <tbody>
                            {reserves.length ? (
                              reserves.splice(0, 5).map((reserve) => {
                                return (
                                  <tr>
                                    <td>
                                      <img
                                        className="rounded-circle"
                                        src={user.image?user.image:maleImg}
                                        loading="lazy"
                                      />
                                    </td>
                                    <td>
                                      <p>{reserve.patName}</p>
                                    </td>
                                    <td>
                                      <p>{reserve.type} reserve</p>
                                    </td>
                                    <td className="text-muted">
                                      <p>
                                        {moment(reserve.date).format(
                                          "DD/MM/YYYY"
                                        )}
                                      </p>
                                    </td>
                                    <td className="text-muted">
                                      {reserve.time ? (
                                        <p>
                                          {moment(
                                            reserve.time.from,
                                            "HH:mm"
                                          ).format("h:mm")}
                                          -
                                          {moment(
                                            reserve.time.to,
                                            "HH:mm"
                                          ).format("h:mm A")}
                                        </p>
                                      ) : (
                                        <p>all day</p>
                                      )}
                                    </td>

                                    <td>
                                      <Link
                                        to="/patient/reserveDetails"
                                        state={reserve._id}
                                        className="btn btn-sm"
                                      >
                                        <i className="las la-info-circle" />
                                      </Link>
                                    </td>
                                  </tr>
                                );
                              })
                            ) : (
                              <p>No upcoming reservations</p>
                            )}
                          </tbody>
                        </table>
                      </div>
                      <div className="card-footer">
                        <Link to="/patient/reservations" className="view-more">
                          more
                          <i className="las la-angle-right" />
                        </Link>
                      </div>
                    </div>
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

export default HomePage;
