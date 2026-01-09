'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { createEquipment, updateEquipment } from '@/data-access/equipments';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Equipment } from '@/types/equipment';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form';

type EquipmentFormAction = 'add' | 'edit';

interface EquipmentFormProps {
	action: EquipmentFormAction;
	equipment?: Equipment;
}

/* ---------------- SCHEMA ---------------- */

const equipmentSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	serialNumber: z.string().min(1, 'Serial number is required'),
	status: z.enum(['active', 'inactive', 'maintenance']),
	purchaseDate: z.string().min(1, 'Purchase date is required'),
	lastServiceDate: z.string().min(1, 'Last service date is required'),

	// NEW
	nextServiceDate: z.string().optional(),
	location: z.string().optional(),
	owner: z.string().optional()
});

type EquipmentFormValues = z.infer<typeof equipmentSchema>;

/* ---------------- FORM ---------------- */

export default function EquipmentForm({
	action,
	equipment
}: EquipmentFormProps) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const form = useForm<EquipmentFormValues>({
		resolver: zodResolver(equipmentSchema),
		defaultValues: {
			name: equipment?.name || '',
			serialNumber: equipment?.serialNumber || '',
			status: equipment?.status || 'active',
			purchaseDate: equipment?.purchaseDate || '',
			lastServiceDate: equipment?.lastServiceDate || '',

			nextServiceDate: equipment?.nextServiceDate || '',
			location: equipment?.location || '',
			owner: equipment?.owner || ''
		}
	});

	const createMutation = useMutation({
		mutationFn: createEquipment,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['equipments'] });
			toast.success('Equipment created successfully');
			router.push('/equipments');
		},
		onError: () => {
			toast.error('Failed to create equipment');
		}
	});

	const updateMutation = useMutation({
		mutationFn: ({ id, data }: { id: string; data: Omit<Equipment, 'id'> }) =>
			updateEquipment(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['equipments'] });
			toast.success('Equipment updated successfully');
			router.push('/equipments');
		},
		onError: () => {
			toast.error('Failed to update equipment');
		}
	});

	const isSaving =
		action === 'add' ? createMutation.isPending : updateMutation.isPending;

	async function onSubmit(values: EquipmentFormValues) {
		const payload: Omit<Equipment, 'id'> = {
			name: values.name,
			serialNumber: values.serialNumber,
			status: values.status,
			purchaseDate: values.purchaseDate,
			lastServiceDate: values.lastServiceDate,

			nextServiceDate: values.nextServiceDate?.trim() || '',
			location: values.location?.trim() || '',
			owner: values.owner?.trim() || ''
		};

		if (!payload.nextServiceDate) delete payload.nextServiceDate;
		if (!payload.location) delete payload.location;
		if (!payload.owner) delete payload.owner;

		if (action === 'add') {
			createMutation.mutate(payload);
		}

		if (action === 'edit' && equipment?.id) {
			updateMutation.mutate({
				id: equipment.id,
				data: payload
			});
		}
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='space-y-6 max-w-xl'
			>
				{/* NAME */}
				<FormField
					control={form.control}
					name='name'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input
									{...field}
									placeholder='e.g. Forklift - Unit 12'
									disabled={isSaving}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* SERIAL */}
				<FormField
					control={form.control}
					name='serialNumber'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Serial Number</FormLabel>
							<FormControl>
								<Input
									{...field}
									disabled={isSaving}
									placeholder='e.g. FL-TPA-0012'
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* STATUS */}
				<FormField
					control={form.control}
					name='status'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Status</FormLabel>
							<Select
								onValueChange={field.onChange}
								defaultValue={field.value}
							>
								<FormControl>
									<SelectTrigger disabled={isSaving}>
										<SelectValue placeholder='Select status' />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value='active'>Active</SelectItem>
									<SelectItem value='inactive'>Inactive</SelectItem>
									<SelectItem value='maintenance'>Maintenance</SelectItem>
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* OWNER */}
				<FormField
					control={form.control}
					name='owner'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Owner</FormLabel>
							<FormControl>
								<Input
									{...field}
									disabled={isSaving}
									placeholder='e.g. Operations Team'
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* LOCATION */}
				<FormField
					control={form.control}
					name='location'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Location</FormLabel>
							<FormControl>
								<Input
									{...field}
									disabled={isSaving}
									placeholder='e.g. Tampa DC'
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* PURCHASE DATE */}
				<FormField
					control={form.control}
					name='purchaseDate'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Purchase Date</FormLabel>
							<FormControl>
								<Input
									type='date'
									disabled={isSaving}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* LAST SERVICE DATE */}
				<FormField
					control={form.control}
					name='lastServiceDate'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Last Service Date</FormLabel>
							<FormControl>
								<Input
									type='date'
									disabled={isSaving}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* NEXT SERVICE DATE */}
				<FormField
					control={form.control}
					name='nextServiceDate'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Next Service Date</FormLabel>
							<FormControl>
								<Input
									type='date'
									disabled={isSaving}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button
					type='submit'
					disabled={isSaving}
				>
					{isSaving
						? action === 'add'
							? 'Creating...'
							: 'Updating...'
						: action === 'add'
						? 'Create Equipment'
						: 'Update Equipment'}
				</Button>
			</form>
		</Form>
	);
}
