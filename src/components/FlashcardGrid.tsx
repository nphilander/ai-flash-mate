import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RotateCcw } from "lucide-react";

interface Flashcard {
  id?: string;
  question: string;
  answer: string;
  difficulty: string;
  set_name: string;
}

interface FlashcardGridProps {
  flashcards: Flashcard[];
}

export const FlashcardGrid = ({ flashcards }: FlashcardGridProps) => {
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());

  const flipCard = (index: number) => {
    setFlippedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Your Flashcard Set</h2>
        <p className="text-muted-foreground">
          Click any card to flip and see the answer • {flashcards.length} cards generated
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {flashcards.map((flashcard, index) => {
          const isFlipped = flippedCards.has(index);
          return (
            <div
              key={index}
              className="relative h-64 cursor-pointer group"
              onClick={() => flipCard(index)}
            >
              {/* Card Container with 3D Flip Effect */}
              <div className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                
                {/* Front Side - Question */}
                <Card className="absolute inset-0 backface-hidden border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 group-hover:shadow-lg">
                  <CardContent className="p-6 h-full flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                      <Badge variant="secondary" className={`${getDifficultyColor(flashcard.difficulty)} text-white`}>
                        {flashcard.difficulty}
                      </Badge>
                      <RotateCcw className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    
                    <div className="flex-1 flex items-center justify-center text-center">
                      <p className="text-lg font-medium leading-relaxed">
                        {flashcard.question}
                      </p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Click to reveal answer</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Back Side - Answer */}
                <Card className="absolute inset-0 backface-hidden rotate-y-180 border-2 border-accent/20 bg-accent/5">
                  <CardContent className="p-6 h-full flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                      <Badge variant="outline" className="border-accent text-accent-foreground">
                        Answer
                      </Badge>
                      <RotateCcw className="h-4 w-4 text-muted-foreground" />
                    </div>
                    
                    <div className="flex-1 flex items-center justify-center text-center">
                      <p className="text-base leading-relaxed text-foreground">
                        {flashcard.answer}
                      </p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Click to see question</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};