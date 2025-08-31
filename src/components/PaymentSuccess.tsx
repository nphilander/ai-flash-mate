import { Check, Crown, Sparkles, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PaymentSuccessProps {
  planName: string;
  amount: number;
  userEmail: string;
}

export const PaymentSuccess = ({ planName, amount, userEmail }: PaymentSuccessProps) => {
  const isPremium = planName.toLowerCase().includes('premium');

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-muted-foreground">
          Thank you for your purchase. Your subscription is now active.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isPremium ? (
              <Crown className="h-6 w-6 text-yellow-500" />
            ) : (
              <Zap className="h-6 w-6 text-blue-500" />
            )}
            Order Confirmation
          </CardTitle>
          <CardDescription>
            Here are the details of your purchase
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-medium">Plan:</span>
            <Badge variant={isPremium ? "default" : "secondary"}>
              {planName}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Amount:</span>
            <span className="text-lg font-bold">${amount}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Billing Email:</span>
            <span className="text-sm text-muted-foreground">{userEmail}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Billing Cycle:</span>
            <span className="text-sm text-muted-foreground">Monthly</span>
          </div>
        </CardContent>
      </Card>

      {isPremium && (
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <Sparkles className="h-5 w-5" />
              Welcome to Premium!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-yellow-800 font-medium">
                You now have access to all Premium features:
              </p>
              <ul className="space-y-2 text-sm text-yellow-700">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  Unlimited flashcard sets
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  Advanced AI generation
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  Priority support
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  Export to PDF
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  Study analytics
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  Custom themes
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-medium text-blue-900 mb-2">What's Next?</h3>
        <ul className="space-y-1 text-sm text-blue-800">
          <li>• You'll receive a confirmation email shortly</li>
          <li>• Your subscription will automatically renew monthly</li>
          <li>• You can manage your subscription anytime</li>
          <li>• Start creating unlimited flashcards right away!</li>
        </ul>
      </div>
    </div>
  );
};
