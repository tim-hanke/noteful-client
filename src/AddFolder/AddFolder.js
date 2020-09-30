import React, { Component } from "react";
import { noteServer } from "../config";
import NotefulContext from "../NotefulContext/NotefulContext";
import "./AddFolder.css";

export default class AddFolder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      folder: {
        name: "New Folder",
      },
    };
  }

  static contextType = NotefulContext;

  updateFolderName(name) {
    this.setState({ folder: { name: name } });
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
          <label htmlFor="folderName">
            <h2>Folder Name:</h2>
          </label>
          <button type="submit">Add Folder</button>
          <input
            type="text"
            id="folderName"
            name="folderName"
            value={this.state.folder.name}
            onChange={(e) => {
              this.updateFolderName(e.target.value);
            }}
          />
        </form>
      </section>
    );
  }
}
