import React from "react";

const NotefulContext = React.createContext({
  folders: [],
  notes: [],
  deleteNoteFromState: () => {},
});

export default NotefulContext;
