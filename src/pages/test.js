import React, { useEffect, useState } from "react";
import { login, mainAPi } from "../SymptomCheckerApi.js";
import { BodyComponent } from "reactjs-human-body";
import Select from "react-select";

const Test = () => {
  const [allData, setAllData] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [selectedBodyLoc, setSelectedBodyLoc] = useState([]);
  const [selectedSubBodyLoc, setSelectedSubBodyLoc] = useState([]);
  const [result, setResult] = useState();
  const [disableSymptoms, setDisableSymptoms] = useState(false);

  let apiLogin = async () => {
    let d = await login();
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
    let allSymptoms = await mainAPi("symptoms");
    let bodyLocations = await mainAPi("body/locations");
    let subBodyLocations = await mainAPi("body/locations/6");
    allSymptoms = keyRename(allSymptoms);
    bodyLocations = keyRename(bodyLocations);
    subBodyLocations = keyRename(subBodyLocations);
    setAllData([
      ["symptoms", allSymptoms, true, setSelectedSymptoms, "block"],
/*       ["bodyLocations", bodyLocations, false, setSelectedBodyLoc, "block"],
      [
        "subBodyLocations",
        subBodyLocations,
        false,
        setSelectedSubBodyLoc,
        "block",
      ], */
    ]);
  };

  let getResults = async()=>{
    let symptomsIds = selectedSymptoms.map((e)=>{
      return e.value
    })
    let apiData = `&symptoms=[${symptomsIds}]&gender=male&year_of_birth=2001`;
    let data = await mainAPi("diagnosis",apiData);
    console.log(data);
    console.log(symptomsIds);
  }

  let limitedOptions = () => {
    return selectedSymptoms.length >= 3;
  };

  let body = (e) => {
    console.log(e);
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
  };

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
                        <div className="form-group col-sm-8" id="">
                          <label>date of birth</label>
                          <input
                            className="form-control"
                            name=""
                            type=""
                            required
                          />
                        </div>
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
                      </form>
                      <button onClick={()=>{getResults()}}></button>
                    </div>
                  </div>
                </div>
                <div className="col-sm-12">
                <div className="card container">
                  <div className="card-body">
                    <textarea
                      className="form-control"
                      id="noteCon"
                      placeholder="results will show here"
                      rows={16}
                      defaultValue={result}
                    />
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
        </div>
        <div></div>

        <div id="area">
          Area: <span id="data"></span>
        </div>
      </div>
    </div>
  );
};

export default Test;
