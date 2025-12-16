'use client';

import {
	useEquipmentById,
	useCreateEquipment,
	useUpdateEquipment
} from '@/hooks/useEquipment';
import { EquipmentStatus } from '@/types/equipment';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export function EquipmentForm() {
	const router = useRouter();
	const params = useSearchParams();

	const action = params.get('action'); // add | edit
	const id = params.get('id');

	const isEdit = action === 'edit';

	const { data: equipment } = useEquipmentById(isEdit ? id! : undefined);
	const createMutation = useCreateEquipment();
	const updateMutation = useUpdateEquipment(id!);

	const [name, setName] = useState('');
	const [status, setStatus] = useState<EquipmentStatus>('active');

	// 🔥 DEFAULT VALUES BASEADOS NA ACTION
	useEffect(() => {
		if (isEdit && equipment) {
			setName(equipment.name || '');
			setStatus(equipment.status || 'active');
		}
	}, [isEdit, equipment]);

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		if (isEdit) {
			updateMutation.mutate({ name, status });
		} else {
			createMutation.mutate({ name, status });
		}

		router.push('/equipment');
	}

	return (
		<form
			onSubmit={handleSubmit}
			className='space-y-4 max-w-md'
		>
			<h1 className='text-xl font-semibold'>
				{isEdit ? 'Edit Equipment' : 'Add Equipment'}
			</h1>

			<input
				className='border p-2 w-full'
				placeholder='Equipment name'
				value={name}
				onChange={(e) => setName(e.target.value)}
				required
			/>

			<select
				className='border p-2 w-full'
				value={status}
				onChange={(e) => setStatus(e.target.value as EquipmentStatus)}
			>
				<option value='active'>Active</option>
				<option value='maintenance'>Maintenance</option>
				<option value='inactive'>Inactive</option>
			</select>

			<button className='bg-black text-white px-4 py-2'>Save</button>
		</form>
	);
}
