import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { users, reserve } from "../../src/adminAPI";
import whatsapp from "../images/whatsapp.png";
import sick from "../images/sick.png";
import examin from "../images/4997671.jpg";
import LoadingSpinner from "../components/Loading.js";

const HomePage = (props) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(props.user);
  const [resLength, setResLength] = useState(0);

  const GetDetails = async () => {
    let body = {};
    let data = await users(body);
    let resBody = {
      oper: "get",
      data: {
        filter: {
          patientId: data.users._id,
        },
      },
    };
    let reserves = await reserve(resBody);
    setResLength(reserves.reservations.length);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    GetDetails();
  }, []);

  let cards = [
    ["/patient/doctors", "la-clinic-medical", "clinic visit"],
    ["/patient/laboratory", "la-vials", "lab analysis"],
    ["/patient/radiation", "la-x-ray", "radiations"],
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
                          <div className="col-lg-6 welcome-text-wrapper align-self-center">
                            <h3>
                              Hello,
                              <span style={{ color: "#0466c8" }}>
                                {user.name}
                              </span>
                            </h3>
                            <h5>Welcome to HOSPI</h5>
                          </div>
                          <div class="col-md-6 welcome-img-wrapper">
                            <img src={examin} />
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
                          <div style={{maxWidth:"35%"}} class="col-md-3">
                            <img src={whatsapp} />
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
                          <div style={{maxWidth:"35%"}} className="col-md-3">
                            <img src={sick} />
                          </div>
                          <div className="col-lg-9 welcome-text-wrapper align-self-center">
                            <h5>
                              not feeling good ? check on your self with our{" "}
                              <Link
                                to="/patient/symptomChecker"
                                style={{ color: "crimson" }}
                              >
                                symptom checker system
                              </Link>
                            </h5>
                          </div>
                        </div>
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
