import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/global/sidebars"
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full overflow-hidden">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}