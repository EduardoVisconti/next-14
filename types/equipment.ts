export type EquipmentStatus = 'active' | 'maintenance' | 'inactive';

export interface Equipment {
	id: string;
	name: string;
	status: EquipmentStatus;
}
