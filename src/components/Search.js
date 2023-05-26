import React, { useEffect, useState } from "react";

const Search = (props) => {
  let options = ["all", "id", "name"];

  if (props.type == "room") {
    options.push("level", "type");
  } else {
    options.push("email");
  }

  let searchData = () => {
    let formEl = document.forms.search;
    let formData = new FormData(formEl);
    let searchIn = formData.get("search");
    let srchSlct = formData.get("srchSlct");
    let data = {};
    if (
      !(
        (srchSlct == "_id" && (searchIn.length < 24 || searchIn.length > 24)) ||
        srchSlct == "all"
      )
    ) {
      data[srchSlct] = searchIn;
      props.search(data);
    }
    if (srchSlct == "all") {
      formEl.querySelector("input").value = "";
      props.search();
    }
  };

  return (
    <form id="search" method="post" className="ml-auto">
      <div className="form">
        <div className="form-group col-sm-12">
          <div className="input-group ">
            <div class="input-group-append">
              <select class="input-group-text" name="srchSlct" required>
                {options.map((e) => {
                  return <option value={e}>{e.toUpperCase()}</option>;
                })}
              </select>
            </div>
            <input name="search" className="form-control" />
            <div class="input-group-append">
              <button
                type="button"
                className="input-group-text"
                id="basic-addon2"
                onClick={() => {
                  searchData();
                }}
              >
                <i className="las la-search" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Search;
