import type { Link } from '../types';
import { LinkRow } from './LinkRow';

interface Props {
  links: Link[];
  onChanged: () => void;
}

export function LinkList({ links, onChanged }: Props) {
  if (links.length === 0) {
    return <p>No links yet.</p>;
  }
  return (
    <ul>
      {links.map((link) => (
        <LinkRow key={link.id} link={link} onChanged={onChanged} />
      ))}
    </ul>
  );
}
