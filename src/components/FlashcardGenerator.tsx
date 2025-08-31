import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, BookOpen, Sparkles, Trash2, Plus, User, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FlashcardGrid } from "./FlashcardGrid";

interface Flashcard {
  id?: string;
  question: string;
  answer: string;
  difficulty: string;
  set_name: string;
  created_at?: string;
}

export const FlashcardGenerator = () => {
  const [studyNotes, setStudyNotes] = useState("");
  const [setName, setSetName] = useState("");
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoadingExisting, setIsLoadingExisting] = useState(false);
  const { toast } = useToast();

  // Simple authentication check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
        setUser(session?.user || null);
        
        if (session?.user) {
          await loadExistingFlashcards(session.user.id);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event);
      setIsAuthenticated(!!session);
      setUser(session?.user || null);
      
      if (session?.user && event === 'SIGNED_IN') {
        loadExistingFlashcards(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setFlashcards([]);
        setStudyNotes("");
        setSetName("");
        toast({
          title: "Signed Out",
          description: "You have been successfully signed out.",
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadExistingFlashcards = async (userId: string) => {
    if (isLoadingExisting) return;
    
    setIsLoadingExisting(true);
    try {
      const { data, error } = await supabase
        .from('flashcards')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading flashcards:', error);
        toast({
          title: "Error",
          description: "Failed to load your existing flashcards.",
          variant: "destructive",
        });
      } else {
        setFlashcards(data || []);
        if (data && data.length > 0) {
          toast({
            title: "Flashcards Loaded",
            description: `Loaded ${data.length} existing flashcards.`,
          });
        }
      }
    } catch (error) {
      console.error('Error loading flashcards:', error);
    } finally {
      setIsLoadingExisting(false);
    }
  };

  const deleteFlashcard = async (flashcardId: string) => {
    try {
      const { error } = await supabase
        .from('flashcards')
        .delete()
        .eq('id', flashcardId);

      if (error) {
        console.error('Error deleting flashcard:', error);
        toast({
          title: "Error",
          description: "Failed to delete flashcard.",
          variant: "destructive",
        });
      } else {
        setFlashcards(prev => prev.filter(card => card.id !== flashcardId));
        toast({
          title: "Deleted",
          description: "Flashcard deleted successfully.",
        });
      }
    } catch (error) {
      console.error('Error deleting flashcard:', error);
    }
  };

  const deleteAllFlashcards = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('flashcards')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting all flashcards:', error);
        toast({
          title: "Error",
          description: "Failed to delete all flashcards.",
          variant: "destructive",
        });
      } else {
        setFlashcards([]);
        toast({
          title: "All Flashcards Deleted",
          description: "All your flashcards have been removed.",
        });
      }
    } catch (error) {
      console.error('Error deleting all flashcards:', error);
    }
  };

  const handleSignUp = async (email: string, password: string) => {
    if (!email || !password) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }

    setIsAuthLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) {
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Check your email!",
          description: "We've sent you a confirmation link. Please check your email and click the link to verify your account.",
        });
        setShowAuthForm(false);
      }
    } catch (error) {
      console.error('Sign up error:', error);
      toast({
        title: "Sign up failed",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    if (!email || !password) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }

    setIsAuthLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome back!",
          description: "You've been successfully signed in.",
        });
        setShowAuthForm(false);
      }
    } catch (error) {
      console.error('Sign in error:', error);
      toast({
        title: "Sign in failed",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsAuthLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        toast({
          title: "Sign out failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Signed Out",
          description: "You have been successfully signed out.",
        });
      }
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Sign out failed",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsAuthLoading(false);
    }
  };

  const generateFlashcards = async () => {
    if (!studyNotes.trim()) {
      toast({
        title: "Missing Study Notes",
        description: "Please paste your study notes to generate flashcards.",
        variant: "destructive",
      });
      return;
    }

    if (!setName.trim()) {
      toast({
        title: "Missing Set Name",
        description: "Please provide a name for your flashcard set.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      console.log("Generating flashcards for:", setName);

      const { data, error } = await supabase.functions.invoke('generate-flashcards', {
        body: { studyNotes }
      });

      console.log("Function response:", { data, error });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to generate flashcards');
      }

      if (data?.flashcards && data.flashcards.length > 0) {
        console.log("Flashcards generated:", data.flashcards);
        const newFlashcards = data.flashcards.map((card: any) => ({
          ...card,
          set_name: setName
        }));

        // Save to database if authenticated
        if (isAuthenticated && user) {
          const cardsToInsert = newFlashcards.map(card => ({
            question: card.question,
            answer: card.answer,
            difficulty: card.difficulty,
            set_name: setName,
            user_id: user.id
          }));

          const { data: insertedCards, error: insertError } = await supabase
            .from('flashcards')
            .insert(cardsToInsert)
            .select();

          if (insertError) {
            console.error('Error saving flashcards:', insertError);
            toast({
              title: "Generation Failed",
              description: "Failed to save flashcards to database.",
              variant: "destructive",
            });
          } else {
            // Add the new cards to the existing list
            setFlashcards(prev => [...(insertedCards || []), ...prev]);
            toast({
              title: "Success!",
              description: `Generated and saved ${newFlashcards.length} flashcards.`,
            });
          }
        } else {
          // For non-authenticated users, just show the cards temporarily
          setFlashcards(prev => [...newFlashcards, ...prev]);
          toast({
            title: "Flashcards Generated!",
            description: `Created ${newFlashcards.length} flashcards. Sign in to save them permanently.`,
          });
        }
      } else {
        console.error('No flashcards in response:', data);
        throw new Error('No flashcards were generated. Please try again with different study notes.');
      }
    } catch (error) {
      console.error('Error generating flashcards:', error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate flashcards. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* User Status Bar */}
      <div className="flex justify-between items-center bg-card border rounded-lg p-4">
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <User className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">{user?.email}</p>
                <p className="text-sm text-muted-foreground">
                  {flashcards.length} flashcards saved
                </p>
              </div>
            </>
          ) : (
            <>
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Guest User</p>
                <p className="text-sm text-muted-foreground">
                  Sign in to save your flashcards
                </p>
              </div>
            </>
          )}
        </div>
        
        <div className="flex gap-2">
          {isAuthenticated && flashcards.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={deleteAllFlashcards}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          )}
          
          {isAuthenticated ? (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSignOut}
              disabled={isAuthLoading}
            >
              {isAuthLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4 mr-2" />
              )}
              Sign Out
            </Button>
          ) : (
            <Button 
              onClick={() => setShowAuthForm(true)}
              variant="outline"
              size="sm"
            >
              <User className="h-4 w-4 mr-2" />
              Sign In
            </Button>
          )}
        </div>
      </div>

      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            AI Flashcard Generator
          </CardTitle>
          <CardDescription>
            Paste your study notes and let AI create interactive flashcards for you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="setName">Flashcard Set Name</Label>
            <Input
              id="setName"
              placeholder="e.g., Biology Chapter 5, History Quiz..."
              value={setName}
              onChange={(e) => setSetName(e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="studyNotes">Study Notes</Label>
            <Textarea
              id="studyNotes"
              placeholder="Paste your study material here... The more detailed, the better the flashcards!"
              value={studyNotes}
              onChange={(e) => setStudyNotes(e.target.value)}
              rows={8}
              className="mt-1"
            />
          </div>

          <Button 
            onClick={generateFlashcards}
            disabled={isGenerating || !studyNotes.trim() || !setName.trim()}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Flashcards...
              </>
            ) : !studyNotes.trim() || !setName.trim() ? (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                {!setName.trim() && !studyNotes.trim() 
                  ? "Add Set Name & Study Notes" 
                  : !setName.trim() 
                  ? "Add Flashcard Set Name"
                  : "Paste Study Notes"
                }
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Generate Flashcards
              </>
            )}
          </Button>

          {!isAuthenticated && (
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                💡 Sign in to save your flashcards permanently
              </p>
              
              {!showAuthForm ? (
                <Button 
                  onClick={() => setShowAuthForm(true)}
                  variant="outline"
                  size="sm"
                >
                  Sign In / Sign Up
                </Button>
              ) : (
                <Card className="max-w-md mx-auto">
                  <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Your password"
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={() => isSignUp ? handleSignUp(authEmail, authPassword) : handleSignIn(authEmail, authPassword)}
                        disabled={isAuthLoading}
                        className="flex-1"
                      >
                        {isAuthLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : null}
                        {isSignUp ? 'Sign Up' : 'Sign In'}
                      </Button>
                      
                      <Button
                        variant="outline"
                        onClick={() => setIsSignUp(!isSignUp)}
                        disabled={isAuthLoading}
                      >
                        {isSignUp ? 'Sign In' : 'Sign Up'}
                      </Button>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAuthForm(false)}
                      className="w-full"
                    >
                      Cancel
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Loading State for Existing Flashcards */}
      {isLoadingExisting && (
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your flashcards...</p>
        </div>
      )}

      {/* Flashcards Display */}
      {flashcards.length > 0 && !isLoadingExisting && (
        <FlashcardGrid 
          flashcards={flashcards} 
          onDelete={deleteFlashcard}
          isAuthenticated={isAuthenticated}
        />
      )}
    </div>
  );
};