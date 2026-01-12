'use client';

import { useState } from 'react';
import { Input, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

export function MovieSearch() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!query.trim() || query.trim().length < 2) {
      return;
    }

    setLoading(true);
    try {
      router.push(`/?q=${encodeURIComponent(query.trim())}&page=1`);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(e as any);
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="flex gap-2">
        <Input
          size="large"
          placeholder="Search movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
          className="flex-1"
        />
        <Button
          type="primary"
          size="large"
          icon={<SearchOutlined />}
          htmlType="submit"
          loading={loading}
        >
          Search
        </Button>
      </div>
    </form>
  );
}