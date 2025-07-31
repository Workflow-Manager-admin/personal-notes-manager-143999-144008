import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './Sidebar.jsx';
import NotePanel from './NotePanel.jsx';

// --- Simulate REST API calls --- //
const NOTE_STORAGE_KEY = 'app-notes-list-v1';

function getDemoNotes() {
  return [
    {id:'1', title: "Welcome", content: "This is your notes app.\nYou can create, edit, delete or search your notes!", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()},
    {id:'2', title: "Minimalism", content: "The app uses a minimal, modern UI. Try editing this note.", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()},
  ];
}

function storageGetNotes() {
  let list;
  try {
    list = JSON.parse(localStorage.getItem(NOTE_STORAGE_KEY));
    if(!Array.isArray(list)) throw new Error();
  } catch {
    list = getDemoNotes();
  }
  // Sort by updatedAt desc
  list.sort((a,b)=>new Date(b.updatedAt)-new Date(a.updatedAt));
  return list;
}

function storageSetNotes(list) {
  localStorage.setItem(NOTE_STORAGE_KEY, JSON.stringify(list));
}

function mockApiFetchNotes(query = "") {
  return new Promise(resolve => {
    setTimeout(()=>{
      let notes = storageGetNotes();
      if (query) notes = notes.filter(n=>
        n.title.toLowerCase().includes(query.toLowerCase()) ||
        n.content.toLowerCase().includes(query.toLowerCase())
      );
      resolve(notes);
    }, 110);
  });
}

function mockApiCreateNote() {
  return new Promise(resolve => {
    setTimeout(()=>{
      let notes = storageGetNotes();
      const id = (Date.now() + Math.floor(Math.random()*9999)).toString();
      const now = new Date().toISOString();
      const note = {id, title:"Untitled", content:"", createdAt:now, updatedAt:now};
      notes.unshift(note);
      storageSetNotes(notes);
      resolve(note);
    }, 130);
  });
}

function mockApiUpdateNote(n) {
  return new Promise(resolve => {
    setTimeout(()=>{
      let notes = storageGetNotes();
      const idx = notes.findIndex(note => note.id === n.id);
      if (idx !== -1) {
        notes[idx] = {...notes[idx], ...n, updatedAt: new Date().toISOString()};
        storageSetNotes(notes);
        resolve(notes[idx]);
      } else {
        resolve(null);
      }
    }, 200);
  });
}

function mockApiDeleteNote(noteId) {
  return new Promise(resolve => {
    setTimeout(()=>{
      let notes = storageGetNotes();
      notes = notes.filter(n=>n.id!==noteId);
      storageSetNotes(notes);
      resolve(true);
    }, 130);
  });
}

export default function NotesApp() {
  const [notes, setNotes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [current, setCurrent] = useState(null);

  // Load list
  const loadNotes = useCallback(async (searchQ="")=>{
    setLoading(true);
    const notes = await mockApiFetchNotes(searchQ);
    setNotes(notes);
    if (!searchQ && notes.length && !selectedId) {
      setSelectedId(notes[0].id);
    }
    if (selectedId && !notes.find(n=>n.id===selectedId)) {
      setSelectedId(notes.length ? notes[0].id : null);
    }
    setLoading(false);
  }, [selectedId]);

  useEffect(() => {
    loadNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSelect(noteId) {
    setSelectedId(noteId);
    setEditing(false);
    const found = notes.find(n=>n.id===noteId);
    setCurrent(found ? {...found} : null);
  }

  async function handleNewNote() {
    setLoading(true);
    const note = await mockApiCreateNote();
    await loadNotes();
    setSelectedId(note.id);
    setEditing(true);
    setCurrent({...note});
    setLoading(false);
  }

  async function handleSearch(q) {
    setQuery(q);
    setLoading(true);
    await loadNotes(q);
    setLoading(false);
  }

  function handleEditToggle(flag) {
    setEditing(flag);
    if (!flag) {
      const found = notes.find(n=>n.id===selectedId);
      setCurrent(found ? {...found} : null);
    }
  }

  async function handleSave(edited) {
    setLoading(true);
    const res = await mockApiUpdateNote(edited);
    await loadNotes();
    setEditing(false);
    setCurrent({...res});
    setLoading(false);
  }

  function handleNoteChange(updated) {
    setCurrent(updated);
  }

  async function handleDelete(noteId) {
    setLoading(true);
    await mockApiDeleteNote(noteId);
    await loadNotes();
    setEditing(false);
    setCurrent(null);
    setSelectedId(null);
    setLoading(false);
  }

  useEffect(()=>{
    if (!notes.length) { setCurrent(null); return;}
    const found = notes.find(n=>n.id===selectedId);
    setCurrent(found ? {...found} : null);
  }, [selectedId, notes]);

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "var(--bg)",
      }}>
      <Sidebar
        notes={notes}
        selectedId={selectedId}
        onSelect={handleSelect}
        onNewNote={handleNewNote}
        onSearch={handleSearch}
        query={query}
      />
      <NotePanel
        note={current}
        onChange={handleNoteChange}
        onSave={handleSave}
        editing={editing}
        onEditToggle={handleEditToggle}
        onDelete={handleDelete}
        loading={loading}
      />
    </div>
  );
}
