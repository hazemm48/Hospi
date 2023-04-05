import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { reserve } from "../adminAPI.js";

const ReserveDetails = () => {
  const id = useLocation();
  const [reserves, setReserves] = useState();

  const Data = async () => {
    let formEl = document.forms.form;
    let formData = new FormData(formEl);
    let body = {
      oper: "get",
      body: {
        filter: {
          _id: id.state,
        },
      },
    };
    let reserveData = await reserve(body);
    console.log(reserveData);
    setReserves(reserveData);
    console.log(reserves);
  };

  useEffect(() => {
    Data();
  }, []);

  return (
    <div className="main-content">
      <div className="container-fluid">
        <div className="section patient-details-section">
          <div className="card ">
            <div className="">
              <div className="col d-flex justify-content-center">
                <div className="mini-card text-center">
                  <div className="card-body">
                    <input
                      id="name"
                      className="form-control"
                      readOnly
                      style={{ textAlign: "center" }}
                    />

                    <small className="text-muted">{reserves[0]?._id}</small>
                    <h5>{reserves[0].type} reserve</h5>
                    <p></p>
                  </div>
                </div>
              </div>

              <div
                id="editDet"
                className="col d-flex justify-content-center patients-details-card-wrapper"
              >
                <form id="form" method="post">
                  <div className="mini-card">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-4">
                          <div className="form-group">
                            <label>patient name</label>
                            <input
                              name="gen"
                              className="form-control"
                              readOnly="readonly"
                            />
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="form-group">
                            <label>doctor name</label>
                            <input
                              name="bd"
                              className="form-control"
                              readOnly="readonly"
                            />
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="form-group">
                            <label>speciality</label>
                            <input
                              name="ph"
                              className="form-control"
                              readOnly="readonly"
                            />
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="form-group">
                            <label>fees</label>
                            <input
                              name="ci"
                              className="form-control"
                              readOnly="readonly"
                            />
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="form-group">
                            <label>date</label>
                            <input
                              id="sta"
                              className="form-control"
                              readOnly="readonly"
                            />
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="form-group">
                            <label>time</label>
                            <input
                              id="reg"
                              className="form-control"
                              readOnly="readonly"
                            />
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="form-group">
                            <label>phone</label>
                            <input
                              name="em"
                              className="form-control"
                              readOnly="readonly"
                            />
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="form-group">
                            <label>visit type</label>
                            <input
                              name="add"
                              className="form-control"
                              readOnly="readonly"
                            />
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="form-group">
                            <label>another person</label>
                            <input
                              name="add"
                              className="form-control"
                              readOnly="readonly"
                            />
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="form-group">
                            <label>turn number</label>
                            <input
                              name="add"
                              className="form-control"
                              readOnly="readonly"
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
    </div>
  );
};

export default ReserveDetails;
