import React, { useEffect, useState } from "react";
import AsyncSelect from "react-select/async";
import warning from "../images/warning.jpg";
import { getInteractionApi, suggestApi } from "../RxNormAPI.js";

const DrugsInteraction = () => {
  const [selectedDrugs, setSelectedDrugs] = useState([]);
  const [result, setResult] = useState([]);
  const [noResult, setNoResult] = useState(false);

  const searchSuggest = async (o) => {
    let { approximateGroup } = await suggestApi(o);
    let suggestions = approximateGroup.candidate;
    let arr = [];
    suggestions.map((e) => {
      if (["RXNORM"].includes(e.source)) {
        arr.push({
          value: e.rxcui,
          label: e.name,
        });
      }
    });
    return arr;
  };

  const GetInteractions = async (o) => {
    if (selectedDrugs.length < 2) {
      alert("select more than one input");
    } else {
      let arr = [];
      selectedDrugs.map((e) => {
        arr.push(e.value);
      });
      arr = arr.join("+");
      let { fullInteractionTypeGroup } = await getInteractionApi(arr);
      let arr2 = [];
      if (fullInteractionTypeGroup) {
        let intResults = fullInteractionTypeGroup[0].fullInteractionType;
        intResults.map((e) => {
          let obj = {};
          let drugNameArr = e.comment.split(".");
          obj.drug1 = drugNameArr[0]
            .split(",")[1]
            .slice(drugNameArr[0].split(",")[1].indexOf("name") + 6);
          obj.drug2 = drugNameArr[1]
            .split(",")[1]
            .slice(drugNameArr[1].split(",")[1].indexOf("name") + 6);
          obj.effMaterial = drugNameArr[2].split("and")[0].trimStart();
          obj.desc = e.interactionPair[0].description;
          arr2.push(obj);
        });
        setResult(arr2);
        setNoResult(false);
      } else {
        setResult([]);
        setNoResult(true);
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
                        <div className="form-group col-sm-8" id="drug">
                          <label>drugs</label>
                          <AsyncSelect
                            name="drug"
                            isSearchable
                            cacheOptions
                            isMulti
                            loadOptions={searchSuggest}
                            isOptionDisabled={() => selectedDrugs.length >= 50}
                            onChange={(o) => {
                              o ? setSelectedDrugs(o) : setResult();
                            }}
                            isClearable
                            required
                          />
                        </div>
                        <button
                          className="btn btn-dark-red-f-gr mt-4"
                          type="button"
                          onClick={() => {
                            GetInteractions();
                          }}
                        >
                          submit
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="col-sm-12">
                  <div className="card welcome-content-card label-yellow">
                    <div className="card-body">
                      <div className="row">
                        <div style={{ maxWidth: "35%" }} class="col-md-2">
                          <img className="patHomeImg" src={warning} />
                        </div>
                        <div className="col-md-10 welcome-text-wrapper align-self-center">
                          <p>
                            It is not our intention to provide specific medical
                            advice, but rather to provide users with information
                            to better understand their health and their
                            medications. we urges you to consult with a
                            qualified physician for advice about medications.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {result.length > 0 && (
                  <div className="col-sm-12">
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
                  <div className="col-sm-12">
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

export default DrugsInteraction;
