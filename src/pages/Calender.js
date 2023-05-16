import React, { createRef, useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { reserve } from "../adminAPI.js";
import moment from "moment";
import { useLocation, useNavigate } from "react-router-dom";

const Calendar = (props) => {
  const [reserves, setReserves] = useState();
  const [events, setEvents] = useState();
  const [month, setMonth] = useState(moment().get("month") + 1);
  const [year, setYear] = useState(moment().get("year"));

  let navigate = useNavigate();

  let calenderRef = React.createRef();

  const GetReserves = async () => {
    let data = { month: month, year: year };
    if(props.filter){
      data.filter=props.filter
    }
    let body = {
      oper: "get",
      data: data
    };
    let reserves = await reserve(body);
    let result = reserves.reservations;
    setReserves(result);
  };

  let addEvents = () => {
    let obj = [];
    reserves.map((e) => {
      let start = `${moment(e.date).format("YYYY-MM-DD")} ${e.time.from}`;
      let end = `${moment(e.date).format("YYYY-MM-DD")} ${e.time.to}`;
      console.log();
      obj.push({ id: e._id, title: `${e.type} reserve`, start, end });
    });
    setEvents(obj);
  };

  useEffect(() => {
    GetReserves();
  }, [month]);

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
    navigate("/home/reserveDetails", {
      state,
    });
  };

  let handleDateChange = (args) => {
    let date = moment(args.start);
    setMonth(date.get("month") + 1);
    setYear(date.get("year"));
  };

  return (
    <div className="main-content">
      <div className="container-fluid">
        <div className="section">
          <div className="App">
            <FullCalendar
              ref={calenderRef}
              plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              initialDate={moment().toDate()}
              selectable={true}
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
