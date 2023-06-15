import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { categoriesApi, productsApi } from "../../adminAPI.js";
import LoadingSpinner from "../../components/Loading.js";
import InputsHandler from "../../components/InputsHandler.js";

const AddProduct = () => {
  const [loading, setLoading] = useState(false);
  const [categoryValues, setCategoryValues] = useState([]);

  const htmlData = [
    ["input", "Name", "name", "text"],
    ["input", "Price", "price", "number"],
    ["textarea", "Description", "description", 500],
  ];

  let { type } = useParams();

  const addProduct = async () => {
    let formEl = document.forms.form;
    let formData = new FormData(formEl);
    let body = {
      categoryType: type,
    };
    for (let pair of formData) {
      body[pair[0]] = pair[1];
    }
    body.name = body.name.toLowerCase();
    let add = await productsApi(body, "POST");
    alert(add.message);
    setLoading(false);
  };

  const getCategories = async () => {
    let body = {
      filter: {
        type,
      },
    };
    let { message, results } = await categoriesApi(body, "POST", "get");
    console.log(results);
    results = results.map((e) => {
      return [e._id, e.name];
    });
    setCategoryValues(results);
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <div className="main-content">
      <div className="container-fluid">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="section">
              <h5 className="page-title">Add {type} product</h5>
            </div>
            <div className="section profile-section">
              <div className="card container">
                <div className="card-body">
                  <div className="sub-section col-sm-8 col-md-12 col-lg-8">
                    <div className="sub-section-body">
                      <div className="user-password-form">
                        <form id="form">
                          <InputsHandler handler={htmlData} />
                          <div className="form-group col-sm-5">
                            <label>category</label>
                            <select
                              className="form-control form-select dropdown-toggle"
                              name="categoryId"
                              required
                            >
                              <option disabled selected>
                                -- choose category --
                              </option>

                              {categoryValues.map((e) => {
                                return <option value={e[0]}>{e[1]}</option>;
                              })}
                            </select>
                          </div>
                        </form>
                        <button
                          className="btn btn-dark-red-f-gr mt-4"
                          type="button"
                          onClick={() => {
                            addProduct();
                            setLoading(true);
                          }}
                        >
                          <i className="las la-save" />
                          submit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AddProduct;
