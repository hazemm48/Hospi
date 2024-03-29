import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import LoadingSpinner from "../../components/Loading.js";
import { categoriesApi, productsApi, reserve, users } from "../../adminAPI.js";
import moment from "moment";
import WarningCard from "../../components/WarningCard.js";

const Reservation = ({ role, type }) => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [startDate, setStartDate] = useState();
  const [selectedProduct, setSelectedProduct] = useState();
  const [productFees, setProductFees] = useState([]);
  const [selectedProductFees, setSelectedProductFees] = useState(0);
  const [selectedProductPrecaution, setSelectedProductPrecaution] = useState();
  const [productPrecautions, setProductPrecautions] = useState([]);

  const GetCategories = async () => {
    let body = {
      filter: {
        type,
      },
    };
    let { message, results } = await categoriesApi(body, "POST", "get");
    results = results.map((e) => {
      return {
        value: e._id,
        label: e.name,
      };
    });
    setCategories(results);
    setProducts([]);
    setSelectedProduct();
    setLoading(false);
  };

  const GetProducts = async (o) => {
    if (o) {
      let body = {
        filter: {
          categoryId: o.value,
          available: true,
        },
      };
      let { message, products } = await productsApi(body, "POST", "get");
      console.log(products);
      let arr = [];
      let arr2 = [];
      products &&
        (products = products.map((e) => {
          arr.push([e._id, e.price]);
          arr2.push([e._id, e.precaution]);
          return {
            value: e._id,
            label: e.name,
          };
        }));
      setProducts(products);
      setProductFees(arr);
      setProductPrecautions(arr2);
    } else {
      setProducts([]);
    }
  };

  useEffect(() => {
    GetCategories();
    setLoading(true);
  }, [type]);

  const getFees = () => {
    let fees = productFees.find((e) => {
      return e[0] == selectedProduct.value;
    });
    setSelectedProductFees(fees[1]);
    console.log(fees);
  };
  const getPrecaution = () => {
    let precaution = productPrecautions.find((e) => {
      return e[0] == selectedProduct.value;
    });
    !precaution[1] && (precaution[1] = "no precautions");
    setSelectedProductPrecaution(precaution[1]);
    console.log(precaution);
  };

  useEffect(() => {
    if (selectedProduct) {
      getFees();
      getPrecaution();
    } else {
      setSelectedProductFees(0);
      setSelectedProductPrecaution();
    }
  }, [selectedProduct]);

  const submit = async () => {
    console.log("asd");
    let formEl = document.forms.form;
    let formData = new FormData(formEl);
    let data = {};
    for (const pair of formData.entries()) {
      data[pair[0]] = pair[1];
    }
    data.type = type;
    data.anotherPerson = JSON.parse(data.anotherPerson);
    data.productName = selectedProduct.label;
    let filter = {};
    data.email && role == "admin" && (filter.email = data.email);
    data.phone && role == "admin" && (filter.phone = data.phone);
    if (filter) {
      let user = await users(filter);
      if (user.users.length > 0) {
        data.patientId = user.users[0]._id;
      }
    }
    let body = {
      oper: "reserve",
      data,
    };
    let reserveData = await reserve(body);
    if (reserveData.message == "booked" && type == "doctor") {
      alert(reserveData.message + `\nTurn : ${reserveData.add[0].turnNum}`);
    } else {
      alert(reserveData.message);
    }
    setLoading(false);
  };

  return (
    <div className="main-content">
      <div className="container-fluid">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="section patient-details-section">
            <div className="card ">
              <h3>{type} Reserve</h3>
              <div className="">
                <div
                  id="editDet"
                  className="col d-flex justify-content-center res"
                >
                  <form
                    id="form"
                    onSubmit={(e) => {
                      submit();
                      e.preventDefault();
                      setLoading(true);
                    }}
                  >
                    <div className="mini-card">
                      <div className="card-body">
                        <div className="row justify-content-center">
                          <div className="col-md-4">
                            <div className="form-group">
                              <label>patient name</label>
                              <input
                                name="patName"
                                className="form-control"
                                required
                                pattern="[A-Za-z ]{3,40}"
                                defaultValue="Patient"
                              />
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="form-group">
                              <label>category</label>
                              <Select
                                key="category"
                                options={categories}
                                onChange={(o) => {
                                  setSelectedProduct('')
                                  GetProducts(o);
                                }}
                                isSearchable
                                isClearable
                                required
                              />
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="form-group">
                              <label>
                                {type == "lab" ? "analysis" : "radiation"}
                              </label>
                              <Select
                                name="productId"
                                key="product"
                                options={products}
                                onChange={(o) => {
                                  setSelectedProduct(o);
                                }}
                                isSearchable
                                value={selectedProduct}
                                isClearable
                                required
                              />
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="form-group">
                              <label>fees</label>
                              <input
                                value={selectedProductFees}
                                name="fees"
                                id="fees"
                                readOnly={role == "admin" ? false : true}
                                className="form-control"
                                required
                              />
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="form-group">
                              <label>date</label>
                              <DatePicker
                                placeholderText="choose date"
                                minDate={moment()._d}
                                maxDate={moment().add(2, "weeks")._d}
                                dateFormat="dd-MM-yyyy"
                                className="form-control"
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                required
                                name="date"
                              />
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="form-group">
                              <label>another person</label>
                              <select
                                className="form-control form-select dropdown-toggle"
                                name="anotherPerson"
                                required
                              >
                                <option value={false}>no</option>
                                <option value={true}>yes</option>
                              </select>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="form-group">
                              <label>phone</label>
                              <input name="phone" className="form-control" />
                            </div>
                          </div>
                          {role == "admin" && (
                            <>
                              <div className="col-md-4">
                                <div className="form-group">
                                  <label>email</label>
                                  <input
                                    name="email"
                                    className="form-control"
                                  />
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="form-group">
                                  <label>patient id</label>
                                  <input
                                    name="patientId"
                                    className="form-control"
                                  />
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                        <div className="card-footer">
                          <div className="d-flex justify-content-center">
                            <input
                              id="submit"
                              type="submit"
                              defaultValue="submit"
                              className="btn btn-dark-red-f-gr col-md-2"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            {selectedProductPrecaution && (
              <div className="col-sm-12">
                <WarningCard text={selectedProductPrecaution} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reservation;
