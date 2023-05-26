import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getGeneral } from "../../src/adminAPI";
import stetho from "../images/stetho.png";
import menu from "../images/menu.png";
import record from "../images/patient.png";

const Categories = (props) => {
  const [data, setData] = useState();
  const [image, setImage] = useState();
  let navigate = useNavigate();

  console.log(props);
  useEffect(() => {
    if (props.view == "gen") {
      let arr = ["rooms", "first aid", "doctor specialities"];
      setImage(menu);
      setData(arr);
    } else if (props.view == "medic") {
      let arr = [
        "diagonse",
        "medication_details",
        "radiation_result",
        "lab_result",
        "operation",
      ];
      setData(arr);
      setImage(record);
    }
  }, []);

  const GetDetails = async () => {
    let body = {
      filter: props.type,
    };
    let general = await getGeneral(body);
    setData(general.data[0].specialities);
    setImage(stetho);
  };

  const categoryValue = (e) => {
    let value = e.target.getAttribute("name");
    if (props.view == "gen") {
      navigate(`/home/${value}`);
    } else if (props.view == "doc") {
      props.filter(value);
      props.pageView(true);
    } else if (props.view == "medic") {
      console.log(value);
      props.type(value);
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
                      <img src={image} loading="lazy" name={e} />
                    </div>
                  </div>
                  <div className="card-body" name={e}>
                    <div className="card-subsection-title" name={e}>
                      <h5 name={e}>{e.replace("_", " ")}</h5>
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
