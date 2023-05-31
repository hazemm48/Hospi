import React, { useEffect, useState } from "react";
import { apiMedicLogin, mainAPi } from "../../SymptomCheckerApi.js";
import { BodyComponent } from "reactjs-human-body";
import DatePicker from "react-datepicker";
import Select from "react-select";
import moment from "moment";

const BodyLocationChecker = () => {
  const [allData, setAllData] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [selectedBodyLoc, setSelectedBodyLoc] = useState();
  const [selectedSubBodyLoc, setSelectedSubBodyLoc] = useState([]);
  const [selectedGender, setSelectedGender] = useState({ vale: "man" });
  const [issueInfo, setIssueInfo] = useState();
  const [result, setResult] = useState();
  const [birthYear, setBirthYear] = useState(new Date());
  const [disableSymptoms, setDisableSymptoms] = useState(false);
  const [symView, setSymView] = useState(false);

  let table = ["name", "chances", "specialisations", "more Information"];

  let apiLogin = async () => {
    let d = await apiMedicLogin();
    console.log(d);
  };

  useEffect(() => {
    apiLogin();
    getData();
  }, []);

  let getData = async () => {
    let keyRename = (obj) => {
      return obj.map((e) => {
        return {
          value: e.ID,
          label: e.Name,
        };
      });
    };
    let bodyLocations = await mainAPi("body/locations");
    //let subBodyLocations = await mainAPi("body/locations/6");
    bodyLocations = keyRename(bodyLocations);
    //subBodyLocations = keyRename(subBodyLocations);
    setAllData([])
    setAllData([
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
      ["body locations", bodyLocations, false, setSelectedBodyLoc],
    ]);
  };

  const getResults = async () => {
    let symptomsIds = selectedSymptoms.map((e) => {
      return e.value;
    });
    let apiData = `&symptoms=[${symptomsIds}]&gender=${
      selectedGender.value
    }&year_of_birth=${moment(birthYear).format("YYYY")}`;
    let data = await mainAPi("diagnosis", apiData);
    setResult(data);
    setIssueInfo();
    console.log(data);
    console.log(symptomsIds);
  };

  const getBodySymptoms = async (e) => {
    if (!e) {
      e = selectedSubBodyLoc.value;
    }
    let allSymptoms = await mainAPi(`symptoms/${e}/${selectedGender.value}`);
    allSymptoms = allSymptoms.map((e) => {
      return {
        value: e.ID,
        label: e.Name,
      };
    });
    console.log(allSymptoms);
    setAllData([
      [
        "gender",
        [
          { value: "male", label: "male" },
          { value: "female", label: "female" },
        ],
        false,
        setSelectedGender,
      ],
      ["symptoms", allSymptoms, true, setSelectedSymptoms],
    ]);
    setSymView(true);
  };

  let body = (e) => {
    e = e.split("_").pop();
    const svgs = document.getElementsByTagName("svg");
    for (let i = 0; i < svgs.length; i++) {
      let _svg = svgs[i];
      let dataAttr = _svg.getAttribute("data-position");
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
      if (o.includes(e)) {
        bodyLocId = o[1];
      }
    });
    getBodySymptoms(bodyLocId);
  };

  let getSubBodyLocations = async (o) => {
    allData.map((e, i) => {
      if (e[0] == "body sub Locations") {
        allData.pop(i);
      }
    });
    console.log(o);

    let subBodyLocations = await mainAPi(`body/locations/${o.value}`);
    allData.map((e, i) => {
      if (e[0] == "body sub Locations") {
        allData.pop(i);
      }
    });
    subBodyLocations = subBodyLocations.map((e) => {
      return {
        value: e.ID,
        label: e.Name,
      };
    });
    console.log(subBodyLocations);
    console.log(allData);
    let arr = [
      "body sub Locations",
      subBodyLocations,
      false,
      setSelectedSubBodyLoc,
    ];
    setAllData([...allData, arr]);
  };

  const getIssueInfo = async (e) => {
    let data = await mainAPi(`issues/${e}/info`);
    setIssueInfo(data);
    console.log(data);
  };

  return (
    <div className="section patient-details-section">
      <div className="row">
        <div className="col-md-8">
          <div className="row">
            <div className="col-sm-12">
              <div className="card container">
                <div className="card-body">
                  <form id="form">
                    {symView && (
                      <div className="form-group col-sm-10" id="">
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
                              selectedSymptoms >= 2 && setDisableSymptoms(true);
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
                        symView ? getResults() : getBodySymptoms();
                      }}
                    >
                      {symView ? "diagnose" : "get body symptoms"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
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
                          console.log("ad");
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
        <div className="col-sm-4">
          <div className="card">
            <div className="card-body">
              <BodyComponent onClick={(e) => body(e)} />
            </div>
          </div>
        </div>
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

export default BodyLocationChecker;
