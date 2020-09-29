import React, { Component } from "react";
import NotefulContext from "../NotefulContext/NotefulContext";
import "./AddFolder.css";

export default class AddFolder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      folderName: {
        value: "New Folder",
      },
    };
  }

  static contextType = NotefulContext;

  updateFolderName(name) {
    this.setState({ folderName: { value: name } });
  }

  handleSubmit(e) {
    e.preventDefault();
    const { folderName } = this.state;
    console.log("New Folder Name: ", folderName.value);
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
            value={this.state.folderName.value}
            onChange={(e) => {
              this.updateFolderName(e.target.value);
            }}
          />
        </form>
      </section>
    );
  }
}
