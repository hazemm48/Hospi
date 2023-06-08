import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Categories from "../../components/Categories.js";
import rad from "../../images/radiation.png";

const Rad = ({ role }) => {
  let [page, setPage] = useState();
  let navigate = useNavigate();

  let data = [["reserve", "reserve"]];
  if (role == "admin") {
    data.unshift(["category", "Categories"], ["product", "Products"]);
  }

  let GoTo = () => {
    if (page == "reserve") {
      navigate(`/${role}/reserve`);
    } else if (page == "category") {
      navigate(`/admin/categories/rad`,{state:{text:"radiation category",image:rad}});
    } else if (page == "product") {
      navigate(`/admin/products/rad`);
    }
  };

  useEffect(() => {
    if (page) {
      GoTo();
    }
  }, [page]);

  return (
    <div className="main-content">
      <div className="container-fluid">
        <Categories view={"rad"} data={data} image={rad} setPage={setPage} page={"main"} />
      </div>
    </div>
  );
};

export default Rad;
