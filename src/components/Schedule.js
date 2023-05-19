import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";
import { addUser, getGeneral } from "../adminAPI.js";
import moment from "moment-timezone";

const Schedule = (props) => {
  const [toTime, setToTime] = useState();
  const [fromTime, setFromTime] = useState();
  const [incTime, setIncTime] = useState([]);
  let weekArray = moment.weekdays();
  let schId = props.docDetails ? `schedule${props.index}` : "schedule";

  let setTime = (h, m) => {
    return setHours(setMinutes(new Date(), m), h);
  };

  const seeTime = (time) => {
    setFromTime(time);
    setToTime();
    let momentTime = (t, con) => {
      let mom = moment(time);
      return con == "h"
        ? (mom.add(t, "hours").format("H") * 1)
        : con == "m"
        ? (mom.add(t, "minutes").format("m") * 1)
        : "";
    };
    let arr = [];
    for (let i = 0; i < 3; i++) {
      let fromTimeHour = momentTime(i, "h");
      let fromTimeMinute = momentTime(30, "m");
      arr.push(setTime(fromTimeHour, fromTimeMinute));
      let fromTimeHour2 = momentTime(i + 1, "h");
      let fromTimeMinute2 = momentTime(0, "m");
      arr.push(setTime(fromTimeHour2, fromTimeMinute2));
    }
    setIncTime(arr);
  };

  const removeSch = (e) => {
    e.target.closest(`#${schId}`).remove();
  };

  const change = () => {
    let schedule = document.getElementById(`schedule${props.index}`);
    let daySelect = schedule.querySelector("#day");
    let deleteBtn = schedule.querySelector("#delSchBtn");
    let inputs = schedule.querySelectorAll("input");
    daySelect.setAttribute("disabled", "");
    deleteBtn.setAttribute("hidden", "");
    inputs.forEach((e) => {
      e.setAttribute("disabled", "");
    });
    for (let i = 0; i < daySelect.options.length; i++) {
      if (daySelect.options[i].value == props.schDetails.day) {
        daySelect.options[i].selected = true;
      }
    }
    let momentTime = (t, con) => {
      let mom = moment(t, "HH:mm A");
      return con == "h" ? mom.format("H") : con == "m" ? mom.format("m") : "";
    };
    let fromTimeLocal = setTime(
      momentTime(props.schDetails.time.from, "h"),
      momentTime(props.schDetails.time.from, "m")
    );
    let toTimeLocal = setTime(
      momentTime(props.schDetails.time.to, "h"),
      momentTime(props.schDetails.time.to, "m")
    );
    setFromTime(fromTimeLocal);
    setToTime(toTimeLocal);
    inputs.item(2).value = props.schDetails.limit;
  };

  useEffect(() => {
    props.docDetails && change();
  }, []);

  return (
    <div id={schId} name="schedule" className="form-row">
      <div className="form-group col-sm-5">
        <label>day</label>
        <select
          className="form-control form-select dropdown-toggle"
          name="day"
          id="day"
        >
          {weekArray.map((d) => {
            return <option value={d.toLowerCase()}>{d}</option>;
          })}
        </select>
      </div>
      <div className="form-group col-sm-3">
        <label>From</label>
        <DatePicker
          className="form-control"
          name="from"
          required
          selected={fromTime}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={30}
          timeCaption="Time"
          dateFormat="h:mm aa"
          onChange={(time) => {
            seeTime(time);
          }}
        />
      </div>
      <div className="form-group col-sm-3">
        <label>To</label>
        <DatePicker
          className="form-control"
          name="to"
          required
          selected={toTime}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={30}
          timeCaption="Time"
          dateFormat="h:mm aa"
          includeTimes={incTime}
          onChange={(time) => {
            setToTime(time);
          }}
        />
      </div>
      <div className="form-group col-sm-3">
        <label>Limit</label>
        <input type="number" className="form-control" name="limit" required/>
      </div>
      <div className="form-group col-sm-2">
        <button
          id="delSchBtn"
          className="btn btn-dark-f-gr form-control mt-4"
          type="button"
          style={{ backgroundColor: "crimson" }}
          onClick={(e) => {
            removeSch(e);
          }}
        >
          <i
            className="las la-trash"
            onClick={(e) => {
              removeSch(e);
            }}
          />
        </button>
      </div>
    </div>
  );
};

export default Schedule;
