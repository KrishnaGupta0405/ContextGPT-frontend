import { AppSidebar } from "./app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function Sidebar({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
