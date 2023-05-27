import React from "react";

const InputsHandler = (props) => {

  const viewStill = (e) => {
    let still = document.querySelector("#still");
    if (e.target.value == "true") {
      still.style.display = "none";
      viewEndDate(e);
    } else if (e.target.value == "false") {
      still.style.display = "block";
      viewEndDate(e);
    }
  };

  const viewEndDate = (e) => {
    let endDate = document.querySelector("#endDate");
    if (e.target.value == "false") {
      endDate.style.display = "block";
    } else if (e.target.value == "true") {
      endDate.style.display = "none";
    }
  };

  return (
    <form id="form">
      <div className="form">
        {props.data?.map((e) => {
          if (e[0] == "input") {
            return (
              <div className="form-group col-sm-8" id={e[2]}>
                <label>{e[1]}</label>
                <input
                  className="form-control"
                  name={e[2]}
                  type={e[3]}
                  required
                />
              </div>
            );
          } else if (e[0] == "select") {
            return (
              <div className="form-group col-sm-3" id={e[2]}>
                <label>{e[1]}</label>
                <select
                  className="form-control form-select dropdown-toggle"
                  name={e[2]}
                  required
                  onChange={(d) => {
                    console.log(d[2]);
                    if (e[2] == "chronic") {
                      return viewStill(d);
                    } else {
                      return viewEndDate(d);
                    }
                  }}
                >
                  <option value="false">no</option>
                  <option value="true">yes</option>
                </select>
              </div>
            );
          } else if (e[0] == "textarea") {
            return (
              <div className="form-group col-sm-8">
                <label>{e[1]}</label>
                <textarea
                  className="form-control "
                  rows="3"
                  maxlength="100"
                  name={e[2]}
                  required
                />
              </div>
            );
          }
        })}
        <div className="form-group col-sm-8">
          <label>upload files</label>
          <input
            className="form-control"
            name="file"
            type="file"
            multiple
            accept="image/*,application/pdf"
            required
          />
        </div>
      </div>
    </form>
  );
};

export default InputsHandler;
