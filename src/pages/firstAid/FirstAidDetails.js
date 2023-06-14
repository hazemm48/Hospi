import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  firstAids,
} from "../../adminAPI.js";
import FilesCard from "../../components/FilesCard.js";
import LoadingSpinner from "../../components/Loading.js";
import InputsHandler from "../../components/InputsHandler.js";

const FirstAidDetails = ({ role }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();

  const { state } = useLocation();
  const htmlData = [
    ["input", "Title", "title", "text"],
    ["textarea", "Description", "description", 3000],
    ["input", "Link", "link", "text"],
  ];
  role == "admin" &&
    htmlData.push(["input", "created at", "createdAt", "date"]);

  let getFirstAidData = async () => {
    let body = {
      filter: {
        _id: state,
      },
    };
    let { aids } = await firstAids(body,"POST","get");
    setData(aids[0]);
    setLoading(false);
  };

  useEffect(() => {
    getFirstAidData();
    setLoading(true);
  }, []);

  const navigate = useNavigate();

  const editFirstAid = () => {
    let elements = document.forms.form.querySelectorAll("input,textarea");
    console.log(elements);
    let x = false;
    elements.forEach((e, i) => {
      if (e.hasAttribute("disabled")) {
        if (!(e.name == "createdAt")) {
          e.removeAttribute("disabled");
          document.getElementById("editPat").innerHTML = "submit";
          return (x = false);
        }
      } else {
        return (x = true);
      }
    });
    x && updateFirstAid();
  };

  const firstAidDelete = async () => {
    if (window.confirm("Are you sure you want to delete this medical record")) {
      let body = {
        id: state,
      };
      let deleted = await firstAids(body, "DELETE");
      alert(deleted.message);
      if (deleted.message == "deleted") {
        navigate(-1);
      }
    }
  };

  const updateFirstAid = async () => {
    let formEl = document.forms.form;
    let formData = new FormData(formEl);
    let obj = {};
    for (const pair of formData.entries()) {
      console.log(pair[0]);
      if (!(pair[0] == "createdAt")) {
        obj[pair[0]] = pair[1];
      }
    }

    let body = {
      id: state,
      data: obj,
    };
    let update = await firstAids(body, "PUT");
    alert(update.message);
    if (update.message == "updated") {
      window.location.reload();
    }
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="main-content">
          {data && (
            <div className="container-fluid">
              <div className="section row title-section">
                <div className="col-md-8">
                  <div aria-label="breadcrumb">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item">
                        <Link to={`/${role}/firstAid`} state={state}>
                          <a>first aids</a>
                        </Link>
                      </li>
                      <li
                        className="breadcrumb-item active"
                        aria-current="page"
                      >
                        {data._id}
                      </li>
                    </ol>
                  </div>
                </div>
                {role == "admin" && (
                  <div className="col-md-4">
                    <button
                      id="editPat"
                      className="btn btn-dark-red-f-gr"
                      onClick={() => {
                        editFirstAid();
                      }}
                    >
                      <i className="las la-edit" />
                      edit first aid
                    </button>
                  </div>
                )}
              </div>
              <div className="section patient-details-section">
                <div className="row">
                  <div className="col-md-8">
                    <div className="row">
                      <div className="col-sm-12">
                        <div className="card container">
                          <div className="card-body">
                            <form id="form">
                              <InputsHandler
                                handler={htmlData}
                                data={data}
                                disable={true}
                              />
                            </form>
                          </div>
                        </div>
                      </div>
                      {role == "admin" && (
                        <div className="col-sm-12">
                          <div className="card">
                            <button
                              className="btn btn-red-f-gr"
                              onClick={() => {
                                firstAidDelete();
                              }}
                            >
                              <i className="las la-trash" />
                              delete first aid
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <FilesCard
                      files={data.files}
                      fieldName={"firstAid"}
                      id={state}
                      role={role}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default FirstAidDetails;
