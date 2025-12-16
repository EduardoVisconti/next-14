'use client';

import { EquipmentTable } from '@/components/equipment/EquipmentTable';
import { useEquipmentList } from '@/hooks/useEquipment';
import Link from 'next/link';

export default function Page() {
	const { data } = useEquipmentList();

	return (
		<div className='space-y-4'>
			<Link
				href='/equipment/action?action=add'
				className='bg-black text-white px-4 py-2 inline-block'
			>
				Add Equipment
			</Link>

			<EquipmentTable data={data ?? []} />
		</div>
	);
}
