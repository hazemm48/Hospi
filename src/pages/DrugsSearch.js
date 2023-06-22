import React, { useEffect, useState } from "react";
import Select from "react-select";
import { drugsApi } from "../adminAPI.js";
import warning from "../images/warning.jpg";
import { getInteractionApi, suggestApi } from "../RxNormAPI.js";

const DrugsSearch = () => {
  const [selectedDrugs, setSelectedDrugs] = useState([]);
  const [result, setResult] = useState([]);
  const [noResult, setNoResult] = useState(false);
  const [allDrugs, setAllDrugs] = useState([]);
  const [drugs, setDrugs] = useState([]);
  const [drugsInfo, setDrugsInfo] = useState([]);


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
    setDrugsInfo(data)
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
    let arr = [];
    allDrugs.map((o) => {
      if (o.label.includes(e.toLowerCase())) {
        arr.push(o);
      }
    });
    setDrugs(arr);
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
                              }else{
                                setDrugs([])
                              }
                            }}
                            isSearchable
                            isClearable
                            required
                          />
                        </div>
                        <button
                          className="btn btn-dark-red-f-gr mt-4"
                          type="button"
                        >
                          submit
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
                {allDrugs.length>0&&(
                  
                <div className="col-sm-12">
                  <div className="card welcome-content-card label-yellow">
                    <div className="card-body">
                      <div className="row">
                        <div style={{ maxWidth: "35%" }} className="col-md-2">
                          <img className="patHomeImg" style={{ width: "auto",height:'auto' }} src={`${process.env.REACT_APP_DRUGS_API}/assets/imgs5/drugs/${10}.jpg`} />
                        </div>
                        <div className="col-md-10 welcome-text-wrapper align-self-center">
                          <ul class="list-group">
                            <li class="list-group-item">{drugsInfo[1].tradename}</li>
                            <li class="list-group-item">{drugsInfo[1].price}</li>
                            <li class="list-group-item">{drugsInfo[1].company}</li>
                            <li class="list-group-item">{drugsInfo[1].info}</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                )}
                {result.length > 0 && (
                  <div>
                    <h2 style={{ textAlign: "center" }}>Results</h2>
                    <div className="card container">
                      <div className="card-body">
                        {result.map((e) => {
                          return (
                            <div style={{ margin: "0.5em" }}>
                              <textarea
                                className="form-control"
                                rows={7}
                                readOnly
                                value={`Drug 1: ${e.drug1}\nDrug 2: ${e.drug2}\n${e.effMaterial}\n\nDescription: ${e.desc}`}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
                {noResult && (
                  <div>
                    <div className="card container label-green">
                      <div className="card-body">
                        <h2>No interaction between drugs</h2>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrugsSearch;
