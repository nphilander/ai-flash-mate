import { BookOpen, GraduationCap, Brain, User, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface StudyHeaderProps {
  isAuthenticated: boolean;
  user: any;
  onShowAuthForm: () => void;
  onSignOut: () => void;
  isAuthLoading: boolean;
  userPlan?: 'free' | 'premium';
}

export const StudyHeader = ({
  isAuthenticated,
  user,
  onShowAuthForm,
  onSignOut,
  isAuthLoading,
  userPlan = 'free'
}: StudyHeaderProps) => {
  return (
    <header className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 py-12 mb-8">
      {/* Navigation Bar */}
      <div className="container mx-auto px-6 mb-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-primary">Study Mate</span>
            {userPlan === 'premium' && (
              <Crown className="h-5 w-5 text-yellow-500" />
            )}
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-primary" />
                  <span className="font-medium">{user?.email}</span>
                  <Badge
                    variant={userPlan === 'premium' ? "default" : "secondary"}
                    className={userPlan === 'premium' ? "bg-gradient-to-r from-yellow-400 to-orange-500" : ""}
                  >
                    {userPlan === 'premium' ? (
                      <span className="flex items-center gap-1">
                        <Crown className="h-3 w-3" />
                        Premium
                      </span>
                    ) : (
                      'Free'
                    )}
                  </Badge>
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
        <div className="flex justify-center items-center gap-4 mb-4">
          <BookOpen className="h-12 w-12 text-primary" />
          <GraduationCap className="h-12 w-12 text-secondary" />
          <Brain className="h-12 w-12 text-accent" />
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          AI Flashcard Generator
        </h1>

        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Transform your study notes into interactive flashcards with AI.
          {userPlan === 'premium' ? (
            <span className="text-yellow-600 font-medium"> Enjoy unlimited access with Premium! ✨</span>
          ) : (
            <span> Start with our free plan or upgrade to Premium for unlimited features.</span>
          )}
        </p>
      </div>
    </header>
  );
};