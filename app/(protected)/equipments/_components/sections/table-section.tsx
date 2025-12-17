'use client';

import { useQuery } from '@tanstack/react-query';
import { getEquipmentsList } from '@/data-access/equipments';
import { Equipment } from '@/types/equipment';
import { columns } from '../table/columns';
import { DataTable } from '../table/data-table';

export default function EquipmentsTableSection() {
	const { data, isLoading, isError } = useQuery<Equipment[]>({
		queryKey: ['equipments'],
		queryFn: getEquipmentsList
	});

	if (isLoading) return <p>Loading equipments...</p>;
	if (isError) return <p>Error loading equipments</p>;

	return (
		<DataTable
			columns={columns}
			data={data ?? []}
		/>
	);
}
