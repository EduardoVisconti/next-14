import { Equipment } from '@/types/equipment';

const LOCATIONS = ['Tampa DC', 'Orlando Site', 'Brandon Hub', 'St. Pete Ops'];
const OWNERS = ['Operations', 'Maintenance', 'Facilities', 'Asset Team'];

function pad(n: number) {
	return String(n).padStart(4, '0');
}

function randomFrom<T>(arr: T[]) {
	return arr[Math.floor(Math.random() * arr.length)];
}

function randomDateISO(start: Date, end: Date) {
	const t = start.getTime() + Math.random() * (end.getTime() - start.getTime());
	const d = new Date(t);
	return d.toISOString().slice(0, 10);
}

let equipmentDB: Equipment[] = Array.from({ length: 75 }).map((_, i) => {
	const purchaseDate = randomDateISO(
		new Date('2022-01-01'),
		new Date('2025-01-01')
	);
	const lastServiceDate = randomDateISO(
		new Date('2024-01-01'),
		new Date('2025-12-01')
	);
	const nextServiceDate = randomDateISO(
		new Date('2025-01-01'),
		new Date('2026-06-01')
	);

	return {
		id: crypto.randomUUID(),
		name: `Asset ${i + 1} - Unit ${pad(i + 1)}`,
		serialNumber: `ASSET-${pad(1000 + i)}`,
		status: i % 3 === 0 ? 'maintenance' : i % 2 === 0 ? 'inactive' : 'active',
		purchaseDate,
		lastServiceDate,

		// NEW
		nextServiceDate,
		location: randomFrom(LOCATIONS),
		owner: randomFrom(OWNERS)
	};
});

export function listEquipments() {
	return equipmentDB;
}

export function getEquipmentById(id: string) {
	return equipmentDB.find((e) => e.id === id);
}

export function createEquipment(data: Omit<Equipment, 'id'>) {
	const newEquipment: Equipment = { id: crypto.randomUUID(), ...data };
	equipmentDB = [newEquipment, ...equipmentDB];
	return newEquipment;
}

export function updateEquipment(id: string, data: Omit<Equipment, 'id'>) {
	equipmentDB = equipmentDB.map((e) => (e.id === id ? { id, ...data } : e));
	return getEquipmentById(id);
}

export function deleteEquipment(id: string) {
	equipmentDB = equipmentDB.filter((e) => e.id !== id);
}
