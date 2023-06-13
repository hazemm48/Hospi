import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Categories from "../../components/Categories.js";
import lab from "../../images/8555400.jpg";

const Lab = ({ role }) => {
  let [page, setPage] = useState();
  let navigate = useNavigate();

  let data = [["reserve", "reserve"]];
  if (role == "admin") {
    data.unshift(["category", "Categories"], ["product", "Products"]);
  }

  let GoTo = () => {
    if (page == "reserve") {
      navigate(`/${role}/reserve/lab`);
    } else if (page == "category") {
      navigate(`/admin/categories/lab`,{state:{text:"laboratory category",image:lab}});
    } else if (page == "product") {
      navigate(`/admin/products/lab`);
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
        <Categories view={"lab"} data={data} image={lab} setPage={setPage} page={"main"} />
      </div>
    </div>
  );
};

export default Lab;
