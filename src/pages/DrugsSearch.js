import React, { useEffect, useState } from "react";
import Select from "react-select";
import { drugsApi } from "../adminAPI.js";
import warning from "../images/warning.jpg";

const DrugsSearch = (props) => {
  const [selectedDrugs, setSelectedDrugs] = useState([]);
  const [result, setResult] = useState([]);
  const [noResult, setNoResult] = useState(false);
  const [allDrugs, setAllDrugs] = useState([]);
  const [drugs, setDrugs] = useState([]);
  const [drugsInfo, setDrugsInfo] = useState([]);
  const [info, setInfo] = useState();
  let table = [
    "trade name",
    "active ingredients",
    "company",
    "more Information",
  ];

  const searchDrugs = async () => {
    let data = await drugsApi();
    console.log(data[0]);
    let arr = [];
    data.map((e) => {
      arr.push({
        value: e.id,
        label: e.tradename.toLowerCase(),
      });
    });
    setDrugsInfo(data);
    setAllDrugs(arr);
  };

  const getDrugs = (e) => {
    console.log(allDrugs[1]);
    let arr = [];
    allDrugs.map((o) => {
      if (o.label.includes(e.toLowerCase())) {
        arr.push(o);
      }
    });
    setDrugs(arr);
  };

  const getDrugsInfo = (e) => {
    console.log(e);
    let d = drugsInfo.filter((o) => {
      return o.id == e;
    });
    console.log(d);
    setInfo(d[0].info);
  };
  const getSelectedDrug = (e) => {
    console.log(e);
    let d = drugsInfo.filter((o) => {
      return o.id == e.value;
    });
    console.log(d);
    setSelectedDrugs(d);
  };

  useEffect(() => {
    searchDrugs();
  }, []);

  return (
    <div className="main-content">
      <div className="container-fluid">
        <div className="section patient-details-section">
          <div className="row">
            <div className="col-md-8">
              <div className="row">
                <div className="col-sm-12">
                  <div className="card container">
                    <div className="card-body">
                      <form id="form">
                        <div className="form-group col-sm-8" id="drug">
                          <label>Type drug name</label>
                          <Select
                            name="drug"
                            options={drugs}
                            onInputChange={(e) => {
                              if (e.trim().length >= 3) {
                                getDrugs(e);
                              } else {
                                setDrugs([]);
                              }
                            }}
                            onChange={(e) => {
                              e && getSelectedDrug(e);
                            }}
                            isSearchable
                            isClearable
                            required
                          />
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="col-sm-12">
                  <div className="card container label-yellow">
                    <div className="card-body">
                      <div className="row">
                        <div style={{ maxWidth: "35%" }} class="col-md-1">
                          <img className="patHomeImg" src={warning} />
                        </div>
                        <div className="col-md-10 welcome-text-wrapper align-self-center">
                          <p>
                            It is not our intention to provide specific medical
                            advice, but rather to provide users with information
                            to better understand their health. we urges you to
                            consult with a qualified physician for advice about
                            your symptoms.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {selectedDrugs.length > 0 && (
                  <div className="col-sm-12">
                    <div className="card container">
                      <div id="tv" className={`section patients-table-view`}>
                        <label>possible conditions</label>
                        <table className="table table-hover table-responsive-lg">
                          <thead>
                            <tr>
                              {table?.map((e) => {
                                return <th>{e}</th>;
                              })}
                            </tr>
                          </thead>
                          <tbody>
                            {selectedDrugs.map((e) => {
                              return (
                                <tr>
                                  <td>{e.tradename}</td>
                                  <td>
                                    {
                                      e.activeingredient 
                                      .split("+")
                                      .map((o, i) => {
                                        return <p>{`${i + 1}-${o}`}</p>;
                                      })
                                    }
                                  </td>
                                  <td>{e.company}</td>
                                  <td>
                                    <button
                                      autoFocus
                                      className="view-more btn btn-sm btn-dark-red-f"
                                      onClick={() => {
                                        getDrugsInfo(e.id);
                                      }}
                                    >
                                      more info
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="col-sm-4">
              <div className="card">
                <div className="card-body">
                  <div style={{ margin: "0.5em" }}>
                    <textarea
                      className="form-control"
                      rows={16}
                      readOnly
                      value={info ? info : "Drug information will show here"}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrugsSearch;
