import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { firstAids } from "../../adminAPI.js";
import Categories from "../../components/Categories.js";
import LoadingSpinner from "../../components/Loading.js";
import { PagenationResult } from "../../components/Pagenation.js";
import Search from "../../components/Search.js";
import aid from "../../images/firstAid.png";

const FirstAid = () => {
  const [loading, setLoading] = useState(false);
  const [length, setLength] = useState();
  const [data, setData] = useState([]);
  const [srchFilter, setSrchFilter] = useState();
  let { state } = useLocation();

  let getFirstAidData = async () => {
    console.log(state);
    let body = {
      filter: {},
    };
    srchFilter && (body.filter = srchFilter);
    let { aids, message } = await firstAids(body, "POST", "get");
    let dataArr = [];
    if (message == "found") {
      aids.map((e) => {
        let arr = [e._id, e.title];
        dataArr.push(arr);
      });
    }
    setData(dataArr);
    setLength(dataArr.length);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    getFirstAidData();
  }, [srchFilter]);

  return (
    <div className="main-content">
      <div className="container-fluid">
        <div className="section title-section">
          <h5 className="page-title">First Aids</h5>
        </div>
        <div className="section filters-section">
          <Search search={setSrchFilter} type={"aid"} />
          <div className="buttons-wrapper ml-auto">
            <Link to="/home/addFirstAid">
              <button className="btn btn-dark-red-f-gr">
                <i className="las la-plus-circle" />
                add a new first aid
              </button>
            </Link>
          </div>
        </div>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <PagenationResult pageNo={0} length={length} />
            <Categories view={"aid"} data={data} image={aid} />
          </>
        )}
      </div>
    </div>
  );
};

export default FirstAid;
