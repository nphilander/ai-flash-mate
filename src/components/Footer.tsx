import { Heart, ExternalLink } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-card border-t mt-16">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500 fill-current" />
            <span>by</span>
            <span className="font-medium text-foreground">Nokhwezi P</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Hosted on</span>
            <a 
              href="https://ai-flash-mate.netlify.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
            >
              <span>Netlify</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs text-center text-muted-foreground">
            © 2024 Study Mate. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
