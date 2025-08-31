import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, BookOpen, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FlashcardGrid } from "./FlashcardGrid";

interface Flashcard {
  id?: string;
  question: string;
  answer: string;
  difficulty: string;
  set_name: string;
}

export const FlashcardGenerator = () => {
  const [studyNotes, setStudyNotes] = useState("");
  const [setName, setSetName] = useState("");
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  // Check authentication status
  useState(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  });

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
      const { data, error } = await supabase.functions.invoke('generate-flashcards', {
        body: { studyNotes }
      });

      if (error) throw error;

      if (data?.flashcards && data.flashcards.length > 0) {
        const newFlashcards = data.flashcards.map((card: any) => ({
          ...card,
          set_name: setName
        }));

        setFlashcards(newFlashcards);

        // Save to database if authenticated
        if (isAuthenticated) {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const cardsToInsert = newFlashcards.map(card => ({
              question: card.question,
              answer: card.answer,
              difficulty: card.difficulty,
              set_name: setName,
              user_id: user.id
            }));

            const { error: insertError } = await supabase
              .from('flashcards')
              .insert(cardsToInsert);

            if (insertError) {
              console.error('Error saving flashcards:', insertError);
            } else {
              toast({
                title: "Success!",
                description: `Generated and saved ${newFlashcards.length} flashcards.`,
              });
            }
          }
        } else {
          toast({
            title: "Flashcards Generated!",
            description: `Created ${newFlashcards.length} flashcards. Sign in to save them permanently.`,
          });
        }
      } else {
        throw new Error('No flashcards generated');
      }
    } catch (error) {
      console.error('Error generating flashcards:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate flashcards. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Input Section */}
      <Card className="animate-pulse-glow">
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
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Flashcards
              </>
            )}
          </Button>

          {!isAuthenticated && (
            <p className="text-sm text-muted-foreground text-center">
              💡 Sign in to save your flashcards permanently
            </p>
          )}
        </CardContent>
      </Card>

      {/* Flashcards Display */}
      {flashcards.length > 0 && (
        <FlashcardGrid flashcards={flashcards} />
      )}
    </div>
  );
};