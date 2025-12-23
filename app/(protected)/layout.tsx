'use client';

import { AppSidebar } from '@/components/core/navigation/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import EquipmentDashboardQueryClientProvider from '@/components/providers/query-provider';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { CommandPalette } from '@/components/core/overlays/command-palette';

const PrivateLayout = ({ children }: { children: React.ReactNode }) => {
	const { user, loading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!loading && !user) {
			router.replace('/login');
		}
	}, [user, loading, router]);

	if (loading) {
		return (
			<div className='flex h-screen items-center justify-center'>
				<p className='text-sm text-muted-foreground'>Checking session…</p>
			</div>
		);
	}

	if (!user) return null;

	return (
		<SidebarProvider>
			<EquipmentDashboardQueryClientProvider>
				<AppSidebar />
				<SidebarInset>
					<CommandPalette />
					{children}
				</SidebarInset>
			</EquipmentDashboardQueryClientProvider>
		</SidebarProvider>
	);
};

export default PrivateLayout;
