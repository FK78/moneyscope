import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "MoneyScope",
  description: "MoneyScope — Track budgets, manage accounts, and take control of your personal finances with real-time spending insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
