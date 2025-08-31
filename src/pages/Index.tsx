import { useState, useEffect } from "react";
import { StudyHeader } from "@/components/StudyHeader";
import { FlashcardGenerator } from "@/components/FlashcardGenerator";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [userPlan, setUserPlan] = useState<'free' | 'premium'>('free');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
        setUser(session?.user || null);
        
        if (session?.user) {
          await loadUserSubscription(session.user.id);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      setUser(session?.user || null);
      
      if (session?.user && event === 'SIGNED_IN') {
        loadUserSubscription(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setUserPlan('free');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserSubscription = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('plan_type')
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error loading subscription:', error);
      } else {
        if (data && data.length > 0) {
          setUserPlan(data[0].plan_type);
        } else {
          setUserPlan('free');
        }
      }
    } catch (error) {
      console.error('Error loading subscription:', error);
      setUserPlan('free');
    }
  };

  const handleSignOut = async () => {
    setIsAuthLoading(true);
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleShowAuthForm = () => {
    // This will be handled by the FlashcardGenerator component
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <StudyHeader
        isAuthenticated={isAuthenticated}
        user={user}
        onShowAuthForm={handleShowAuthForm}
        onSignOut={handleSignOut}
        isAuthLoading={isAuthLoading}
        userPlan={userPlan}
      />
      <main className="flex-1">
        <FlashcardGenerator />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
