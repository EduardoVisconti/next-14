'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Equipment } from '@/types/equipment';
import Link from 'next/link';

export const equipmentColumns: ColumnDef<Equipment>[] = [
	{ accessorKey: 'name', header: 'Name' },
	{ accessorKey: 'status', header: 'Status' },
	{
		id: 'actions',
		header: 'Actions',
		cell: ({ row }) => {
			const id = row.original.id;
			return (
				<Link
					href={`/equipment/action?action=edit&id=${id}`}
					className='text-blue-600'
				>
					Edit
				</Link>
			);
		}
	}
];
