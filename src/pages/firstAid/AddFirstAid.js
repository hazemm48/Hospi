import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addUser, firstAids, rooms, uploadFile } from "../../adminAPI.js";
import LoadingSpinner from "../../components/Loading.js";
import InputsHandler from "../../components/InputsHandler.js";

const AddFirstAid = () => {
  const [loading, setLoading] = useState(false);

  const htmlData = [
    ["input", "Title", "title", "text"],
    ["textarea", "Description", "description", 3000],
    ["input", "Link", "link", "text"],
  ];

  const navigate = useNavigate();

  const AddAid = async () => {
    let formEl = document.forms.form;
    let formData = new FormData(formEl);
    let body = {
      file: [],
    };
    for (const pair of formData.entries()) {
      if (pair[0] == "file") {
        body["file"].push(pair[1]);
      } else {
        body[pair[0]] = pair[1];
      }
    }
    body.title = body.title.toLowerCase();
    let files = body.file;
    delete body.file;

    let add = await firstAids(body, "POST");
    alert(add.message);

    if (add.message == "added") {
      if (addFiles(files, add.added[0]._id)) {
        navigate("/home/firstAidDetails", { state: add.added[0]._id });
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  let addFiles = async (files, id) => {
    let formData = new FormData();
    formData.append("fieldName", "firstAid");
    formData.append("id", id);
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }
    let add = await uploadFile(formData, "uploadFiles");
    return true;
  };

  return (
    <div className="main-content">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="container-fluid">
          <div className="section">
            <h5 className="page-title">Add First Aid</h5>
          </div>
          <div className="section profile-section">
            <div className="card container">
              <div className="card-body">
                <div className="sub-section col-sm-8 col-md-12 col-lg-8">
                  <div className="sub-section-body">
                    <div className="user-password-form">
                      <form id="form">
                        <InputsHandler handler={htmlData} />
                        <div className="form-group col-sm-8">
                          <label>upload images</label>
                          <input
                            className="form-control"
                            name="file"
                            type="file"
                            multiple
                            accept="image/*"
                            required
                          />
                        </div>
                      </form>
                      <button
                        className="btn btn-dark-red-f-gr mt-4"
                        type="button"
                        onClick={() => {
                          AddAid();
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
        </div>
      )}
    </div>
  );
};

export default AddFirstAid;
