import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import { AdminProvider } from "@/context/AdminContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="">
        <AdminProvider>
          <div className="min-h-screen bg-linear-to-br from-blue-900 via-indigo-900 to-purple-900 text-slate-100">
            <Navbar />
            <main className="pt-18">{children}</main>
          </div>
        </AdminProvider>
      </body>
    </html>
  );
}
