import moment from "moment";
import React from "react";

const InputsHandler = (props) => {
  let { data, disable, record } = props;
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
    let endDate = document.querySelector("#endDate");
    if (e.target.value == "false") {
      endDate.style.display = "block";
    } else if (e.target.value == "true") {
      endDate.style.display = "none";
    }
  };

  return (
    <div className="form">
      {data?.map((e) => {
        if (e[0] == "input") {
          if (e[3] == "date" && record) {
            record[e[2]] = moment(record[e[2]]).format("YYYY-MM-DD");
          }
          return (
            <div className="form-group col-sm-8" id={e[2]}>
              <label>{e[1]}</label>
              <input
                className="form-control"
                name={e[2]}
                type={e[3]}
                disabled={disable}
                required
                defaultValue={record ? record[e[2]] : ""}
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
                defaultValue={record ? record[e[2]] : ""}
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
                disabled={disable}
                defaultValue={record ? record[e[2]] : ""}
                rows="3"
                maxlength="100"
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
