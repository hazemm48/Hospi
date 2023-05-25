import moment from "moment";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Categories from "../components/Categories.js";
import LoadingSpinner from "../components/Loading.js";

const General = () => {
  let { state } = useLocation();

  const [loading, setLoading] = useState(true);

  useEffect(() => {}, []);

  return (
    <div className="main-content">
      <div className="container-fluid">
        <Categories
          view={"gen"}
        />
      </div>
    </div>
  );
};

export default General;
