import React, { useEffect, useState } from "react";
import Select from "react-select";
import { apiMedicLogin, mainAPi } from "../../SymptomCheckerApi.js";
import DatePicker from "react-datepicker";
import moment from "moment";

const DiagnosisChecker = () => {
  const [allData, setAllData] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [selectedGender, setSelectedGender] = useState();
  const [result, setResult] = useState([]);
  const [disableSymptoms, setDisableSymptoms] = useState(false);
  const [birthYear, setBirthYear] = useState(new Date());
  const [issueInfo, setIssueInfo] = useState();

  let table = ["name", "chances", "specialisations", "more Information"];

  const apiLogin = async () => {
    let d = await apiMedicLogin();
    console.log(d);
  };

  useEffect(() => {
    apiLogin();
    getData();
  }, []);

  const getData = async () => {
    let allSymptoms = await mainAPi("symptoms");
    allSymptoms = allSymptoms.map((e) => {
      return {
        value: e.ID,
        label: e.Name,
      };
    });
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
    setIssueInfo()
    console.log(data);
    console.log(symptomsIds);
  };

  const getIssueInfo = async (e) => {
    let data = await mainAPi(`issues/${e}/info`);
    setIssueInfo(data);
    console.log(data);
  };

  return (
    <>
      <div className="section patient-details-section">
        <div className="row">
          <div className="col-md-5">
            <div className="row">
              <div className="col-sm-12">
                <div className="card container">
                  <div className="card-body">
                    <form id="form">
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
                      {allData.map((e) => {
                        return (
                          <div className="form-group col-sm-10" id={e[0]}>
                            <label>{e[0]}</label>
                            <Select
                              name={e[0]}
                              options={e[1]}
                              onChange={(o) => {
                                selectedSymptoms >= 2 &&
                                  setDisableSymptoms(true);
                                e[3](o);
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
                            />
                          </div>
                        );
                      })}
                      <button
                        className="btn btn-dark-red-f-gr mt-4"
                        type="button"
                        onClick={() => {
                          getResults();
                        }}
                      >
                        diagnose
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-7">
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
        {issueInfo && (
          <div>
            <h2 style={{ textAlign: "center" }}>Information</h2>
            <div className="card container">
              <div className="card-body">
                <textarea
                  className="form-control"
                  id="noteCon"
                  placeholder="you can write patient notes over here"
                  rows={16}
                  readOnly
                  value={`Short Description: ${issueInfo.DescriptionShort}\n\nDescription: ${issueInfo.Description}\n\nMedical Condition: ${issueInfo.MedicalCondition}\n\nPossible Symptoms: ${issueInfo.PossibleSymptoms}`}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DiagnosisChecker;
