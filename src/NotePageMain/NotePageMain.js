import React, { Component } from "react";
import Note from "../Note/Note";
import NotefulContext from "../NotefulContext/NotefulContext";
import { findNote } from "../notes-helpers";
import "./NotePageMain.css";

export default class NotePageMain extends Component {
  static defaultProps = {
    match: {
      params: {},
    },
  };
  static contextType = NotefulContext;

  handleDeleteNote = (noteId) => {
    this.props.history.push("/");
  };

  render() {
    const { notes } = this.context;
    const { noteId } = this.props.match.params;
    const note = findNote(notes, Number(noteId)) || {};

    return (
      <section className="NotePageMain">
        <Note
          id={note.id}
          name={note.name}
          date_modified={note.date_modified}
          onDeleteNote={this.handleDeleteNote}
        />
        {/* On a page refresh on the /note path, the note will
        not have been loaded from the API yet, so .split will
        give an error. So this is a quick check to only try
        to render note.content, if it isn't undefined. */}
        <div className="NotePageMain__content">
          {note.content
            ? note.content
                .split(/\n \r|\n/)
                .map((para, i) => <p key={i}>{para}</p>)
            : null}
        </div>
      </section>
    );
  }
}
