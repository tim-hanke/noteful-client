import React from "react";

const NotefulContext = React.createContext({
  folders: [],
  notes: [],
  deleteNote: () => {},
});

export default NotefulContext;
