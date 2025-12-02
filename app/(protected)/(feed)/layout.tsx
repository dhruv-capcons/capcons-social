import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/auth/server';
import Header from '@/components/feed/Header';
import Sidebar from '@/components/feed/Sidebar';

export default async function FeedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0D0D0D]">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-[260px] mt-[60px] min-h-[calc(100vh-60px)] p-2">
          {children}
        </main>
      </div>
    </div>
  );
}
