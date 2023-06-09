import React, { useEffect, useState } from "react";
import Categories from "../../components/Categories.js";
import LoadingSpinner from "../../components/Loading.js";
import pulse from "../../images/checkup.png";
import { apiMedicLogin } from "../../SymptomCheckerApi.js";
import DiagnosisChecker from "./DiagnosisChecekr.js";

const SymptomChecker = () => {
  const [type, setType] = useState();
  const [pageView, setPageView] = useState(false);
  const [loading, setLoading] = useState(false);

  let data = [
    ["symptoms", "by symptoms"],
    ["bodyLocation", "by body location"],
  ];

  const apiLogin = async () => {
    await apiMedicLogin();
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    apiLogin();
  }, []);

  return (
    <div className="main-content">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="container-fluid">
          {pageView ? (
            <DiagnosisChecker type={type} />
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
      )}
    </div>
  );
};

export default SymptomChecker;
