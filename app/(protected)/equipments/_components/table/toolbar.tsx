'use client';

import { Table } from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface DataTableToolbarProps<TData> {
	table: Table<TData>;
}

export function DataTableToolbar<TData>({
	table
}: DataTableToolbarProps<TData>) {
	const router = useRouter();

	return (
		<div className='flex items-center justify-between py-4'>
			<Input
				placeholder='Filter by name...'
				value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
				onChange={(event) =>
					table.getColumn('name')?.setFilterValue(event.target.value)
				}
				className='max-w-sm'
			/>
			<Button onClick={() => router.push('/equipments/action?action=add')}>
				Add equipment
			</Button>
		</div>
	);
}
