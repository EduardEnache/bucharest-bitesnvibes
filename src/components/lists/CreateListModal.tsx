'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Toggle from '@/components/ui/Toggle';

interface CreateListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; description: string; isPublic: boolean }) => Promise<void>;
}

export default function CreateListModal({ isOpen, onClose, onSave }: CreateListModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave({ name, description, isPublic });
      setName(''); setDescription(''); setIsPublic(false);
      onClose();
    } finally { setLoading(false); }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New List" maxWidth="max-w-md">
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        <Input label="List Name" required value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Best Brunch Spots" />
        <div>
          <label className="block text-sm font-medium text-on-surface-variant mb-1.5">Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)}
            className="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 min-h-[80px] resize-y"
            placeholder="Describe this list..." />
        </div>
        <Toggle enabled={isPublic} onChange={setIsPublic} label="Public List" description="Allow others to view this list" />
        <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" disabled={loading || !name}>
            {loading ? 'Creating...' : 'Create List'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
