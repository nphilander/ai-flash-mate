import { BookOpen, GraduationCap, Brain, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StudyHeaderProps {
  isAuthenticated: boolean;
  user: any;
  onShowAuthForm: () => void;
  onSignOut: () => void;
  isAuthLoading: boolean;
}

export const StudyHeader = ({ 
  isAuthenticated, 
  user, 
  onShowAuthForm, 
  onSignOut, 
  isAuthLoading 
}: StudyHeaderProps) => {
  return (
    <header className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 py-12 mb-8">
      {/* Navigation Bar */}
      <div className="container mx-auto px-6 mb-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-primary">Study Mate</span>
          </div>
          
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-primary" />
                  <span className="font-medium">{user?.email}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onSignOut}
                  disabled={isAuthLoading}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button 
                onClick={onShowAuthForm}
                variant="outline"
                size="sm"
              >
                <User className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Header Content */}
      <div className="container mx-auto px-6 text-center">
        <div className="flex justify-center items-center mb-6">
          <div className="relative">
            <BookOpen className="h-16 w-16 text-primary animate-bounce-slow" />
            <div className="absolute -top-2 -right-2">
              <Brain className="h-8 w-8 text-accent animate-pulse" />
            </div>
            <div className="absolute -bottom-2 -left-2">
              <GraduationCap className="h-8 w-8 text-secondary animate-bounce" />
            </div>
          </div>
        </div>
        
        <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-4">
          Study Mate
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
          Transform your study notes into interactive flashcards with the power of AI
        </p>
        
        <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span>AI-Powered Generation</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
            <span>Interactive Flashcards</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
            <span>Smart Study Tools</span>
          </div>
        </div>
      </div>
    </header>
  );
};