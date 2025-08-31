import { useState, useEffect } from "react";
import { StudyHeader } from "@/components/StudyHeader";
import { FlashcardGenerator } from "@/components/FlashcardGenerator";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
        setUser(session?.user || null);
      } catch (error) {
        console.error('Error checking auth:', error);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

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
      />
      <main className="flex-1">
        <FlashcardGenerator />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
