import React, { Component } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NotefulContext from "../NotefulContext/NotefulContext";
import { getNotesForFolder } from "../notes-helpers";
import Note from "../Note/Note";
import CircleButton from "../CircleButton/CircleButton";
import "./NoteListMain.css";

export default class NoteListMain extends Component {
  static contextType = NotefulContext;

  render() {
    const { notes } = this.context;
    const { folderId } = this.props.match.params;
    const filteredNotes = getNotesForFolder(notes, folderId);

    return (
      <section className="NoteListMain">
        <ul>
          {filteredNotes.map((note) => (
            <li key={note.id}>
              <Note id={note.id} name={note.name} modified={note.modified} />
            </li>
          ))}
        </ul>
        <div className="NoteListMain__button-container">
          <CircleButton
            tag={Link}
            to={`/add-note/${folderId}`}
            type="button"
            className="NoteListMain__add-note-button"
          >
            <FontAwesomeIcon icon="plus" />
            <br />
            Add Note
          </CircleButton>
        </div>
      </section>
    );
  }
}
