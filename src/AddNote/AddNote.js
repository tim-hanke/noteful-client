import React, { Component } from "react";
import config from "../config";
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
        folder_id: this.props.match.params.folder_id,
        content: "",
        date_modified: "",
      },
      folderTouched: false,
      nameTouched: false,
      contentTouched: false,
    };
  }

  static contextType = NotefulContext;

  updateNoteFolderId(folder_id) {
    if (folder_id === "addNewFolder") {
      this.props.history.push("/add-folder");
    }
    const newState = this.state;
    newState.note.folder_id = folder_id;
    newState.folderTouched = true;
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
      return "(name is required)";
    }
  }

  validateNoteFolderId() {
    if (this.state.note.folder_id === "") {
      return "(please select a folder)";
    }
  }

  validateNoteContent() {
    const content = this.state.note.content.trim();
    if (content.length === 0) {
      return "(some content is required)";
    }
  }

  async handleSubmit(e) {
    e.preventDefault();
    const { note } = this.state;
    note.date_modified = new Date().toLocaleString();
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${config.API_KEY}`,
      },
      body: JSON.stringify(note),
    };
    try {
      const noteResponse = await fetch(config.API_ENDPOINT + "/notes", options);

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
    const folderError = this.validateNoteFolderId();
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
          <label htmlFor="folder_id">
            <h2>
              Folder:
              <span className="required"> * </span>
              {this.state.folderTouched && (
                <ValidationError message={folderError} />
              )}
            </h2>
          </label>
          <select
            id="folder_id"
            name="folder_id"
            aria-required="true"
            aria-invalid={folderError}
            value={this.state.note.folder_id}
            onChange={(e) => {
              this.updateNoteFolderId(e.target.value);
            }}
          >
            <option value="">Select a folder...</option>
            {folderOptions}
            <option value="addNewFolder">Add new folder...</option>
          </select>
          <label htmlFor="noteName">
            <h2>
              Name:
              <span className="required"> * </span>
              {this.state.nameTouched && (
                <ValidationError message={nameError} />
              )}
            </h2>
          </label>
          <input
            type="text"
            id="noteName"
            name="noteName"
            aria-required="true"
            aria-invalid={nameError}
            value={this.state.note.name}
            onChange={(e) => {
              this.updateNoteName(e.target.value);
            }}
          />
          <label htmlFor="noteContent">
            <h2>
              Content:
              <span className="required"> * </span>
              {this.state.contentTouched && (
                <ValidationError message={contentError} />
              )}
            </h2>
          </label>
          <textarea
            id="noteContent"
            name="noteContent"
            aria-required="true"
            aria-invalid={contentError}
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
        </form>
      </section>
    );
  }
}
