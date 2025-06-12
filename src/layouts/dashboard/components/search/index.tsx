'use client'

import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

export function SearchBox() {
  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Buscar..."
        className="w-full bg-white pl-8 sm:w-[200px] md:w-[300px] lg:w-[400px]"
      />
    </div>
  )
}
