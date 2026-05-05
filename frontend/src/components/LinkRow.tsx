import { useState, type FormEvent } from 'react';
import type { Link } from '../types';
import { deleteLink, updateLink } from '../api';

interface Props {
  link: Link;
  onChanged: () => void;
}

export function LinkRow({ link, onChanged }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [url, setUrl] = useState(link.url);
  const [title, setTitle] = useState(link.title);
  const [description, setDescription] = useState(link.description);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startEdit = () => {
    setUrl(link.url);
    setTitle(link.title);
    setDescription(link.description);
    setError(null);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setError(null);
    setIsEditing(false);
  };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await updateLink(link.id, { url, title, description });
      setIsEditing(false);
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    setBusy(true);
    setError(null);
    try {
      await deleteLink(link.id);
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
      setBusy(false);
    }
  };

  if (isEditing) {
    return (
      <li>
        <form onSubmit={save}>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button type="submit" disabled={busy}>
            {busy ? 'Saving…' : 'Save'}
          </button>
          <button type="button" onClick={cancelEdit} disabled={busy}>
            Cancel
          </button>
          {error && <p role="alert">{error}</p>}
        </form>
      </li>
    );
  }

  return (
    <li>
      <a href={link.url} target="_blank" rel="noreferrer">
        {link.title || link.url}
      </a>
      {link.description && <p>{link.description}</p>}
      <button type="button" onClick={startEdit} disabled={busy}>
        Edit
      </button>
      <button type="button" onClick={remove} disabled={busy}>
        {busy ? 'Deleting…' : 'Delete'}
      </button>
      {error && <p role="alert">{error}</p>}
    </li>
  );
}
