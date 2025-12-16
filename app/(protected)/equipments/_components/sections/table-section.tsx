'use client';

import { getEquipmentsList } from '@/data-access/equipments';
import { useQuery } from '@tanstack/react-query';

const EquipmentsTableSection = () => {
	const { data, isLoading, isError } = useQuery({
		queryKey: ['equipments'],
		queryFn: getEquipmentsList
	});

	if (isError) return <p>Azedou</p>;

	if (isLoading) return <p>Loading ...</p>;

	return (
		<div>
			<button onClick={() => getEquipmentsList()}>Click me</button>
			<pre>{JSON.stringify(data, null, 2)}</pre>
		</div>
	);
};

export default EquipmentsTableSection;
