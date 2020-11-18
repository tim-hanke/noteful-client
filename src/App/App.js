import React, { Component } from "react";
import { Route, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NoteListNav from "../NoteListNav/NoteListNav";
import NotePageNav from "../NotePageNav/NotePageNav";
import NoteListMain from "../NoteListMain/NoteListMain";
import NotePageMain from "../NotePageMain/NotePageMain";
import NotefulContext from "../NotefulContext/NotefulContext";
import AddFolder from "../AddFolder/AddFolder";
import { noteServer } from "../config";
import "./App.css";
import AddNote from "../AddNote/AddNote";
import NavError from "../NavError/NavError";
import MainError from "../MainError/MainError";

class App extends Component {
  state = {
    notes: [],
    folders: [],
  };

  async componentDidMount() {
    // we need to get 'notes' and 'folders' from two different endpoints
    // I found that we can do them at the same time with 'Promise.all'
    const options = {
      method: "GET",
      headers: { "content-type": "application/json" },
    };

    try {
      const [notesResponse, foldersResponse] = await Promise.all([
        fetch(noteServer + "/notes", options),
        fetch(noteServer + "/folders", options),
      ]);

      if (!notesResponse.ok || !foldersResponse.ok) {
        throw new Error("Something went wrong.");
      }

      const [notes, folders] = await Promise.all([
        notesResponse.json(), // https://developer.mozilla.org/en-US/docs/Web/API/Body/json
        foldersResponse.json(),
      ]);

      this.setState({
        notes,
        folders,
      });
    } catch (err) {
      console.error(err);
    }
  }

  renderNavRoutes() {
    // mapping arrays of paths because NoteListNav goes with several
    // paths and NotePageNav goes with the other ones
    return (
      <>
        {["/", "/folder/:folder_id"].map((path) => (
          <Route exact key={path} path={path} component={NoteListNav} />
        ))}
        {["/note/:noteId", "/add-folder", "/add-note"].map((path) => (
          <Route key={path} path={path} component={NotePageNav} />
        ))}
      </>
    );
  }

  renderMainRoutes() {
    return (
      <>
        {["/", "/folder/:folder_id"].map((path) => (
          <Route exact key={path} path={path} component={NoteListMain} />
        ))}
        <Route path="/note/:noteId" component={NotePageMain} />
        <Route path="/add-folder" component={AddFolder} />
        <Route path="/add-note/:folder_id" component={AddNote} />
      </>
    );
  }

  deleteNote = (noteId) => {
    const newNotes = this.state.notes.filter((n) => n.id !== noteId);
    this.setState({
      notes: newNotes,
    });
  };

  addNote = (note) => {
    const newNotes = [...this.state.notes, note];
    this.setState({
      notes: newNotes,
    });
  };

  addFolder = (folder) => {
    const newFolders = [...this.state.folders, folder];
    this.setState({
      folders: newFolders,
    });
  };

  render() {
    const contextValue = {
      notes: this.state.notes,
      folders: this.state.folders,
      deleteNote: this.deleteNote,
      addFolder: this.addFolder,
      addNote: this.addNote,
    };

    return (
      <NotefulContext.Provider value={contextValue}>
        <div className="App">
          <NavError>
            <nav className="App__nav">{this.renderNavRoutes()}</nav>
          </NavError>
          <header className="App__header">
            <h1>
              <Link to="/">Noteful</Link>{" "}
              <FontAwesomeIcon icon="check-double" />
            </h1>
          </header>
          <MainError>
            <main className="App__main">{this.renderMainRoutes()}</main>
          </MainError>
        </div>
      </NotefulContext.Provider>
    );
  }
}

export default App;
