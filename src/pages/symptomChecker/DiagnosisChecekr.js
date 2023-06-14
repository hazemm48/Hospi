import React, { useEffect, useState } from "react";
import Select from "react-select";
import { mainAPi } from "../../SymptomCheckerApi.js";
import DatePicker from "react-datepicker";
import { BodyComponent } from "reactjs-human-body";
import warning from "../../images/warning.jpg";


import moment from "moment";

const DiagnosisChecker = (props) => {
  const [allData, setAllData] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [selectedBodyLoc, setSelectedBodyLoc] = useState();
  const [selectedSubBodyLoc, setSelectedSubBodyLoc] = useState();
  const [selectedGender, setSelectedGender] = useState({ value: "man" });
  const [birthYear, setBirthYear] = useState(new Date());
  const [issueInfo, setIssueInfo] = useState();
  const [result, setResult] = useState([]);
  const [symView, setSymView] = useState(false);
  console.log(props);
  let table = ["name", "chances", "specialisations", "more Information"];

  useEffect(() => {
    if (props.type == "symptoms") {
      setSymView(true);
    }
  }, []);

  let getData = async (url, selOpts) => {
    let data = await mainAPi(url);
    data = data.map((e) => {
      return {
        value: e.ID,
        label: e.Name,
      };
    });
    selOpts[selOpts.length - 1][1] = data;
    return selOpts;
  };

  const getResults = async () => {
    let symptomsIds = selectedSymptoms.map((e) => {
      return e.value;
    });
    let url = `&symptoms=[${symptomsIds}]&gender=${
      selectedGender.value
    }&year_of_birth=${moment(birthYear).format("YYYY")}`;
    let data = await mainAPi("diagnosis", url);
    setResult(data);
    setIssueInfo();
    console.log(data);
  };

  const getBodySymptoms = async (e) => {
    if (!e) {
      e = selectedSubBodyLoc.value;
    }
    let url = `symptoms/${e}/${selectedGender.value}`;
    await getSymptoms(url);
    setSymView(true);
  };

  let body = (e) => {
    const svgs = document.getElementsByTagName("svg");
    for (let i = 0; i < svgs.length; i++) {
      let _svg = svgs[i];
      let dataAttr = _svg.getAttribute("data-position");
      _svg.style.zIndex = "";
      if (dataAttr == e) {
        _svg.classList.add("selected");
      } else {
        _svg.classList.remove("selected");
      }
    }
    let arr = [
      ["chest", "31"],
      ["stomach", "36"],
      ["arm", "48"],
      ["shoulder", "26"],
      ["hand", "29"],
      ["head", "6"],
      ["foot", "44"],
      ["leg", "49"],
    ];
    let bodyLocId = "";
    arr.map((o) => {
      if (o.includes(e.split("_").pop())) {
        bodyLocId = o[1];
      }
    });
    getBodySymptoms(bodyLocId);
  };

  const getSubBodyLocations = async (o) => {
    allData.map((e, i) => {
      if (e[0] == "body sub Locations") {
        allData.pop(i);
      }
    });
    let arr = [["body sub Locations", [], false, setSelectedSubBodyLoc]];
    let url = `body/locations/${o.value}`;
    let data = await getData(url, arr);
    setAllData([...allData, ...data]);
  };

  const getSymptoms = async (url) => {
    let arr = [
      [
        "gender",
        [
          { value: "male", label: "male" },
          { value: "female", label: "female" },
        ],
        false,
        setSelectedGender,
      ],
      ["symptoms", [], true, setSelectedSymptoms],
    ];
    let data = await getData(url, arr);
    setAllData(data);
  };
  console.log(allData);

  const getBodyLocations = async () => {
    let arr = [
      [
        "gender & age",
        [
          { value: "man", label: "man" },
          { value: "woman", label: "woman" },
          { value: "boy", label: "boy" },
          { value: "girl", label: "girl" },
        ],
        false,
        setSelectedGender,
      ],
      ["body locations", [], false, setSelectedBodyLoc],
    ];
    let url = "body/locations";
    let data = await getData(url, arr);
    setAllData(data);
  };

  const getIssueInfo = async (e) => {
    let data = await mainAPi(`issues/${e}/info`);
    setIssueInfo(data);
    console.log(data);
  };

  useEffect(() => {
    if (props.type == "symptoms") {
      getSymptoms("symptoms");
    } else {
      getBodyLocations();
    }
  }, []);

  return (
    <div className="section patient-details-section">
      <div className="row">
        <div className={props.type == "symptoms" ? "col-md-12" : "col-md-8"}>
          <div className="row">
            <div className="col-sm-12">
              <div className="card container">
                <div className="card-body">
                  <form id="form">
                    {symView && (
                      <div className="form-group col-sm-6">
                        <label>date of birth</label>
                        <DatePicker
                          className="form-control"
                          selected={birthYear}
                          onChange={(date) => setBirthYear(date)}
                          showYearPicker
                          dateFormat="yyyy"
                        />
                      </div>
                    )}

                    {allData.map((e) => {
                      return (
                        <div
                          className="form-group col-sm-6"
                          id={e[0]}
                          style={{ display: e[4] }}
                        >
                          <label>{e[0]}</label>
                          <Select
                            name={e[0]}
                            options={e[1]}
                            onChange={(o) => {
                              e[3](o);
                              if (e[0] == "body locations") {
                                getSubBodyLocations(o);
                              }
                            }}
                            isOptionDisabled={() => {
                              if (e[0] == "symptoms") {
                                return selectedSymptoms.length >= 3;
                              } else {
                                return false;
                              }
                            }}
                            isMulti={e[2]}
                            isSearchable
                            isClearable
                            required
                          />
                        </div>
                      );
                    })}
                    <button
                      className="btn btn-dark-red-f-gr mt-4"
                      type="button"
                      onClick={() => {
                        if (symView) {
                          getResults();
                        } else {
                          setAllData([]);
                          getBodySymptoms();
                        }
                      }}
                    >
                      {symView ? "diagnose" : "get body symptoms"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
            {result.length > 0 && (
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
                          to better understand their health. we urges you to consult with a qualified
                          physician for advice about your symptoms.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
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
                      {result &&
                        result.map((e) => {
                          return (
                            <tr>
                              <td>{e.Issue.Name}</td>
                              <td>{Math.ceil(e.Issue.Accuracy)}%</td>
                              <td>
                                {e.Specialisation.map((o, i) => {
                                  return <p>{`${i + 1}-${o.Name}`}</p>;
                                })}
                              </td>
                              <td>
                                <button
                                  className="view-more btn btn-sm btn-dark-red-f"
                                  onClick={() => {
                                    getIssueInfo(e.Issue.ID);
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
          </div>
        </div>
        {!(props.type == "symptoms") && (
          <div className="col-sm-4">
            <div className="card">
              <div className="card-body">
                <BodyComponent onClick={(e) => body(e)} />
              </div>
            </div>
          </div>
        )}
      </div>
      {issueInfo && (
        <div>
          <h2 style={{ textAlign: "center" }}>Information</h2>
          <div className="card container">
            <div className="card-body">
              <textarea
                className="form-control"
                rows={16}
                readOnly
                value={`Short Description: ${issueInfo.DescriptionShort}\n\nDescription: ${issueInfo.Description}\n\nMedical Condition: ${issueInfo.MedicalCondition}\n\nPossible Symptoms: ${issueInfo.PossibleSymptoms}`}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiagnosisChecker;
