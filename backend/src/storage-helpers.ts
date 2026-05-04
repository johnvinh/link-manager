import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { Link } from './types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Resolves to <backend>/data/links.json regardless of process CWD.
// __dirname at runtime is <backend>/dist (after tsc build) or <backend>/src
// (when run via ts-node/tsx). Going up one level and into data/ works in both.
const STORAGE_PATH = resolve(__dirname, '..', 'data', 'links.json');

export class LinkNotFoundError extends Error {
  constructor(public readonly id: number) {
    super(`Link with id ${id} not found`);
    this.name = 'LinkNotFoundError';
  }
}

async function readAll(): Promise<Link[]> {
  try {
    const raw = await readFile(STORAGE_PATH, 'utf8');
    return JSON.parse(raw) as Link[];
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    throw err;
  }
}

async function writeAll(links: Link[]): Promise<void> {
  await mkdir(dirname(STORAGE_PATH), { recursive: true });
  await writeFile(STORAGE_PATH, JSON.stringify(links, null, 2) + '\n', 'utf8');
}

export async function fetchLinks(): Promise<Link[]> {
  return readAll();
}

export async function createLink(
  input: Omit<Link, 'id' | 'createdAt'>,
): Promise<Link> {
  const links = await readAll();
  const nextId = links.reduce((max, l) => (l.id > max ? l.id : max), 0) + 1;
  const link: Link = {
    ...input,
    id: nextId,
    createdAt: new Date().toISOString(),
  };
  links.push(link);
  await writeAll(links);
  return link;
}

export async function updateLink(
  id: number,
  patch: Partial<Omit<Link, 'id' | 'createdAt'>>,
): Promise<Link> {
  const links = await readAll();
  const index = links.findIndex((l) => l.id === id);
  if (index === -1) {
    throw new LinkNotFoundError(id);
  }
  const existing = links[index]!;
  const updated: Link = { ...existing, ...patch, id: existing.id, createdAt: existing.createdAt };
  links[index] = updated;
  await writeAll(links);
  return updated;
}

export async function deleteLink(id: number): Promise<void> {
  const links = await readAll();
  const index = links.findIndex((l) => l.id === id);
  if (index === -1) {
    throw new LinkNotFoundError(id);
  }
  links.splice(index, 1);
  await writeAll(links);
}
