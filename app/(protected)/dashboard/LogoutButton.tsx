'use client';

import { useLogout } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();
  const { mutate: logout, isPending } = useLogout();

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        router.push('/login');
      },
    });
  };

  return (
    <Button 
      onClick={handleLogout} 
      disabled={isPending}
      variant="outline"
    >
      {isPending ? 'Logging out...' : 'Logout'}
    </Button>
  );
}
