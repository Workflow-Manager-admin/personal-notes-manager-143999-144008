import React, { useState, useEffect } from 'react';

export default function NotePanel({ note, onChange, onSave, onDelete, editing, onEditToggle, loading }) {
  const [editNote, setEditNote] = useState(note ? { ...note } : null);

  useEffect(() => {
    setEditNote(note ? { ...note } : null);
  }, [note]);

  function handleInput(field, value) {
    const updated = { ...editNote, [field]: value };
    setEditNote(updated);
    if (onChange) onChange(updated);
  }

  if (!note) return (
    <main className="note-panel" style={{ flex: 1, padding: "2em", maxWidth: 800, margin: "auto" }}>
      <div style={{ color: "var(--text-secondary)", fontSize: "1.2em", textAlign: "center", marginTop: "4em" }}>
        <em>Select or create a note to get started.</em>
      </div>
    </main>
  );

  return (
    <main className="note-panel" style={{ flex: 1, padding: "2em", maxWidth: 800, margin: "auto" }}>
      {editing ? (
        <form onSubmit={e => { e.preventDefault(); onSave && onSave(editNote); }} style={{ display: "flex", flexDirection: "column", gap: "1.2em" }}>
          <input
            type="text"
            required
            value={editNote.title}
            placeholder="Title"
            style={{ fontSize: "1.25em", fontWeight: 500 }}
            onChange={e => handleInput('title', e.target.value)}
            disabled={loading}
          />
          <textarea
            required
            rows={8}
            value={editNote.content}
            placeholder="Write your note here..."
            style={{ fontSize: "1em", width: "100%", resize: "vertical" }}
            onChange={e => handleInput('content', e.target.value)}
            disabled={loading}
          />
          <div className="flex gap-1 mt-1">
            <button className="btn" type="submit" disabled={loading}>Save</button>
            <button className="btn btn-outline" type="button" onClick={() => onEditToggle(false)} disabled={loading}>Cancel</button>
            <span style={{ flex: 1 }}></span>
            <button className="btn btn-outline" type="button" style={{ color: "var(--accent)", border: "1px solid var(--accent)" }} onClick={() => onDelete(note.id)} disabled={loading}>Delete</button>
          </div>
        </form>
      ) : (
        <section>
          <h2 style={{ marginBottom: "0.3em", fontSize: "1.6em" }}>{note.title}</h2>
          <div style={{ color: "var(--text-secondary)", fontSize: "0.96em", marginBottom: "1.2em" }}>Last edited {new Date(note.updatedAt).toLocaleString()}</div>
          <article style={{ whiteSpace: "pre-line", fontSize: "1.15em", minHeight: "7em", borderRadius: "10px", background: "#f9fafd", padding: "1em 1.2em", border: "1px solid var(--border-color)" }}>
            {note.content}
          </article>
          <div className="flex gap-1 mt-1">
            <button className="btn" type="button" onClick={() => onEditToggle(true)} style={{ minWidth: 100 }}>Edit</button>
            <button className="btn btn-outline" type="button" style={{ color: "var(--accent)", border: "1px solid var(--accent)" }} onClick={() => onDelete(note.id)}>Delete</button>
          </div>
        </section>
      )}
    </main>
  );
}
