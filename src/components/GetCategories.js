import React, { useState, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { categoriesApi } from "../adminAPI.js";
import Categories from "../components/Categories.js";
import LoadingSpinner from "../components/Loading.js";
import { PagenationResult } from "../components/Pagenation.js";

const GetCategories = ({ role }) => {
  const [loading, setLoading] = useState(false);
  const [length, setLength] = useState();
  const [data, setData] = useState([]);
  let { state } = useLocation();
  let { type } = useParams();

  let getCategoriesData = async () => {
    let body = {
      filter: {
        type: type,
      },
    };
    let { results, message } = await categoriesApi(body, "POST", "get");
    let dataArr = [];
    console.log(results, message);

    if (message == "done") {
      results.map((e) => {
        let arr = [e._id, e.name];
        dataArr.push(arr);
      });
    }
    setData(dataArr);
    setLength(dataArr.length);
    setLoading(false);
  };

  let deleteCategory = async (e) => {
    let body = {
      id: e,
    };
    if (window.confirm("are you sure you want to delete")) {
      let { message } = await categoriesApi(body, "DELETE");
      alert(message);
      if (message == "deleted") {
        window.location.reload();
      }
      console.log(message);
    }
  };

  useEffect(() => {
    setLoading(true);
    getCategoriesData();
  }, []);

  return (
    <div className="main-content">
      <div className="container-fluid">
        <div className="section title-section">
          <h5 className="page-title">{state.text}</h5>
        </div>
        <div className="section filters-section">
          {role == "admin" && (
            <div className="buttons-wrapper ml-auto">
              <Link
                to={`/admin/addCategory/${type}`}
                state={{ text: state.text }}
              >
                <button className="btn btn-dark-red-f-gr">
                  <i className="las la-plus-circle" />
                  add a new {state.text}
                </button>
              </Link>
            </div>
          )}
        </div>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <PagenationResult pageNo={0} length={length} />
            <Categories
              view={type}
              data={data}
              image={state.image}
              role={role}
              deleteCategory={deleteCategory}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default GetCategories;
