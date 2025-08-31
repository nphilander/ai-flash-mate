import { StudyHeader } from "@/components/StudyHeader";
import { FlashcardGenerator } from "@/components/FlashcardGenerator";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <StudyHeader />
      <main>
        <FlashcardGenerator />
      </main>
    </div>
  );
};

export default Index;
