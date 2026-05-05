import type { Link } from './types';

type LinkInput = Omit<Link, 'id' | 'createdAt'>;
type LinkPatch = Partial<LinkInput>;

async function parseError(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as { error?: string };
    if (body.error) return body.error;
  } catch {
    // fall through
  }
  return `Request failed with status ${res.status}`;
}

export async function fetchLinks(): Promise<Link[]> {
  const res = await fetch('/links');
  if (!res.ok) throw new Error(await parseError(res));
  return (await res.json()) as Link[];
}

export async function createLink(input: LinkInput): Promise<Link> {
  const res = await fetch('/links', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return (await res.json()) as Link;
}

export async function updateLink(id: number, patch: LinkPatch): Promise<Link> {
  const res = await fetch(`/links/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return (await res.json()) as Link;
}

export async function deleteLink(id: number): Promise<void> {
  const res = await fetch(`/links/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(await parseError(res));
}
