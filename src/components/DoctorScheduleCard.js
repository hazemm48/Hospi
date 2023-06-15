import React, { useState } from "react";
import Schedule from "./Schedule.js";

const DoctorScheduleCard = ({ user }) => {
  const [scheduleNo, setScheduleNo] = useState(0);

  return (
    <div id="schDet" className="col-sm-12">
      <div className="card">
        <form id="schForm">
          <div className="mini-card">
            <div className="card-body">
              <div className="row" style={{margin:"0px"}}>
                {user.doctorInfo?.schedule.map((e, i) => {
                  return (
                    <Schedule
                      docDetails={true}
                      key={i}
                      schDetails={e}
                      index={i}
                    />
                  );
                })}
                {[...Array(scheduleNo)].map((e, i) => {
                  return <Schedule key={i} />;
                })}
              </div>
            </div>
          </div>
          <button
            id="schBtn"
            className="btn btn-dark-f-gr mt-4"
            type="button"
            hidden
            onClick={() => {
              setScheduleNo(scheduleNo + 1);
            }}
          >
            <i className="las la-plus" />
            Add
          </button>
        </form>
      </div>
    </div>
  );
};

export default DoctorScheduleCard;
