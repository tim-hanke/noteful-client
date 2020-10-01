import React, { Component } from "react";
import { noteServer } from "../config";
import NotefulContext from "../NotefulContext/NotefulContext";
import ValidationError from "../ValidationError/ValidationError";
import "./AddFolder.css";

export default class AddFolder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      folder: {
        name: "",
        touched: false,
      },
    };
  }

  static contextType = NotefulContext;

  updateFolderName(name) {
    this.setState({ folder: { name: name, touched: true } });
  }

  validateFolderName() {
    const name = this.state.folder.name.trim();
    if (name.length === 0) {
      return "A name is required for the folder.";
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    const { folder } = this.state;
    const options = {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(folder),
    };
    fetch(noteServer + "/folders", options)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Something went wrong adding the folder.");
        }
        return response.json();
      })
      .then((response) => {
        this.context.addFolder(response);
        this.props.history.goBack();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    return (
      <section className="AddFolder">
        <form
          className="AddFolder__form"
          onSubmit={(e) => {
            this.handleSubmit(e);
          }}
        >
          <button type="submit" disabled={this.validateFolderName()}>
            Add Folder
          </button>
          <label htmlFor="folderName">
            <h2>Folder Name:</h2>
          </label>
          <input
            type="text"
            id="folderName"
            name="folderName"
            value={this.state.folder.name}
            onChange={(e) => {
              this.updateFolderName(e.target.value);
            }}
          />
          {this.state.folder.touched && (
            <ValidationError message={this.validateFolderName()} />
          )}
        </form>
      </section>
    );
  }
}
