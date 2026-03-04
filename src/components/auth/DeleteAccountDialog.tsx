import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { authApi } from '@/lib/api';

interface DeleteAccountDialogProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
}

export const DeleteAccountDialog = ({
  isOpen,
  onClose,
  username,
}: DeleteAccountDialogProps) => {
  const [confirmUsername, setConfirmUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDelete = async () => {
    if (confirmUsername !== username) {
      toast({
        title: 'Username does not match',
        description: 'Please enter your username correctly to delete account',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      await authApi.deleteAccount();
      
      toast({
        title: 'Account deleted',
        description: 'Your account has been permanently deleted',
      });

      // Redirect to home after a short delay
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (error: any) {
      toast({
        title: 'Error deleting account',
        description: error.message || 'Failed to delete account',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      setConfirmUsername('');
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-600">
            Delete Account Permanently
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-4 pt-4">
            <div>
              <p className="font-semibold text-foreground mb-2">
                ⚠️ This action cannot be undone
              </p>
              <p className="text-sm">
                Deleting your account will:
              </p>
              <ul className="text-sm list-disc list-inside mt-2 space-y-1">
                <li>Permanently delete your profile</li>
                <li>Remove all your transaction history</li>
                <li>Delete all your financial data</li>
                <li>Cannot be recovered</li>
              </ul>
            </div>

            <div className="pt-4 border-t">
              <label className="text-sm font-medium block mb-2">
                Enter your username to confirm deletion:
              </label>
              <Input
                placeholder={`Type ${username} to confirm`}
                value={confirmUsername}
                onChange={(e) => setConfirmUsername(e.target.value)}
                className="border-red-300"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Username: <span className="font-mono">{username}</span>
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setConfirmUsername('')}>
            Cancel
          </AlertDialogCancel>
          <Button
            onClick={handleDelete}
            disabled={confirmUsername !== username || isLoading}
            className="bg-red-600 hover:bg-red-700 text-white disabled:bg-red-600 disabled:opacity-60"
          >
            {isLoading ? 'Deleting...' : 'Delete Account'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAccountDialog;
