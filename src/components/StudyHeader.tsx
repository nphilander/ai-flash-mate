import { BookOpen, GraduationCap, Brain } from "lucide-react";

export const StudyHeader = () => {
  return (
    <header className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 py-12 mb-8">
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