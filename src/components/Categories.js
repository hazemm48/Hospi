import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getGeneral, users } from "../../src/adminAPI";
import stetho from "../images/stetho.png";
import menu from "../images/menu.png";
import moment from "moment";
import LoadingSpinner from "../components/Loading.js";

const Categories = (props) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();
  let navigate = useNavigate();

  console.log(props);
  useEffect(() => {
    if (props.view == "gen") {
      let arr = ["rooms", "first aid", "doctor specialities"];
      setData(arr);
    }
  }, []);

  const GetDetails = async () => {
    let body = {
      filter: props.type,
    };
    let general = await getGeneral(body);
    setData(general.data[0].specialities);
  };

  const categoryValue = (e) => {
    if (props.view == "gen") {
      navigate(`/home/${e.target.getAttribute("name")}`);
    } else {
      let value = e.target.getAttribute("name");
      props.filter(value);
      props.pageView(true);
    }
  };
  useEffect(() => {
    if (props.view == "doc") {
      GetDetails();
    }
  }, []);

  return (
    <React.Fragment>
      <div className="section patients-card-view">
        <div className="row">
          {data?.map((e) => {
            console.log(e);
            return (
              <div className="col-md-3 ">
                <div
                  className="card d-flex align-items-center"
                  name={e}
                  onClick={(e) => {
                    categoryValue(e);
                  }}
                >
                  <div className="card-header" name={e}>
                    <div className="card-img-top" name={e}>
                      <img
                        src={props.view == "gen" ? menu : stetho}
                        loading="lazy"
                        name={e}
                      />
                    </div>
                  </div>
                  <div className="card-body" name={e}>
                    <div className="card-subsection-title" name={e}>
                      <h5 name={e}>{e}</h5>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </React.Fragment>
  );
};

export default Categories;
