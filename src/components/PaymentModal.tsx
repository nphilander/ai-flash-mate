import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Check, Crown, Zap, Infinity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userEmail: string;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  features: string[];
  popular?: boolean;
  flashcardLimit: number;
}

const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    currency: "USD",
    features: [
      "5 flashcard sets",
      "Basic AI generation",
      "Standard support",
      "Web access only"
    ],
    flashcardLimit: 50
  },
  {
    id: "premium",
    name: "Premium",
    price: 9.99,
    currency: "USD",
    features: [
      "Unlimited flashcard sets",
      "Advanced AI generation",
      "Priority support",
      "Mobile app access",
      "Export to PDF",
      "Study analytics",
      "Custom themes"
    ],
    popular: true,
    flashcardLimit: -1 // Unlimited
  }
];

export const PaymentModal = ({ isOpen, onClose, onSuccess, userEmail }: PaymentModalProps) => {
  const [selectedPlan, setSelectedPlan] = useState<string>("premium");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handlePayment = async () => {
    if (selectedPlan === "free") {
      onSuccess();
      onClose();
      return;
    }

    setIsProcessing(true);
    try {
      // Simulate Intasend API integration
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: selectedPlan,
          email: userEmail,
          amount: plans.find(p => p.id === selectedPlan)?.price || 0,
          currency: 'USD'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Redirect to Intasend payment page or handle payment
        if (data.payment_url) {
          window.location.href = data.payment_url;
        } else {
          // Simulate successful payment for demo
          toast({
            title: "Payment Successful!",
            description: "Welcome to Premium! You now have unlimited access to all features.",
          });
          onSuccess();
          onClose();
        }
      } else {
        throw new Error('Payment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const selectedPlanData = plans.find(p => p.id === selectedPlan);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="h-6 w-6 text-yellow-500" />
            Choose Your Plan
          </DialogTitle>
          <DialogDescription>
            Select the perfect plan for your study needs. Upgrade anytime!
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {plans.map((plan) => (
            <Card 
              key={plan.id}
              className={`relative cursor-pointer transition-all ${
                selectedPlan === plan.id 
                  ? 'ring-2 ring-primary shadow-lg' 
                  : 'hover:shadow-md'
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-500">
                  Most Popular
                </Badge>
              )}
              
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    {plan.id === 'premium' ? (
                      <Crown className="h-5 w-5 text-yellow-500" />
                    ) : (
                      <Zap className="h-5 w-5 text-blue-500" />
                    )}
                    {plan.name}
                  </CardTitle>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      ${plan.price}
                      <span className="text-sm font-normal text-muted-foreground">
                        /month
                      </span>
                    </div>
                  </div>
                </div>
                <CardDescription>
                  {plan.flashcardLimit === -1 ? (
                    <span className="flex items-center gap-1">
                      <Infinity className="h-4 w-4" />
                      Unlimited flashcards
                    </span>
                  ) : (
                    `Up to ${plan.flashcardLimit} flashcards`
                  )}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex gap-3 mt-6">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button 
            onClick={handlePayment}
            disabled={isProcessing}
            className="flex-1"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : selectedPlan === "free" ? (
              "Continue with Free"
            ) : (
              `Upgrade to ${selectedPlanData?.name}`
            )}
          </Button>
        </div>

        <div className="text-xs text-muted-foreground text-center mt-4">
          Secure payment powered by Intasend. You can cancel your subscription anytime.
        </div>
      </DialogContent>
    </Dialog>
  );
};
