'use client';

import { useState } from 'react';
import { ColumnDef, ColumnFiltersState } from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { MoreHorizontal } from 'lucide-react';

import { DataTable } from '@/components/core/tables/data-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

import { Equipment } from '@/types/equipment';
import { getEquipmentsList } from '@/data-access/equipments';

export default function EquipmentsTableSection() {
	const router = useRouter();
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

	const { data = [] } = useQuery<Equipment[]>({
		queryKey: ['equipments'],
		queryFn: getEquipmentsList
	});

	const handleEdit = (equipment: Equipment) => {
		router.push(`/equipments/action?action=edit&id=${equipment.id}`);
	};

	const handleDelete = (equipment: Equipment) => {
		// mock por enquanto
		console.log('DELETE equipment:', equipment.id);
	};

	const columns: ColumnDef<Equipment>[] = [
		{ accessorKey: 'name', header: 'Name' },
		{ accessorKey: 'serialNumber', header: 'Serial' },
		{ accessorKey: 'status', header: 'Status' },

		// 🔥 ACTIONS
		{
			id: 'actions',
			header: '',
			cell: ({ row }) => {
				const equipment = row.original;

				return (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant='ghost'
								size='icon'
							>
								<MoreHorizontal className='h-4 w-4' />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align='end'>
							<DropdownMenuItem onClick={() => handleEdit(equipment)}>
								Edit
							</DropdownMenuItem>
							<DropdownMenuItem
								className='text-destructive'
								onClick={() => handleDelete(equipment)}
							>
								Delete
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				);
			}
		}
	];

	return (
		<div className='space-y-4'>
			<div className='flex justify-between'>
				<Input
					placeholder='Filter by name...'
					value={
						(columnFilters.find((f) => f.id === 'name')?.value as string) ?? ''
					}
					onChange={(e) =>
						setColumnFilters([{ id: 'name', value: e.target.value }])
					}
					className='max-w-sm'
				/>
				<Button onClick={() => router.push('/equipments/action?action=add')}>
					Add equipment
				</Button>
			</div>

			<DataTable
				columns={columns}
				data={data}
				columnFilters={columnFilters}
				onColumnFiltersChange={setColumnFilters}
			/>
		</div>
	);
}
