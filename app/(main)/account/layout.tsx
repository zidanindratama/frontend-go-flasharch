import { AccountSidebar } from "@/components/account/account-sidebar"

export default function AccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-5 md:px-6 md:py-8 lg:py-12">
      <div className="lg:flex lg:gap-8">
        <AccountSidebar />
        <div className="min-w-0 flex-1">
          {children}
        </div>
      </div>
    </div>
  )
}
