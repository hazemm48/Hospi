import moment from "moment";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { note } from "../adminAPI.js";
import LoadingSpinner from "../components/Loading.js";

const Notes = () => {
  let { state } = useLocation();

  const [notes, setNotes] = useState();
  const [loading, setLoading] = useState(false);

  const GetNotes = async () => {
    let body = {
      query: `filter[userId]=${state}`,
      data: {
        method: "GET",
      },
    };
    let noteData = await note(body);
    setNotes(noteData.notes);
    setLoading(false);
  };

  const editNote = async ({ e, id }) => {
    let content = e.target.previousSibling;
    if (e.target.hasAttribute("data-edit")) {
      content.removeAttribute("readOnly");
      e.target.removeAttribute("data-edit");
      e.target.innerHTML = "submit";
    } else {
      content.setAttribute("readOnly", true);
      e.target.setAttribute("data-edit", true);
      e.target.innerHTML = "Edit";
      let body = {
        data: {
          method: "PUT",
          body: JSON.stringify({
            content: content.value,
            id: id,
          }),
        },
      };
      let update = await note(body);
      alert(update.message);
    }
  };
  const deleteNote = async (id) => {
    if (window.confirm("Are you sure you want to delete this note")) {
      let body = {
        data: {
          method: "DELETE",
          body: JSON.stringify({
            id: id,
          }),
        },
      };
      await note(body);
      GetNotes();
    }
  };

  useEffect(() => {
    setLoading(true);
    GetNotes();
  }, []);

  return (
    <div className="main-content">
      <div className="container-fluid">
        {loading ? (
          <LoadingSpinner />
        ) : (
          notes && (
            <div className="section patient-details-section">
              <h1 style={{ textAlign: "center", marginBottom: "0.5em" }}>
                Notes
              </h1>
              <div className="row">
                {notes.map((n) => {
                  return (
                    <div className="col-md-4">
                      <div className="card notes-card">
                        <div className="card-header">
                          <div className="float-left">
                            <p>{n._id}</p>
                          </div>
                          <div className="float-right">
                            <button
                              className="btn btn-dark-red-f btn-sm"
                              onClick={(e) => {
                                deleteNote(n._id);
                              }}
                              data-edit
                            >
                              <i className="las la-trash" />
                              delete note
                            </button>
                          </div>
                        </div>
                        <div className="card-body">
                          <textarea
                            className="form-control"
                            placeholder="you can write patient notes over here"
                            rows={12}
                            readOnly
                            defaultValue={n.content}
                          />
                          <button
                            className="btn btn-dark-red-f float-right btn-sm"
                            onClick={(e) => {
                              editNote({ e, id: n._id });
                            }}
                            data-edit
                          >
                            <i className="las la-save" />
                            edit note
                          </button>
                        </div>
                        <div className="card-footer">
                          <div className="float-left">
                            <p>{n.createdBy}</p>
                          </div>
                          <div className="float-right">
                            <p>
                              Created At:{" "}
                              {moment(n.createdAt).format("DD, MMM, YYYY")}
                            </p>
                            {moment(n.createdAt).format("DD/MM/YYYY h:mm") !=
                              moment(n.updatedAt).format("DD/MM/YYYY h:mm") && (
                              <p>
                                Updated At:{" "}
                                {moment(n.createdAt).format("DD, MMM, YYYY")}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Notes;
