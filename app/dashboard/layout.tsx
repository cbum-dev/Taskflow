import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/global/sidebars"
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full h-[95vh] overflow-clip  scrollbar-hide mt-auto">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}