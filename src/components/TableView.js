import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { uploadFile, users } from "../adminAPI";
import manImg from "../images/man.svg";
import moment from "moment";
import LoadingSpinner from "./Loading.js";

const TableView = (props) => {
  const [users, setUsers] = useState(props.data);
  const [table, setTable] = useState();

  let docTable = [
    "name",
    "gender",
    "Date of birth",
    "specialization",
    "phone no.",
    " ",
    " ",
  ];
  let patTable = ["name", "gender", "Date of birth", "age", "email", " "];

  useEffect(() => {
    props.type == "doctor" ? setTable(docTable) : setTable(patTable);
  }, []);

  return (
    <div
      id="tv"
      className={`section patients-table-view ${props.display}`}
    >
      <table className="table table-hover table-responsive-lg">
        <thead>
          <tr>
            {table?.map((e) => {
              return <th>{e}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {users &&
            users.map((user) => {
              return (
                <tr>
                  <td>
                    <img
                      className="rounded-circle"
                      src={user.image ? user.image : manImg}
                      loading="lazy"
                    />
                    <span className="ml-2">{user.name}</span>
                  </td>
                  <td>{user.gender}</td>
                  <td>
                    {moment(user[`${props.type}Info`]?.birthDate).format(
                      "DD/MM/YYYY"
                    )}
                  </td>
                  <td>
                    {props.type == "doctor"
                      ? user.doctorInfo?.speciality
                      : moment().diff(
                          user[`${props.type}Info`]?.birthDate,
                          "years"
                        )}
                  </td>
                  <td>{props.type == "doctor" ? user.phone : user.email}</td>
                  <td>
                    <Link
                      to={`/home/${props.type}Details`}
                      state={user._id}
                      className="view-more btn btn-sm btn-dark-red-f"
                    >
                      view profile
                    </Link>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default TableView;
