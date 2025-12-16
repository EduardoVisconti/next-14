import { AppSidebar } from '@/components/core/navigation/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import NegoDoidoQueryCLientProvider from '@/components/providers/query-provider';

const PrivateLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<SidebarProvider>
			<NegoDoidoQueryCLientProvider>
				<AppSidebar />
				<SidebarInset>{children}</SidebarInset>
			</NegoDoidoQueryCLientProvider>
		</SidebarProvider>
	);
};

export default PrivateLayout;
