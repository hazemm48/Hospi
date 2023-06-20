import React from "react";
import { Link, NavLink } from "react-router-dom";
import sideNavData from "./SideNavData.js";

const SideNav = ({ role, superAdmin, id }) => {
  superAdmin && (role = "superAdmin");
  let data = sideNavData(role);
  return (
    <div className="side-nav">
      <ul className="list-group list-group-flush">
        {data.map((e) => {
          return (
            <NavLink
              to={e[0]}
              state={id ? id : false}
              className="list-group-item"
              data-toggle="tooltip"
              data-placement="bottom"
            >
              <i className={`las ${e[1]} la-lw`} />
              <span>{e[2]}</span>
            </NavLink>
          );
        })}
      </ul>
    </div>
  );
};

export default SideNav;
