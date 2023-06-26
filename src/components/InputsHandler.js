import moment from "moment";
import React from "react";

const InputsHandler = (props) => {
  let { handler, disable, data } = props;
  console.log(data);
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
    console.log(e.target.name);
    let endDate = document.querySelector("#endDate");
    if (e.target.value == "false") {
      endDate.style.display = "block";
      document.getElementsByName("endDate")[0].required = true;
    } else if (e.target.value == "true") {
      endDate.style.display = "none";
      document.getElementsByName("endDate")[0].required = false;
    }
  };

  return (
    <div className="form">
      {handler?.map((e) => {
        if (e[0] == "input") {
          if (e[3] == "date" && data) {
            data[e[2]] = moment(data[e[2]]).format("YYYY-MM-DD");
          }
          return (
            <div className="form-group col-sm-8" id={e[2]}>
              <label>{e[1]}</label>
              <input
                className="form-control"
                name={e[2]}
                type={e[3]}
                disabled={disable}
                required={e[2] != "doctorName" ? true : false}
                defaultValue={data ? data[e[2]] : ""}
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
                disabled={disable}
                required
                defaultValue={data ? data[e[2]] : ""}
                onChange={(d) => {
                  if (d.target.name != "show") {
                    if (e[2] == "chronic") {
                      return viewStill(d);
                    } else {
                      return viewEndDate(d);
                    }
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
                disabled={disable}
                defaultValue={data ? data[e[2]] : ""}
                rows="6"
                maxlength={e[3]}
                name={e[2]}
                required
              />
            </div>
          );
        }
      })}
    </div>
  );
};

export default InputsHandler;
