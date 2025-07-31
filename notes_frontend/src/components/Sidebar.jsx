import React from 'react';

export default function Sidebar({ notes, selectedId, onSelect, onNewNote, onSearch, query }) {
  return (
    <aside className="sidebar" style={{ minWidth: 250, maxWidth: 330, background: "var(--panel-bg)", borderRight: "1px solid var(--border-color)", height: "100vh", display: "flex", flexDirection: "column" }}>
      <header style={{ padding: "2em 1.5em 1em" }}>
        <h2 style={{ margin: 0, fontSize: "1.4em", color: "var(--primary)", fontWeight: 700 }}>Notes</h2>
        <button className="btn btn-accent mt-1" style={{ width: "100%" }} onClick={onNewNote} type="button">+ New Note</button>
        <input
          style={{ marginTop: "1.5em", width: "100%" }}
          value={query}
          onChange={e => onSearch(e.target.value)}
          placeholder="Search notes..."
          type="search"
        />
      </header>
      <nav style={{ flex: 1, overflowY: "auto", margin: "1em 0" }}>
        {notes.length === 0
          ? <div style={{ color: "var(--text-secondary)", marginLeft: "1.5em" }}>No notes found</div>
          : notes.map((note) => (
            <div
              className="note-list-item"
              key={note.id}
              style={{
                padding: "0.8em 1.5em",
                cursor: "pointer",
                background: note.id === selectedId ? "var(--primary)" : "none",
                color: note.id === selectedId ? "#fff" : "inherit",
                borderLeft: note.id === selectedId ? `3px solid var(--accent)` : "3px solid transparent",
                fontWeight: note.id === selectedId ? 500 : "normal",
                transition: "background .18s",
              }}
              tabIndex={0}
              aria-current={note.id === selectedId}
              onClick={() => onSelect(note.id)}
            >
              <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {note.title || <em>Untitled</em>}
              </span>
            </div>
          ))
        }
      </nav>
      <footer style={{ fontSize: "0.9em", color: "var(--text-secondary)", textAlign: "center", padding: "1em" }}>
        &copy; 2024 Notes App
      </footer>
      <style>{`
        .note-list-item:hover, .note-list-item:focus {
          background: var(--accent);
          color: #fff;
          outline: none;
        }
      `}</style>
    </aside>
  );
}
