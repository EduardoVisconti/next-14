'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Equipment } from '@/types/equipment';
import { Badge } from '@/components/ui/badge';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const columns: ColumnDef<Equipment>[] = [
	{
		accessorKey: 'name',
		header: ({ column }) => (
			<Button
				variant='ghost'
				onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
			>
				Name
				<ArrowUpDown className='ml-2 h-4 w-4' />
			</Button>
		)
	},
	{
		accessorKey: 'serialNumber',
		header: 'Serial Number'
	},
	{
		accessorKey: 'status',
		header: 'Status',
		cell: ({ row }) => {
			const status = row.getValue('status') as Equipment['status'];

			const variant =
				status === 'active'
					? 'default'
					: status === 'maintenance'
					? 'secondary'
					: 'outline';

			return <Badge variant={variant}>{status}</Badge>;
		}
	},
	{
		accessorKey: 'purchaseDate',
		header: 'Purchase Date'
	},
	{
		accessorKey: 'lastServiceDate',
		header: 'Last Service'
	}
];
