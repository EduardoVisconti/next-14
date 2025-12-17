import PageHeader from '@/components/core/headers/page-header';
import EquipmentsTableSection from './_components/sections/table-section';

const EquipmentsPage = () => {
	return (
		<section>
			<PageHeader
				pageTitle='Equipments'
				pageDescription='Manage equipments'
			/>
			<div className='p-4'>
				<EquipmentsTableSection />
			</div>
		</section>
	);
};

export default EquipmentsPage;
