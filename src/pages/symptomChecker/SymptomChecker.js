import React, { useState } from "react";
import Categories from "../../components/Categories.js";
import pulse from "../../images/pulse.png";
import BodyLocationChecker from "./BodyLocationChecker.js";
import DiagnosisChecker from "./DiagnosisChecekr.js";

const SymptomChecker = () => {
  const [type, setType] = useState();
  const [pageView, setPageView] = useState(false);

  let data = [
    ["symptoms", "by symptoms"],
    ["bodyLocation", "by body location"],
  ];

  return (
    <div className="main-content">
      <div className="container-fluid">
        {pageView ? (
          <>{type == "symptoms" ? (<DiagnosisChecker />) : (<BodyLocationChecker/>)}</>
        ) : (
          <div className="section">
            <h1> symptom checker system</h1>
            <Categories
              data={data}
              view={"symp"}
              image={pulse}
              type={setType}
              pageView={setPageView}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SymptomChecker;
