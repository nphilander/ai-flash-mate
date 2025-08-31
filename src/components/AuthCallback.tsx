import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

export const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // This function handles the auth callback
    const handleAuthCallback = async () => {
      try {
        // Get the session from the URL hash
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          navigate('/?error=auth-failed');
          return;
        }

        if (session) {
          // Successful authentication
          navigate('/?message=welcome');
        } else {
          // No session found
          navigate('/?error=no-session');
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        navigate('/?error=unexpected');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
        <h2 className="text-xl font-semibold">Completing sign up...</h2>
        <p className="text-muted-foreground">Please wait while we verify your email.</p>
      </div>
    </div>
  );
};