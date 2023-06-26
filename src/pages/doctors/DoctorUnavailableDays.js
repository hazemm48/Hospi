import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { docUnavailableDates } from "../../adminAPI.js";

const DoctorsUnavailableDays = (props) => {
  const [startDate, setStartDate] = useState();
  const [unDates, setUnDates] = useState(props.dates);
  const [excludeDates, setExcludeDates] = useState([]);

  const isWeekday = (date) => {
    let days = [];
    props.days.map((e, i) => {
      let weekDayIndex = e.day.charAt(0).toUpperCase() + e.day.slice(1);
      days.push(moment.weekdays().indexOf(weekDayIndex));
    });
    const day = date.getDay(date);
    return days.includes(day);
  };

  useEffect(() => {
    if (unDates) {
      setExcludeDates(
        unDates.map((e) => {
          return moment(e).toDate();
        })
      );
    }
  }, [unDates]);

  const addDate = async () => {
    let body = {
      id: props.id,
      date: moment(startDate).format("MM-DD-YYYY"),
    };
    let add = await docUnavailableDates(body, "add");
    if (add.message == "added") {
      setUnDates(add.dates);
    }
    console.log(add.dates);
  };
  useEffect(() => {
    if (startDate) {
      addDate();
    }
  }, [startDate]);

  const removeDate = async (e) => {
    console.log(moment(startDate).format("MM-DD-YYYY"));
    let body = {
      id: props.id,
      date: moment(e).format("MM-DD-YYYY"),
    };
    let remove = await docUnavailableDates(body, "remove");
    if (remove.message == "deleted") {
      setUnDates(remove.dates);
    }
    console.log(remove);
  };
  console.log(unDates);

  return (
    <div className="card files-card">
      <div className="card-header">
        <h5>Unavailable Days</h5>
        <div>
          <DatePicker
            id="unDate"
            placeholderText="choose unAvailable day"
            minDate={moment()._d}
            maxDate={moment().add(2, "months")._d}
            dateFormat="dd-MM-yyyy"
            className="form-control"
            selected={startDate}
            onChange={setStartDate}
            excludeDates={excludeDates}
            required
            filterDate={isWeekday}
            name="date"
          />
        </div>
      </div>

      <div className="card-body">
        <div className="list-group list-group-flush">
          {unDates.length > 0 &&
            unDates.map((e) => {
              return (
                <div className="list-group-item">
                  <i className="las la-date" />
                  {moment(e).format("DD-MM-YYYY")}
                  <div className="float-right">
                    <div className="action-buttons no-display">
                      <button
                        className="btn btn-sm btn-dark-red-f"
                        data-id={e}
                        onClick={() => {
                          removeDate(e);
                        }}
                      >
                        <i className="las la-trash" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default DoctorsUnavailableDays;
