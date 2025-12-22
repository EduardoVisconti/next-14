'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
	CommandDialog,
	CommandInput,
	CommandList,
	CommandItem,
	CommandGroup,
	CommandEmpty
} from '@/components/ui/command';
import { BarChart3, Package, Plus, LayoutDashboard } from 'lucide-react';

export function CommandPalette() {
	const [open, setOpen] = React.useState(false);
	const router = useRouter();

	React.useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
				e.preventDefault();
				setOpen((open) => !open);
			}
		};

		document.addEventListener('keydown', down);
		return () => document.removeEventListener('keydown', down);
	}, []);

	const navigate = (path: string) => {
		setOpen(false);
		router.push(path);
	};

	return (
		<CommandDialog
			open={open}
			onOpenChange={setOpen}
		>
			<CommandInput placeholder='Type a command or search...' />
			<CommandList>
				<CommandEmpty>No results found.</CommandEmpty>

				<CommandGroup heading='Navigation'>
					<CommandItem onSelect={() => navigate('/dashboard')}>
						<LayoutDashboard className='mr-2 h-4 w-4' />
						Dashboard
					</CommandItem>

					<CommandItem onSelect={() => navigate('/equipments')}>
						<Package className='mr-2 h-4 w-4' />
						Equipments
					</CommandItem>

					<CommandItem onSelect={() => navigate('/analytics')}>
						<BarChart3 className='mr-2 h-4 w-4' />
						Analytics
					</CommandItem>
				</CommandGroup>

				<CommandGroup heading='Actions'>
					<CommandItem
						onSelect={() => navigate('/equipments/action?action=add')}
					>
						<Plus className='mr-2 h-4 w-4' />
						Add Equipment
					</CommandItem>
				</CommandGroup>
			</CommandList>
		</CommandDialog>
	);
}
