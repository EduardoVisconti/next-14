'use client';

import { useState } from 'react';
import { ColumnDef, ColumnFiltersState } from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { DataTable } from '@/components/core/tables/data-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { Equipment } from '@/types/equipment';
import { getEquipmentsList } from '@/data-access/equipments';

export default function EquipmentsTableSection() {
	const router = useRouter();
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

	const { data = [] } = useQuery<Equipment[]>({
		queryKey: ['equipments'],
		queryFn: getEquipmentsList
	});

	const columns: ColumnDef<Equipment>[] = [
		{
			accessorKey: 'name',
			header: 'Name'
		},
		{
			accessorKey: 'serialNumber',
			header: 'Serial'
		},
		{
			accessorKey: 'status',
			header: 'Status'
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
