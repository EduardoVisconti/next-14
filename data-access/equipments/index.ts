import { Equipment } from '@/types/equipment';
import { db } from '@/lib/firebase';

import {
	collection,
	getDocs,
	getDoc,
	doc,
	addDoc,
	updateDoc,
	deleteDoc
} from 'firebase/firestore';

const equipmentsCollection = collection(db, 'equipments');

export const getEquipmentsList = async (): Promise<Equipment[]> => {
	const snapshot = await getDocs(equipmentsCollection);

	return snapshot.docs.map((d) => ({
		id: d.id,
		...(d.data() as Omit<Equipment, 'id'>)
	}));
};

export const getEquipmentById = async (
	id: string
): Promise<Equipment | undefined> => {
	const ref = doc(db, 'equipments', id);
	const snap = await getDoc(ref);

	if (!snap.exists()) return undefined;

	return {
		id: snap.id,
		...(snap.data() as Omit<Equipment, 'id'>)
	};
};

export const createEquipment = async (
	data: Omit<Equipment, 'id'>
): Promise<void> => {
	await addDoc(equipmentsCollection, data);
};

export const updateEquipment = async (
	id: string,
	data: Omit<Equipment, 'id'>
): Promise<void> => {
	const ref = doc(db, 'equipments', id);
	await updateDoc(ref, data);
};

export const deleteEquipment = async (id: string): Promise<void> => {
	const ref = doc(db, 'equipments', id);
	await deleteDoc(ref);
};
