import React from "react";
import Categories from "../components/Categories.js";
import menu from "../images/menu.png";

const General = () => {
  let data = [
    ["rooms", "rooms"],
    ["firstAid", "first aid"],
    ["doctor_specialities", "doctor specialities"],
  ];
  return (
    <div className="main-content">
      <div className="container-fluid">
        <Categories data={data} view={"gen"} image={menu}/>
      </div>
    </div>
  );
};

export default General;
