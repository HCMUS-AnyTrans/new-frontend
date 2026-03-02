import type { Glossary } from '../types';
import { GlossaryCard } from './glossary-card';

interface GlossaryListProps {
  glossaries: Glossary[];
  onGlossaryClick: (glossary: Glossary) => void;
  onEdit: (glossary: Glossary) => void;
  onDelete: (glossary: Glossary) => void;
}

export function GlossaryList({
  glossaries,
  onGlossaryClick,
  onEdit,
  onDelete,
}: GlossaryListProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {glossaries.map((glossary) => (
        <GlossaryCard
          key={glossary.id}
          glossary={glossary}
          onClick={onGlossaryClick}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
