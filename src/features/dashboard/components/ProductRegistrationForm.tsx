'use client';
import { useState } from 'react';
import { Button } from '@/features/ui/button';
import { Input } from '@/features/ui/input';
import { Label } from '@/features/ui/label';

interface Props {
  onSuccess: () => void;
  token: string;
}

export function ProductRegistrationForm({ onSuccess, token }: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="prod-name">Brand / Trademark Name *</Label>
        <Input
          id="prod-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Nike, Apple, MyBrand"
          required
          minLength={2}
        />
      </div>
      <div>
        <Label htmlFor="prod-desc">Description</Label>
        <Input
          id="prod-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Short description of your product/brand"
        />
      </div>
      <div>
        <Label htmlFor="prod-kw">Keywords (comma-separated)</Label>
        <Input
          id="prod-kw"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder="e.g. fake nike, counterfeit shoes"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
        {loading ? 'Registering' : 'Register Product'}
      </Button>
    </form>
  );
}
