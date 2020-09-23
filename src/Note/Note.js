import React from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Note.css";
import { noteServer } from "../config";
import NotefulContext from "../NotefulContext/NotefulContext";

function deleteNoteFromServer(noteId, callback) {
  const options = {
    method: "DELETE",
    headers: { "content-type": "application/json" },
  };

  fetch(noteServer + `/notes/${noteId}`, options)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Something went wrong deleting the note.");
      }
      return response.json();
    })
    .then((r) => {
      console.log(r);
      callback(noteId);
    })
    .catch((error) => {
      console.error(error);
    });
}

export default function Note(props) {
  return (
    <NotefulContext.Consumer>
      {(context) => (
        <div className="Note">
          <h2 className="Note__title">
            <Link to={`/note/${props.id}`}>{props.name}</Link>
          </h2>
          <button
            className="Note__delete"
            type="button"
            onClick={() => {
              deleteNoteFromServer(props.id, context.deleteNoteFromState);
            }}
          >
            <FontAwesomeIcon icon="trash-alt" /> remove
          </button>
          <div className="Note__dates">
            <div className="Note__dates-modified">
              Modified{" "}
              <span className="Date">
                {format(props.modified, "Do MMM YYYY")}
              </span>
            </div>
          </div>
        </div>
      )}
    </NotefulContext.Consumer>
  );
}
