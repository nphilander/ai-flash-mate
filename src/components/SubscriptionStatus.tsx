import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, Zap, Calendar, CreditCard, Settings, ShoppingCart } from "lucide-react";

interface SubscriptionStatusProps {
  userPlan: 'free' | 'premium';
  flashcardCount: number;
  flashcardLimit: number;
  onUpgrade: () => void;
  onManageSubscription: () => void;
}

export const SubscriptionStatus = ({ 
  userPlan, 
  flashcardCount, 
  flashcardLimit, 
  onUpgrade, 
  onManageSubscription 
}: SubscriptionStatusProps) => {
  const isPremium = userPlan === 'premium';
  const usagePercentage = flashcardLimit === -1 ? 0 : (flashcardCount / flashcardLimit) * 100;
  const isNearLimit = usagePercentage > 80;

  return (
    <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
      <CardHeader>
                 <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
           <div className="flex items-center gap-2">
             {isPremium ? (
               <Crown className="h-5 w-5 text-yellow-500" />
             ) : (
               <Zap className="h-5 w-5 text-blue-500" />
             )}
             <CardTitle className="text-lg">
               {isPremium ? 'Premium Plan' : 'Free Plan'}
             </CardTitle>
             <Badge 
               variant={isPremium ? "default" : "secondary"}
               className={isPremium ? "bg-gradient-to-r from-yellow-400 to-orange-500" : ""}
             >
               {isPremium ? 'Premium' : 'Free'}
             </Badge>
           </div>
           {!isPremium && (
             <Button onClick={onUpgrade} size="sm" className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 w-full sm:w-auto">
               <ShoppingCart className="h-4 w-4 mr-2" />
               Add to Cart
             </Button>
           )}
         </div>
        <CardDescription>
          {isPremium 
            ? "You have unlimited access to all features" 
            : "Upgrade to unlock unlimited flashcards and premium features"
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
                 {/* Usage Stats */}
         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="text-center p-3 bg-background rounded-lg">
            <div className="text-2xl font-bold text-primary">
              {flashcardCount}
            </div>
            <div className="text-sm text-muted-foreground">Flashcards Created</div>
          </div>
          
          <div className="text-center p-3 bg-background rounded-lg">
            <div className="text-2xl font-bold text-primary">
              {flashcardLimit === -1 ? '∞' : flashcardLimit}
            </div>
            <div className="text-sm text-muted-foreground">Limit</div>
          </div>
        </div>

        {/* Progress Bar for Free Users */}
        {!isPremium && flashcardLimit !== -1 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Usage</span>
              <span>{Math.round(usagePercentage)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all ${
                  isNearLimit ? 'bg-red-500' : 'bg-primary'
                }`}
                style={{ width: `${Math.min(usagePercentage, 100)}%` }}
              />
            </div>
            {isNearLimit && (
              <p className="text-sm text-red-600">
                You're approaching your limit. Consider upgrading to Premium!
              </p>
            )}
          </div>
        )}

        {/* Plan Features */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Current Plan Features:</h4>
          <div className="grid grid-cols-1 gap-2">
            {isPremium ? (
              <>
                <div className="flex items-center gap-2 text-sm">
                  <Crown className="h-4 w-4 text-yellow-500" />
                  Unlimited flashcard sets
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Crown className="h-4 w-4 text-yellow-500" />
                  Advanced AI generation
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Crown className="h-4 w-4 text-yellow-500" />
                  Priority support
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Crown className="h-4 w-4 text-yellow-500" />
                  Export to PDF
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 text-sm">
                  <Zap className="h-4 w-4 text-blue-500" />
                  Up to 5 flashcard sets
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Zap className="h-4 w-4 text-blue-500" />
                  Basic AI generation
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Zap className="h-4 w-4 text-blue-500" />
                  Standard support
                </div>
              </>
            )}
          </div>
        </div>

                 {/* Action Buttons */}
         <div className="flex flex-col gap-2 pt-2 sm:flex-row">
          {isPremium ? (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onManageSubscription}
              className="flex-1"
            >
              <Settings className="h-4 w-4 mr-2" />
              Manage Subscription
            </Button>
          ) : (
                         <Button 
               onClick={onUpgrade} 
               size="sm" 
               className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 w-full"
             >
               <ShoppingCart className="h-4 w-4 mr-2" />
               Add to Cart
             </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
