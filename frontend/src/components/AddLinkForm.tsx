import { useState, type FormEvent } from 'react';
import { createLink } from '../api';

interface Props {
  onCreated: () => void;
}

export function AddLinkForm({ onCreated }: Props) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await createLink({ url, title, description, tags: [] });
      setUrl('');
      setTitle('');
      setDescription('');
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add link');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <h2>Add link</h2>
      <input
        type="url"
        placeholder="URL"
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
      <button type="submit" disabled={submitting}>
        {submitting ? 'Adding…' : 'Add'}
      </button>
      {error && <p role="alert">{error}</p>}
    </form>
  );
}
