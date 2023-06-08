import React, { createRef, useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { reserve } from "../adminAPI.js";
import moment from "moment";
import "bootstrap-icons/font/bootstrap-icons.css";
import bootstrap5Plugin from "@fullcalendar/bootstrap5";
import { useNavigate } from "react-router-dom";

const Calendar = (props) => {
  const [reserves, setReserves] = useState();
  const [events, setEvents] = useState();
  const [month, setMonth] = useState(moment().get("month") + 1);
  const [year, setYear] = useState(moment().get("year"));
  const [type, setType] = useState();
  const [cusBtns, setCusBtns] = useState();
  const [startDate, setStartDate] = useState(moment().toDate());

  let navigate = useNavigate();

  let calenderRef = React.createRef();

  useEffect(() => {
      let arr = ["all", "doctor", "lab", "rad"];
      let obj = {};
      arr.map((e) => {
        obj[e] = {
          text: e,
          click: () => {
            setType(e);
          },
        };
      });
      setCusBtns(obj);
  }, []);

  const GetReserves = async () => {
    let data = { month: month, year: year };
    if (props.filter) {
      data.filter = props.filter;
    }
    if (type && type != "all") {
      data.filter = { ...data.filter, type: type };
    }
    let body = {
      oper: "get",
      data: data,
    };
    let reserves = await reserve(body);
    let result = reserves.reservations;
    setReserves(result);
  };

  let addEvents = () => {
    let obj = [];
    reserves.map((e) => {
      let eventObj = {
        id: e._id,
        title: `${e.type} reserve`,
        display: "block",
      };
      if (e.type == "doctor") {
        let start = `${moment(e.date).format("YYYY-MM-DD")} ${moment(
          e.time.from,
          "h:mm A"
        ).format("HH:mm")}`;
        let end = `${moment(e.date).format("YYYY-MM-DD")} ${moment(
          e.time.to,
          "h:mm A"
        ).format("HH:mm")}`;
        eventObj.start = start;
        eventObj.end = end;
      } else {
        let start = moment(e.date).format("YYYY-MM-DD");
        eventObj.start = start;
      }

      obj.push(eventObj);
    });
    setEvents(obj);
  };

  useEffect(() => {
    GetReserves();
  }, [month, type]);

  useEffect(() => {
    if (reserves) {
      addEvents();
    }
  }, [reserves]);

  let handleDateClick = (args) => {
    let calenderApi = calenderRef.current.getApi();
    calenderApi.changeView("timeGridDay", args);
  };

  const handleEventClick = (args) => {
    let state = args.event.id;
    navigate(`/${props.role}/reserveDetails`, {
      state,
    });
  };

  let handleDateChange = (args) => {
    console.log(args);
    setStartDate(args.start)
    let date = moment(args.start);
    setMonth(date.get("month") + 1);
    setYear(date.get("year"));
  };
console.log(startDate);
  return (
    <div className="main-content">
      <div className="container-fluid">
          <div className="section">
            <div className="App">
              <FullCalendar
                ref={calenderRef}
                customButtons={cusBtns}
                plugins={[
                  dayGridPlugin,
                  interactionPlugin,
                  timeGridPlugin,
                  bootstrap5Plugin,
                ]}
                headerToolbar={{
                  left: "prev,next today all,doctor,lab,rad",
                  center: "title",
                  right: "dayGridMonth,timeGridWeek,timeGridDay",
                }}
                initialDate={startDate}
                selectable={true}
                themeSystem={"bootstrap5"}
                initialView={"dayGridMonth"}
                datesSet={handleDateChange}
                showNonCurrentDates={false}
                events={events}
                eventClick={handleEventClick}
                navLinks={true}
                navLinkDayClick={handleDateClick}
                dayMaxEventRows={4}
              />
            </div>
          </div>
      </div>
    </div>
  );
};

export default Calendar;
