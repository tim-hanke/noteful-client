import React, { Component } from "react";
import { noteServer } from "../config";
import NotefulContext from "../NotefulContext/NotefulContext";
import ValidationError from "../ValidationError/ValidationError";
import "./AddNote.css";

export default class AddNote extends Component {
  constructor(props) {
    super(props);
    // when calling AddNote, NoteListMain puts the current folder
    // in the path so that the current folder is pre-selected
    // the user can still select another folder for the note
    // or create a new folder
    this.state = {
      note: {
        name: "",
        folderId: this.props.match.params.folderId,
        content: "",
        modified: "",
      },
      nameTouched: false,
      contentTouched: false,
    };
  }

  static contextType = NotefulContext;

  updateNoteFolderId(folderId) {
    if (folderId === "addNewFolder") {
      this.props.history.push("/add-folder");
    }
    const newState = this.state;
    newState.note.folderId = folderId;
    this.setState(newState);
  }

  updateNoteName(name) {
    const newState = this.state;
    newState.note.name = name;
    newState.nameTouched = true;
    this.setState(newState);
  }

  updateNoteContent(content) {
    const newState = this.state;
    newState.note.content = content;
    newState.contentTouched = true;
    this.setState(newState);
  }

  validateNoteName() {
    const name = this.state.note.name.trim();
    if (name.length === 0) {
      return "A name is required for the note.";
    }
  }

  validateNoteFolderId() {
    if (this.state.note.folderId === "") {
      return "Please select a folder.";
    }
  }

  validateNoteContent() {
    const content = this.state.note.content.trim();
    if (content.length === 0) {
      return "Some content is required for the note.";
    }
  }

  async handleSubmit(e) {
    e.preventDefault();
    const { note } = this.state;
    note.modified = Date().toLocaleString();
    const options = {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(note),
    };
    try {
      const noteResponse = await fetch(noteServer + "/notes", options);

      if (!noteResponse.ok) {
        throw new Error("Something went wrong adding the note.");
      }

      const note = await noteResponse.json();

      this.context.addNote(note);
      this.props.history.goBack();
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    const folderOptions = this.context.folders.map((folder) => {
      return (
        <option value={folder.id} key={folder.id}>
          {folder.name}
        </option>
      );
    });
    const nameError = this.validateNoteName();
    const contentError = this.validateNoteContent();

    return (
      <section className="AddNote">
        <form
          className="AddNote__form"
          onSubmit={(e) => {
            this.handleSubmit(e);
          }}
        >
          <label htmlFor="folderId">
            <h2>Folder:</h2>
          </label>
          <select
            id="folderId"
            name="folderId"
            value={this.state.note.folderId}
            onChange={(e) => {
              this.updateNoteFolderId(e.target.value);
            }}
          >
            <option value="">Select a folder...</option>
            {folderOptions}
            <option value="addNewFolder">Add new folder...</option>
          </select>
          <label htmlFor="noteName">
            <h2>Name:</h2>
          </label>
          <input
            type="text"
            id="noteName"
            name="noteName"
            value={this.state.note.name}
            onChange={(e) => {
              this.updateNoteName(e.target.value);
            }}
          />
          <label htmlFor="noteContent">
            <h2>Content:</h2>
          </label>
          <textarea
            id="noteContent"
            name="noteContent"
            value={this.state.note.content}
            onChange={(e) => {
              this.updateNoteContent(e.target.value);
            }}
          />
          <button
            type="submit"
            disabled={
              this.validateNoteFolderId() ||
              this.validateNoteName() ||
              this.validateNoteContent()
            }
          >
            Add Note
          </button>

          {this.state.nameTouched && <ValidationError message={nameError} />}
          {this.state.contentTouched && (
            <ValidationError message={contentError} />
          )}
        </form>
      </section>
    );
  }
}
