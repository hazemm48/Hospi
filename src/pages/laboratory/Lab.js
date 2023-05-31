import React from "react";
import Categories from "../../components/Categories.js";
import lab from "../../images/beaker.png";

const Lab= () => {
  let data = [
    ["add", "add Category"],
    ["reserve", "reserve"],
  ];
  return (
    <div className="main-content">
      <div className="container-fluid">
        <Categories
          view={"labRad"}
          type={"lab"}
          data={data}
          image={lab}
        />
      </div>
    </div>
  );
};

export default Lab;
