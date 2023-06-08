import React, { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useLocation, useParams } from "react-router-dom";
import { categoriesApi } from "../adminAPI.js";
import LoadingSpinner from "../components/Loading.js";
import InputsHandler from "./InputsHandler.js";

const AddCategory = () => {
  const [loading, setLoading] = useState(false);

  const htmlData = [["input", "Name", "name", "text"]];
  const { state } = useLocation();

  let {type} = useParams()

  const AddCategory = async () => {
    let formEl = document.forms.form;
    let formData = new FormData(formEl);
    let body = {
      name: formData.get("name"),
      type: type,
    };

    body.name = body.name.toLowerCase();

    let add = await categoriesApi(body, "POST");
    alert(add.message);
    setLoading(false);
  };

  return (
    <div className="main-content">
      <div className="container-fluid">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="section">
              <h5 className="page-title">Add {state.text}</h5>
            </div>
            <div className="section profile-section">
              <div className="card container">
                <div className="card-body">
                  <div className="sub-section col-sm-8 col-md-12 col-lg-8">
                    <div className="sub-section-body">
                      <div className="user-password-form">
                        <form id="form">
                          <InputsHandler handler={htmlData} />
                        </form>
                        <button
                          className="btn btn-dark-red-f-gr mt-4"
                          type="button"
                          onClick={() => {
                            AddCategory();
                            setLoading(true);
                          }}
                        >
                          <i className="las la-save" />
                          submit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AddCategory;
