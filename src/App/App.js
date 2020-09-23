import React, { Component } from "react";
import { Route, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NoteListNav from "../NoteListNav/NoteListNav";
import NotePageNav from "../NotePageNav/NotePageNav";
import NoteListMain from "../NoteListMain/NoteListMain";
import NotePageMain from "../NotePageMain/NotePageMain";
import NotefulContext from "../NotefulContext/NotefulContext";
import dummyStore from "../dummy-store";
import "./App.css";

const noteServer = "http://localhost:9090";

class App extends Component {
  state = {
    notes: [],
    folders: [],
  };

  componentDidMount() {
    // we need to get 'notes' and 'folders' from two different endpoints
    // I found that we can do them at the same time with 'Promise.all'
    const options = {
      method: "GET",
      headers: { "content-type": "application/json" },
    };
    Promise.all([
      fetch(noteServer + "/notes", options),
      fetch(noteServer + "/folders", options),
    ])
      .then((response) => {
        if (!response[0].ok || !response[1].ok) {
          throw new Error("Something went wrong.");
        }
        return response;
      })
      .then((response) =>
        Promise.all(response.map((response) => response.json()))
      )
      .then((response) => {
        this.setState({
          notes: response[0],
          folders: response[1],
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  renderNavRoutes() {
    return (
      <>
        {["/", "/folder/:folderId"].map((path) => (
          <Route exact key={path} path={path} component={NoteListNav} />
        ))}
        <Route path="/note/:noteId" component={NotePageNav} />
        <Route path="/add-folder" component={NotePageNav} />
        <Route path="/add-note" component={NotePageNav} />
      </>
    );
  }

  renderMainRoutes() {
    return (
      <>
        {["/", "/folder/:folderId"].map((path) => (
          <Route exact key={path} path={path} component={NoteListMain} />
        ))}
        <Route path="/note/:noteId" component={NotePageMain} />
      </>
    );
  }

  render() {
    return (
      <NotefulContext.Provider value={this.state}>
        <div className="App">
          <nav className="App__nav">{this.renderNavRoutes()}</nav>
          <header className="App__header">
            <h1>
              <Link to="/">Noteful</Link>{" "}
              <FontAwesomeIcon icon="check-double" />
            </h1>
          </header>
          <main className="App__main">{this.renderMainRoutes()}</main>
        </div>
      </NotefulContext.Provider>
    );
  }
}

export default App;
