import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { categoriesApi, productsApi, rooms } from "../../adminAPI.js";
import LoadingSpinner from "../../components/Loading.js";
import Search from "../../components/Search.js";
import {
  PagenationNavigate,
  PagenationResult,
} from "../../components/Pagenation.js";
import SortDropdown from "../../components/SortDropdown.js";

const ProductsManager = () => {
  const [loading, setLoading] = useState(false);
  const [pageNo, setPageNo] = useState();
  const [length, setLength] = useState();
  const [srchFilter, setSrchFilter] = useState();
  const [roomList, setRoomList] = useState();
  const [typeValues, setTypeValues] = useState([["all", "all"]]);

  const { state } = useLocation();
  const { type } = useParams();

  let resultLimit = 12;
  let table = ["name", "price", "reserved times", "status", "", ""];
  let sortValues = [
    ["name", "Name ascending"],
    ["-name", "Name descending"],
    ["price", "price ascending"],
    ["-price", "price descending"],
    ["-available", "available"],
    ["available", "unavailable"],
    ["-createdAt", "Newest"],
    ["createdAt", "Oldest"],
  ];

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
    results.unshift(["all", "all"]);
    setTypeValues(results);
  };

  const GetProduct = async () => {
    let currentPage = "";
    document.getElementsByName("page").forEach((e) => {
      if (e.parentElement.classList.contains("active")) {
        currentPage = e.tabIndex;
      }
    });
    setPageNo(currentPage);
    let sort = document.getElementById("sort").value;
    let category = document.getElementById("category").value;
    let body = {
      filter: {
        categoryType: type,
      },
      sort: sort,
      pageNo: currentPage,
      limit: resultLimit,
    };
    srchFilter && (body.filter = srchFilter);
    category != "all" && (body.filter.categoryId = category);
    console.log(body);

    let { message, products, count } = await productsApi(body, "POST", "get");
    console.log(products);
    setRoomList(products);
    setLength(count);
    setLoading(false);
  };

  const editProduct = (o) => {
    let id = o.target.name;
    let elements = o.target.closest("tr").querySelectorAll("input,label");
    let x = false;
    elements.forEach((e, i) => {
      if (e.hasAttribute("disabled")) {
        if (e.tagName == "LABEL") {
          e.addEventListener("click", (d) => {
            if (d.target.getAttribute("data-status") == "true") {
              d.target.setAttribute("data-status", false);
              d.target.classList.remove("label-green");
              d.target.classList.add("label-red");
              d.target.innerText = "unAvailable";
            } else {
              d.target.setAttribute("data-status", true);
              d.target.classList.remove("label-red");
              d.target.classList.add("label-green");
              d.target.innerText = "available";
            }
          });
        }
        e.removeAttribute("disabled");
        o.target.innerText = "submit";
        return (x = false);
      } else {
        return (x = true);
      }
    });
    x && updateProduct(o, id);
  };

  const updateProduct = async (e, id) => {
    let elements = e.target.closest("tr").querySelectorAll("input,label");
    let body = {
      data: {},
      id,
    };
    elements.forEach((o, i) => {
      if (o.name) {
        body.data[o.name] = o.value.toLowerCase();
      } else if (o.tagName == "LABEL") {
        body.data["available"] = o.getAttribute("data-status");
      }
    });
    let update = await productsApi(body, "PUT");
    if (update.message == "product updated") {
      alert(update.message);
    } else {
      alert("something went wrong");
    }
  };

  useEffect(() => {
    setLoading(true);
    GetProduct();
    getCategories();
  }, [srchFilter]);

  return (
    <div className="main-content">
      <div className="container-fluid">
        <div className="section title-section">
          <h5 className="page-title">Products</h5>
        </div>
        <div className="section filters-section">
          <SortDropdown
            sortValues={sortValues}
            setLoading={setLoading}
            GetDetails={GetProduct}
            selOpt={"name"}
          />
          <SortDropdown
            type={true}
            sortValues={typeValues}
            setLoading={setLoading}
            GetDetails={GetProduct}
            selOpt={"all"}
          />
          <Search search={setSrchFilter} type={"product"} />
          <div className="buttons-wrapper ml-auto">
            <Link to={`/admin/addProduct/${type}`}>
              <button className="btn btn-dark-red-f-gr">
                <i className="las la-plus-circle" />
                add a new product
              </button>
            </Link>
          </div>
        </div>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <PagenationResult
              pageNo={pageNo}
              length={length}
              resultLimit={resultLimit}
            />
            <div id="tv" className={`section patients-table-view`}>
              <table className="table table-hover table-responsive-lg">
                <thead>
                  <tr>
                    {table?.map((e) => {
                      return <th>{e}</th>;
                    })}
                  </tr>
                </thead>
                <tbody>
                  {roomList &&
                    roomList.map((p) => {
                      return (
                        <tr id={p._id}>
                          <td>
                            <input
                              className="form-control"
                              disabled
                              required
                              name="name"
                              defaultValue={p.name}
                            />
                            <small className="text-muted">{p._id}</small>
                          </td>
                          <td>
                            <input
                              className="form-control"
                              name="price"
                              disabled
                              required
                              defaultValue={p.price}
                            />
                          </td>
                          <td>{p.sold ? p.sold : "not reserved yet"}</td>
                          <td>
                            <label
                              name="available"
                              class={`label-${
                                p.available ? "green" : "red"
                              } label-md`}
                              data-status={p.available}
                              disabled
                            >
                              {p.available ? "available" : "unAvailable"}
                            </label>
                          </td>
                          <td>
                            <button
                              id="editPat"
                              name={p._id}
                              onClick={(e) => {
                                editProduct(e);
                              }}
                              className="view-more btn btn-sm btn-dark-red-f"
                            >
                              edit
                            </button>
                          </td>
                          <td>
                            <button
                              id="delete"
                              name={p._id}
                              onClick={(e) => {}}
                              className="view-more btn btn-sm btn-red-f-gr"
                            >
                              delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
      <PagenationNavigate
        length={length}
        resultLimit={resultLimit}
        setLoading={setLoading}
        GetDetails={GetProduct}
      />
    </div>
  );
};

export default ProductsManager;
