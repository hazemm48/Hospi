import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Categories = (props) => {
  const [data, setData] = useState();
  const [image, setImage] = useState();
  let navigate = useNavigate();

  console.log(props);
  useEffect(() => {
      setImage(props.image);
      setData(props.data);
  }, []);

  const categoryValue = (e) => {
    let value = e.target.getAttribute("name");
    if (props.view == "gen") {
      navigate(`/home/${value}`);
    } else if (props.view == "doc") {
      props.filter(value);
      props.pageView(true);
    } else if (props.view == "medic") {
      props.type(value);
      props.pageView(true);
    } else if (props.view == "aid") {
      navigate("/home/firstAidDetails", { state: value });
    }
  };

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
