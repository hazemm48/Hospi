import React from "react";
import Categories from "../../components/Categories.js";
import rad from "../../images/radiation.png";

const Rad = () => {
  let data = [
    ["category", "Categories"],
    ["product", "Products"],
    ["reserve", "reserve"],
  ];
  return (
    <div className="main-content">
      <div className="container-fluid">
        <Categories
          view={"labRad"}
          type={"rad"}
          data={data}
          image={rad}
        />
      </div>
    </div>
  );
};

export default Rad;
