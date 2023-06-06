import moment from "moment";
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { medicalRecord } from "../../adminAPI.js";
import LoadingSpinner from "../../components/Loading.js";
import { PagenationResult } from "../../components/Pagenation.js";
import record from "../../images/patient.png";

const MedicalRecord = ({role}) => {
  const [loading, setLoading] = useState(false);
  const [length, setLength] = useState();
  const [data, setData] = useState([]);
  let { state } = useLocation();

  let filterValues = [
    ["all", "All"],
    ["diagnose", "diagnose"],
    ["medication", "Medication"],
    ["rad", "radiation results"],
    ["lab", "Lab results"],
    ["operation", "Operation"],
  ];

  let getRecordsData = async () => {
    let body = {
      filter: {
        patientId: state,
      },
    };
    let type = document.getElementById("type").value;
    if (!(type == "all")) {
      body.filter = { ...body.filter, type: type };
    }
    let { records } = await medicalRecord(body, "POST", "get");
    setData(records);
    setLength(records.length);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    getRecordsData();
  }, []);

  return (
    <div className="main-content">
      <div className="container-fluid">
        <div className="section title-section">
          <h5 className="page-title">Medical Records</h5>
        </div>
        <div className="section filters-section">
          <div style={{marginRight:"0.5em"}}>
            <label>Type :</label>
          </div>
          <div className="dropdowns-wrapper">
            <div className="dropdown">
              <select
                id="type"
                className="form-select dropdown-toggle"
                role="button"
                onChange={() => {
                  setLoading(true);
                  getRecordsData();
                }}
              >
                {filterValues.map((e) => {
                  if (e[0] == "all") {
                    return (
                      <option selected value={e[0]}>
                        {e[1]}
                      </option>
                    );
                  }
                  return <option value={e[0]}>{e[1]}</option>;
                })}
              </select>
            </div>
          </div>
          <div className="buttons-wrapper ml-auto">
            <Link to={`/${role}/addMedicalRecord`} state={state}>
              <button className="btn btn-dark-red-f-gr">
                <i className="las la-plus-circle" />
                add a new medical record
              </button>
            </Link>
          </div>
        </div>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <PagenationResult pageNo={0} length={length} />
            <div id="cv" className="section patients-card-view">
              <div className="row">
                {data &&
                  data.map((data) => {
                    return (
                      <div className="col-md-3">
                        <div className="card">
                          <div className="card-header">
                            <div className="card-img-top">
                              <img src={record} loading="lazy" />
                              <Link
                                to={`/${role}/medicalRecordDetails`}
                                state={data._id}
                                className="view-more"
                              >
                                view record
                              </Link>
                            </div>
                          </div>
                          <div className="card-body">
                            <div className="card-subsection-body">
                              <label className="text-muted">name</label>
                              <p>{data.name}</p>
                              <label className="text-muted">type</label>
                              <p>{data.type}</p>
                              <label className="text-muted">date</label>
                              <p>{moment(data.date).format("DD/MM/YYYY")}</p>
                            </div>
                          </div>
                          <div className="card-footer" />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MedicalRecord;
