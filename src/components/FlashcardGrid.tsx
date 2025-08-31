import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RotateCcw, Trash2, Calendar, ChevronDown, ChevronRight, FolderOpen } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface Flashcard {
  id?: string;
  question: string;
  answer: string;
  difficulty: string;
  set_name: string;
  created_at?: string;
}

interface FlashcardGridProps {
  flashcards: Flashcard[];
  onDelete?: (flashcardId: string) => Promise<void>;
  onDeleteSet?: (setName: string) => Promise<void>;
  isAuthenticated?: boolean;
}

interface GroupedFlashcards {
  [setName: string]: Flashcard[];
}

export const FlashcardGrid = ({ flashcards, onDelete, onDeleteSet, isAuthenticated }: FlashcardGridProps) => {
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [expandedSets, setExpandedSets] = useState<Set<string>>(new Set());

  // Group flashcards by set name
  const groupedFlashcards: GroupedFlashcards = flashcards.reduce((groups, flashcard) => {
    const setName = flashcard.set_name || 'Untitled Set';
    if (!groups[setName]) {
      groups[setName] = [];
    }
    groups[setName].push(flashcard);
    return groups;
  }, {} as GroupedFlashcards);

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

  const toggleSet = (setName: string) => {
    setExpandedSets(prev => {
      const newSet = new Set(prev);
      if (newSet.has(setName)) {
        newSet.delete(setName);
      } else {
        newSet.add(setName);
      }
      return newSet;
    });
  };

  const handleDelete = async (e: React.MouseEvent, flashcardId: string) => {
    e.stopPropagation(); // Prevent card flip
    if (onDelete) {
      await onDelete(flashcardId);
    }
  };

  const handleDeleteSet = async (e: React.MouseEvent, setName: string) => {
    e.stopPropagation(); // Prevent set toggle
    if (onDeleteSet) {
      await onDeleteSet(setName);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  const getSetStats = (setCards: Flashcard[]) => {
    const difficulties = setCards.reduce((acc, card) => {
      acc[card.difficulty] = (acc[card.difficulty] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: setCards.length,
      easy: difficulties.easy || 0,
      medium: difficulties.medium || 0,
      hard: difficulties.hard || 0,
    };
  };

  const setNames = Object.keys(groupedFlashcards).sort();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Your Flashcard Collections</h2>
        <p className="text-muted-foreground">
          Organized by topic • {flashcards.length} total cards • {setNames.length} sets
        </p>
      </div>

      {setNames.length === 0 ? (
        <div className="text-center py-12">
          <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No flashcards yet. Generate your first set!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {setNames.map((setName) => {
            const setCards = groupedFlashcards[setName];
            const stats = getSetStats(setCards);
            const isExpanded = expandedSets.has(setName);

            return (
              <Card key={setName} className="overflow-hidden">
                <Collapsible open={isExpanded} onOpenChange={() => toggleSet(setName)}>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FolderOpen className="h-5 w-5 text-primary" />
                          <div>
                            <CardTitle className="text-lg">{setName}</CardTitle>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                              <span>{stats.total} cards</span>
                              {stats.easy > 0 && (
                                <Badge variant="secondary" className="bg-green-100 text-green-800">
                                  {stats.easy} Easy
                                </Badge>
                              )}
                              {stats.medium > 0 && (
                                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                  {stats.medium} Medium
                                </Badge>
                              )}
                              {stats.hard > 0 && (
                                <Badge variant="secondary" className="bg-red-100 text-red-800">
                                  {stats.hard} Hard
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {isAuthenticated && onDeleteSet && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => handleDeleteSet(e, setName)}
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {setCards.map((flashcard, index) => {
                          const isFlipped = flippedCards.has(index);
                          return (
                            <div
                              key={flashcard.id || index}
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
                                      <div className="flex gap-1">
                                        {isAuthenticated && flashcard.id && onDelete && (
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => handleDelete(e, flashcard.id!)}
                                            className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                                          >
                                            <Trash2 className="h-3 w-3" />
                                          </Button>
                                        )}
                                        <RotateCcw className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                      </div>
                                    </div>
                                    
                                    <div className="flex-1 flex items-center justify-center text-center">
                                      <p className="text-lg font-medium leading-relaxed">
                                        {flashcard.question}
                                      </p>
                                    </div>
                                    
                                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                                      <span>Click to reveal answer</span>
                                      {flashcard.created_at && (
                                        <div className="flex items-center gap-1">
                                          <Calendar className="h-3 w-3" />
                                          {formatDate(flashcard.created_at)}
                                        </div>
                                      )}
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
                                      <div className="flex gap-1">
                                        {isAuthenticated && flashcard.id && onDelete && (
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => handleDelete(e, flashcard.id!)}
                                            className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                                          >
                                            <Trash2 className="h-3 w-3" />
                                          </Button>
                                        )}
                                        <RotateCcw className="h-4 w-4 text-muted-foreground" />
                                      </div>
                                    </div>
                                    
                                    <div className="flex-1 flex items-center justify-center text-center">
                                      <p className="text-base leading-relaxed text-foreground">
                                        {flashcard.answer}
                                      </p>
                                    </div>
                                    
                                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                                      <span>Click to see question</span>
                                      {flashcard.created_at && (
                                        <div className="flex items-center gap-1">
                                          <Calendar className="h-3 w-3" />
                                          {formatDate(flashcard.created_at)}
                                        </div>
                                      )}
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};