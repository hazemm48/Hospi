import React from "react";

const SwitchView = () => {

  let changeView = (e) => {
    let cv = document.getElementById("cv");
    let tv = document.getElementById("tv");
    let tab = document.getElementById("tab");
    let card = document.getElementById("card");
    if (e.target.id == "table-view-btn") {
      tv.classList.remove("no-display");
      cv.classList.add("no-display");
      tab.classList.add("active");
      card.classList.remove("active");
    } else {
      cv.classList.remove("no-display");
      tv.classList.add("no-display");
      tab.classList.remove("active");
      card.classList.add("active");
    }
  };

  return (
    <div className="switch-view-btns">
      <div className="btn-group btn-group-toggle" data-toggle="buttons">
        <label id="card" className="btn btn-darker-grey-o active">
          <input
            id="card-view-btn"
            type="radio"
            name="options"
            defaultChecked
            onClick={(e) => {
              changeView(e);
            }}
          />
          <i className="las la-th-large" />
        </label>
        <label id="tab" className="btn btn-darker-grey-o">
          <input
            id="table-view-btn"
            type="radio"
            name="options"
            onClick={(e) => {
              changeView(e);
            }}
          />
          <i className="las la-list-ul" />
        </label>
      </div>
    </div>
  );
};

export default SwitchView;
