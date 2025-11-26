'use client';

import { useGetUser } from '@/hooks/useAuth';
import LogoutButton from './LogoutButton';

export default function DashboardPage() {
  const { data: user, isLoading, error } = useGetUser();

  if (isLoading) {
    return (
      <div className="container mx-auto p-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-muted-foreground">Loading user data...</p>
        </div>
      </div>
    );
  }

  // if (error || !user) {
  //   return (
  //     <div className="container mx-auto p-8">
  //       <div className="flex justify-center items-center h-64">
  //         <p className="text-destructive">Failed to load user data</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <LogoutButton />
      </div>
      <p className="text-muted-foreground mb-4">
        This is a protected page. You can only see this if you&apos;re authenticated.
      </p>
      <div className="bg-muted p-4 rounded-lg">
        {/* <p className="text-sm font-medium">User ID: {user.user_id}</p>
        <p className="text-sm">Credential: {user.phone_number}</p> */}
      </div>
    </div>
  );
}
