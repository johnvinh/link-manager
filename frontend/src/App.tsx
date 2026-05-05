import { useCallback, useEffect, useState } from 'react';
import type { Link } from './types';
import { fetchLinks } from './api';
import { AddLinkForm } from './components/AddLinkForm';
import { LinkList } from './components/LinkList';

function App() {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchLinks();
      setLinks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load links');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <main>
      <h1>Link manager</h1>
      <AddLinkForm onCreated={refetch} />
      {loading && <p>Loading…</p>}
      {error && <p role="alert">{error}</p>}
      {!loading && !error && <LinkList links={links} onChanged={refetch} />}
    </main>
  );
}

export default App;
