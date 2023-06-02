import React, { useState } from "react";

const DetailsBottom = ({arr}) => {
  return (
    <>
      {arr.map((e) => {
        return (
          <div className="col-sm-12">
            <div className="card">
              <button className={`btn btn${e[0]}-red-f-gr`} onClick={e[1]}>
                <i className={`las ${e[3]}`} />
                {e[2]}
              </button>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default DetailsBottom;
