'use client'
import { useRouter } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter();
  let uid: string;
  if (typeof localStorage !== 'undefined') {
    uid = localStorage.getItem('uid') || '';
    if (uid) {
      router.push('/home');
    }
  }
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}