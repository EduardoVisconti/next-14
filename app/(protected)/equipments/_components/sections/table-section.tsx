'use client';

import { useState } from 'react';
import { ColumnDef, ColumnFiltersState } from '@tanstack/react-table';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { MoreHorizontal, Package } from 'lucide-react';
import { deleteEquipment, getEquipmentsList } from '@/data-access/equipments';
import { Equipment } from '@/types/equipment';
import { toast } from 'sonner';

import { DataTable } from '@/components/core/tables/data-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogCancel,
	AlertDialogAction
} from '@/components/ui/alert-dialog';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select';

function StatusBadge({ status }: { status: Equipment['status'] }) {
	const map = {
		active: 'bg-green-100 text-green-700',
		maintenance: 'bg-yellow-100 text-yellow-800',
		inactive: 'bg-muted text-muted-foreground'
	};

	return (
		<Badge
			variant='outline'
			className={map[status]}
		>
			{status}
		</Badge>
	);
}

export default function EquipmentsTableSection() {
	const router = useRouter();
	const queryClient = useQueryClient();

	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const [equipmentToDelete, setEquipmentToDelete] = useState<Equipment | null>(
		null
	);

	/* ---------------- DATA ---------------- */

	const {
		data = [],
		isLoading,
		isFetching
	} = useQuery<Equipment[]>({
		queryKey: ['equipments'],
		queryFn: getEquipmentsList
	});

	/* ---------------- MUTATION ---------------- */

	const deleteMutation = useMutation({
		mutationFn: (id: string) => deleteEquipment(id),
		onMutate: (id) => setDeletingId(id),
		onSettled: () => setDeletingId(null),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['equipments'] });
			toast.success('Asset deleted');
		},
		onError: () => toast.error('Failed to delete asset')
	});

	/* ---------------- COLUMNS ---------------- */

	const columns: ColumnDef<Equipment>[] = [
		{ accessorKey: 'name', header: 'Asset' },
		{ accessorKey: 'serialNumber', header: 'Serial' },
		{
			accessorKey: 'status',
			header: 'Status',
			cell: ({ row }) => <StatusBadge status={row.original.status} />
		},
		{
			accessorKey: 'lastServiceDate',
			header: 'Last Service'
		},
		{
			id: 'actions',
			cell: ({ row }) => {
				const equipment = row.original;
				const isDeleting = deletingId === equipment.id;

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
							<DropdownMenuItem
								disabled={isDeleting}
								onClick={() => router.push(`/equipments/${equipment.id}`)}
							>
								Edit
							</DropdownMenuItem>
							<DropdownMenuItem
								className='text-destructive'
								disabled={isDeleting}
								onClick={() => router.push(`/equipments/${equipment.id}`)}
							>
								Delete
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				);
			}
		}
	];

	/* ---------------- SKELETON ---------------- */

	if (isLoading) {
		return (
			<div className='space-y-4'>
				<div className='flex justify-between'>
					<Skeleton className='h-10 w-64' />
					<Skeleton className='h-10 w-32' />
				</div>
				<div className='rounded-md border p-4 space-y-2'>
					{Array.from({ length: 5 }).map((_, i) => (
						<Skeleton
							key={i}
							className='h-6'
						/>
					))}
				</div>
			</div>
		);
	}

	/* ---------------- RENDER ---------------- */

	return (
		<div className='space-y-4'>
			<div className='flex flex-wrap gap-4 items-center justify-between'>
				<div className='flex gap-2'>
					<Input
						placeholder='Search assets...'
						value={
							(columnFilters.find((f) => f.id === 'name')?.value as string) ??
							''
						}
						onChange={(e) =>
							setColumnFilters([{ id: 'name', value: e.target.value }])
						}
						className='max-w-sm'
					/>

					<Select
						onValueChange={(value) =>
							setColumnFilters(value === 'all' ? [] : [{ id: 'status', value }])
						}
					>
						<SelectTrigger className='w-[160px]'>
							<SelectValue placeholder='Status' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='all'>All</SelectItem>
							<SelectItem value='active'>Active</SelectItem>
							<SelectItem value='maintenance'>Maintenance</SelectItem>
							<SelectItem value='inactive'>Inactive</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<Button onClick={() => router.push('/equipments/action?action=add')}>
					Add asset
				</Button>
			</div>

			{isFetching && (
				<p className='text-xs text-muted-foreground'>Refreshing...</p>
			)}

			{data.length === 0 ? (
				<div className='flex flex-col items-center justify-center rounded-lg border border-dashed p-10 text-center'>
					<div className='flex h-12 w-12 items-center justify-center rounded-full bg-muted'>
						<Package className='h-6 w-6 text-muted-foreground' />
					</div>
					<h3 className='mt-4 text-lg font-semibold'>No assets found</h3>
					<p className='mt-2 text-sm text-muted-foreground'>
						Add your first asset to start managing operations.
					</p>
					<Button
						className='mt-6'
						onClick={() => router.push('/equipments/action?action=add')}
					>
						Add asset
					</Button>
				</div>
			) : (
				<DataTable
					columns={columns}
					data={data}
					columnFilters={columnFilters}
					onColumnFiltersChange={setColumnFilters}
				/>
			)}

			<AlertDialog
				open={!!equipmentToDelete}
				onOpenChange={(open) => !open && setEquipmentToDelete(null)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete asset</AlertDialogTitle>
						<AlertDialogDescription>
							This will permanently delete{' '}
							<strong>{equipmentToDelete?.name}</strong>.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							className='bg-destructive'
							onClick={() => {
								if (equipmentToDelete) {
									deleteMutation.mutate(equipmentToDelete.id);
									setEquipmentToDelete(null);
								}
							}}
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
