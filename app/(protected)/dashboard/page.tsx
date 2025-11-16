import { getServerSession } from '@/lib/auth/server';

export default async function DashboardPage() {
  const session = await getServerSession();

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p className="text-muted-foreground mb-4">
        This is a protected page. You can only see this if you&apos;re authenticated.
      </p>
      {session && (
        <div className="bg-muted p-4 rounded-lg">
          <p className="text-sm font-medium">User ID: {session.id!}</p>
        </div>
      )}
    </div>
  );
}
