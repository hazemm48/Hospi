import React from "react";
import Categories from "../../components/Categories.js";
import lab from "../../images/lab-technician.png";

const Lab= ({role}) => {
  let data = [["reserve", "reserve"]];
  if (role == "admin") {
    data.push(["category", "Categories"], ["product", "Products"]);
  }
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
