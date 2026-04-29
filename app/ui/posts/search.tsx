"use client";

import { useSearchParams } from 'next/navigation';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function Search() {
  const searchParams = useSearchParams();
  function handleSearch(value: string) {
    console.log(value);
  }
  return (
    <div className='flex flex-row'>
      <MagnifyingGlassIcon className="w-5 h-5" />
      <input
        type="text"
        name="search"
        id="search"
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  );
}
