import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ThemeToggle } from '../toggles/theme-toggle';

const PageHeader = ({
	pageTitle,
	pageDescription
}: {
	pageTitle: string;
	pageDescription: string;
}) => {
	return (
		<header className='flex h-[60px] shrink-0 items-center px-4 justify-between border-b gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12'>
			<div className='flex items-center gap-2'>
				<SidebarTrigger className='-ml-1' />
				<Separator
					orientation='vertical'
					className='mr-2 h-4'
				/>
				<div className='flex flex-col gap-y-0 leading-3'>
					<h2 className='text-base font-semibold'>
						{pageTitle || 'Missing page title'}
					</h2>
					<p className='text-xs text-muted-foreground'>
						{pageDescription || 'Missing page description'}
					</p>
				</div>
			</div>
			<ThemeToggle />
		</header>
	);
};

export default PageHeader;
