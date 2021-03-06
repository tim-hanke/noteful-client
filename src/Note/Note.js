import React, { Component } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Note.css";
import config from "../config";
import NotefulContext from "../NotefulContext/NotefulContext";
import PropTypes from "prop-types";

export default class Note extends Component {
  static defaultProps = {
    onDeleteNote: () => {},
  };
  static contextType = NotefulContext;

  handleClickDelete = (e) => {
    e.preventDefault();

    const options = {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${config.API_KEY}`,
      },
    };
    const noteId = this.props.id;

    fetch(config.API_ENDPOINT + `/notes/${noteId}`, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Something went wrong deleting the note.");
        }
        return response.json();
      })
      .then((r) => {
        this.context.deleteNote(noteId);
        this.props.onDeleteNote(noteId);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  render() {
    return (
      <div className="Note">
        <h2 className="Note__title">
          <Link to={`/note/${this.props.id}`}>{this.props.name}</Link>
        </h2>
        <button
          className="Note__delete"
          type="button"
          onClick={this.handleClickDelete}
        >
          <FontAwesomeIcon icon="trash-alt" /> remove
        </button>
        <div className="Note__dates">
          <div className="Note__dates-modified">
            Modified{" "}
            <span className="Date">
              {format(this.props.date_modified, "Do MMM YYYY")}
            </span>
          </div>
        </div>
      </div>
    );
  }
}

Note.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  date_modified: PropTypes.string.isRequired,
};
