import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getGeneral } from "../../src/adminAPI";
import stetho from "../images/stetho.png";
import menu from "../images/menu.png";
import record from "../images/patient.png";
import aid from "../images/firstAid.png";

const Categories = (props) => {
  const [data, setData] = useState();
  const [image, setImage] = useState();
  let navigate = useNavigate();

  console.log(props);
  useEffect(() => {
    if (props.view == "gen") {
      let arr = [
        ["rooms", "rooms"],
        ["firstAid", "first aid"],
        ["doctor_specialities", "doctor specialities"],
      ];
      setImage(menu);
      setData(arr);
    } else if (props.view == "medic") {
      setData([
        ["diagnose", "diagnose"],
        ["medication_details", "medication details"],
        ["radiation_result", "radiation result"],
        ["lab_result", "lab result"],
        ["operation", "operation"],
      ]);
      setImage(record);
    } else if (props.view == "aid") {
      setData(props.data);
      setImage(aid);
    }
  }, []);

  const GetDetails = async () => {
    let body = {
      filter: props.type,
    };
    let general = await getGeneral(body);
    let data = general.data[0].specialities
    let dataArr = []
    data.map((e)=>{
      let arr = [e,e]
      dataArr.push(arr)
    })
    setData(dataArr);
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
    } else if (props.view == "aid") {
      navigate("/home/firstAidDetails", { state: value });
    }
  };
  useEffect(() => {
    if (props.view == "doc") {
      GetDetails();
    }
  }, []);

  return (
    <>
      <div className="section patients-card-view">
        <div className="row">
          {data?.map((e) => {
            return (
              <div className="col-md-3 ">
                <div
                  className="card d-flex align-items-center"
                  name={e[0]}
                  onClick={(d) => {
                    categoryValue(d);
                  }}
                >
                  <div className="card-header" name={e[0]}>
                    <div className="card-img-top" name={e[0]}>
                      <img src={image} loading="lazy" name={e[0]} />
                    </div>
                  </div>
                  <div className="card-body" name={e[0]}>
                    <div className="card-subsection-title" name={e[0]}>
                      <h5 name={e[0]}>{e[1]}</h5>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Categories;
