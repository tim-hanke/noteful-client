import React, { Component } from "react";
import { noteServer } from "../config";
import NotefulContext from "../NotefulContext/NotefulContext";
import "./AddNote.css";

export default class AddNote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      note: {
        name: "",
        folderId: "",
        content: "",
      },
    };
  }

  static contextType = NotefulContext;

  updateNoteName(name) {
    const newState = this.state;
    newState.note.name = name;
    this.setState(newState);
  }

  updateNoteFolderId(folderId) {
    if (folderId === "addNewFolder") {
      this.props.history.push("/add-folder");
    }
    const newState = this.state;
    newState.note.folderId = folderId;
    this.setState(newState);
  }

  updateNoteContent(content) {
    const newState = this.state;
    newState.note.content = content;
    this.setState(newState);
  }

  handleSubmit(e) {
    e.preventDefault();
    const { note } = this.state;
    const options = {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(note),
    };
    fetch(noteServer + "/notes", options)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Something went wrong adding the note.");
        }
        return response.json();
      })
      .then((response) => {
        response.modified = Date().toLocaleString();
        console.log(response);
        this.context.addNote(response);
        this.props.history.goBack();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    const folderOptions = this.context.folders.map((folder) => {
      return (
        <option value={folder.id} key={folder.id}>
          {folder.name}
        </option>
      );
    });
    console.log(this.state);
    return (
      <section className="AddNote">
        <form
          className="AddNote__form"
          onSubmit={(e) => {
            this.handleSubmit(e);
          }}
        >
          <button type="submit">Add Note</button>
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
        </form>
      </section>
    );
  }
}
