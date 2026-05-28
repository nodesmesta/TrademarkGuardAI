import DashboardLayout from '@/features/dashboard/components/layout/dashboard-layout'
export default function DashboardRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <DashboardLayout>{children}</DashboardLayout>
}
export const metadata = {
  title: 'Dashboard - TradeGuard AI',
  description: 'Real-time trademark monitoring and protection dashboard',
}
