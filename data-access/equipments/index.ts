import axios from 'axios';

export const getEquipmentsList = async () => {
	console.log('^Called function');
	const response = await axios
		.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/todos/5`)
		.then((res) => {
			console.log(res);
			return res.data;
		})
		.catch((error) => console.log(error));

	return response;
};
