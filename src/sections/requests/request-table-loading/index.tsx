import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'

const RequestTableLoading: React.FC = () => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="cursor-pointer hover:bg-gray-50">Paciente</TableHead>

            <TableHead>Status</TableHead>
            <TableHead className="cursor-pointer hover:bg-gray-50">Data de Criação</TableHead>

            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <Skeleton className="h-[15px] rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-[15px] rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-[15px] rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-[15px] rounded-full" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default RequestTableLoading
