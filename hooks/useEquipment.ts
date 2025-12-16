import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Equipment } from '@/types/equipment';

export function useEquipmentList() {
	return useQuery({
		queryKey: ['equipment'],
		queryFn: async () => {
			const { data } = await api.get<Equipment[]>('/equipment');
			return data;
		}
	});
}

export function useEquipmentById(id?: string) {
	return useQuery({
		queryKey: ['equipment', id],
		enabled: !!id,
		queryFn: async () => {
			const { data } = await api.get<Equipment>(`/equipment/${id}`);
			return data;
		}
	});
}

export function useCreateEquipment() {
	const qc = useQueryClient();

	return useMutation({
		mutationFn: async (data: Omit<Equipment, 'id'>) =>
			api.post('/equipment', data),
		onSuccess: () => qc.invalidateQueries({ queryKey: ['equipment'] })
	});
}

export function useUpdateEquipment(id: string) {
	const qc = useQueryClient();

	return useMutation({
		mutationFn: async (data: Partial<Equipment>) =>
			api.put(`/equipment/${id}`, data),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ['equipment'] });
			qc.invalidateQueries({ queryKey: ['equipment', id] });
		}
	});
}
