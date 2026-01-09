export type EquipmentStatus = 'active' | 'inactive' | 'maintenance';

export interface Equipment {
	id: string;
	name: string;
	serialNumber: string;
	status: EquipmentStatus;

	purchaseDate: string;
	lastServiceDate: string;

	nextServiceDate?: string; // usado pra "due soon / overdue" dashboard logic
	location?: string;
	owner?: string;
}
