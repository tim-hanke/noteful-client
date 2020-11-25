export const findFolder = (folders = [], folder_id) =>
  folders.find((folder) => folder.id === folder_id);

export const findNote = (notes = [], noteId) =>
  notes.find((note) => note.id === noteId);

export const getNotesForFolder = (notes = [], id) => {
  // console.log("Inside getNotesForFolder:");
  // console.log(`notes.length:${notes.length}`);
  // console.log(`folder_id: ${id}`);
  // console.log(`notes: ${notes}`);
  // console.log(`notes[0]: ${notes[0]}`);
  // console.log(notes[0].folder_id);
  // notes.forEach((note) =>
  //   console.log(
  //     "folder_id matches: " + Boolean(note.folder_id === Number(id))
  //   )
  // );
  // console.log(
  //   `filter results: ${notes.filter((note) => note.folder_id === id)}`
  // );
  return !id ? notes : notes.filter((note) => note.folder_id === id);
};

export const countNotesForFolder = (notes = [], folder_id) =>
  notes.filter((note) => note.folder_id === folder_id).length;
