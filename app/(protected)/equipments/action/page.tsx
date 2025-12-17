import EquipmentForm from '../_components/form/equipment-form';
import { getEquipmentsList } from '@/data-access/equipments';

interface PageProps {
	searchParams: {
		action?: 'add' | 'edit';
		id?: string;
	};
}

export default async function EquipmentActionPage({ searchParams }: PageProps) {
	const action = searchParams.action ?? 'add';

	let equipment = undefined;

	if (action === 'edit' && searchParams.id) {
		const data = await getEquipmentsList();
		equipment = data?.id === searchParams.id ? data : undefined;
	}

	return (
		<EquipmentForm
			action={action}
			equipment={equipment}
		/>
	);
}
