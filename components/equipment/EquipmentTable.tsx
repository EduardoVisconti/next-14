'use client';

import {
	useReactTable,
	getCoreRowModel,
	flexRender
} from '@tanstack/react-table';
import { equipmentColumns } from './equipmentColumns';
export function EquipmentTable({ data }: { data: any[] }) {
	const table = useReactTable({
		data,
		columns: equipmentColumns,
		getCoreRowModel: getCoreRowModel()
	});

	return (
		<table className='border w-full'>
			<thead>
				{table.getHeaderGroups().map((g) => (
					<tr key={g.id}>
						{g.headers.map((h) => (
							<th
								key={h.id}
								className='border p-2'
							>
								{flexRender(h.column.columnDef.header, h.getContext())}
							</th>
						))}
					</tr>
				))}
			</thead>
			<tbody>
				{table.getRowModel().rows.map((r) => (
					<tr key={r.id}>
						{r.getVisibleCells().map((c) => (
							<td
								key={c.id}
								className='border p-2'
							>
								{flexRender(c.column.columnDef.cell, c.getContext())}
							</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	);
}
