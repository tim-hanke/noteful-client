import React from "react";

const NotefulContext = React.createContext({
  folders: [],
  notes: [],
  deleteNote: () => {},
  addFolder: () => {},
  addNote: () => {},
});

export default NotefulContext;
