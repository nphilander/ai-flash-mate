import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, Check, Crown, Zap, Infinity, CreditCard, Lock, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PaymentSuccess } from "./PaymentSuccess";

interface CartModalProps {
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

interface PaymentForm {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  billingEmail: string;
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

type CheckoutStep = 'cart' | 'payment' | 'processing' | 'success';

export const CartModal = ({ isOpen, onClose, onSuccess, userEmail }: CartModalProps) => {
  const [selectedPlan, setSelectedPlan] = useState<string>("premium");
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>('cart');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentForm, setPaymentForm] = useState<PaymentForm>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingEmail: userEmail
  });
  const { toast } = useToast();

  const selectedPlanData = plans.find(p => p.id === selectedPlan);

  const handleAddToCart = () => {
    if (selectedPlan === "free") {
      onSuccess();
      onClose();
      return;
    }
    setCheckoutStep('payment');
  };

  const handlePayment = async () => {
    if (!validatePaymentForm()) {
      return;
    }

    setIsProcessing(true);
    setCheckoutStep('processing');

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Simulate successful payment
      toast({
        title: "Payment Successful!",
        description: "Welcome to Premium! You now have unlimited access to all features.",
      });
      
      setCheckoutStep('success');
      
      // Wait a moment then close and update
      setTimeout(() => {
        onSuccess();
        onClose();
        resetModal();
      }, 2000);

    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
      setCheckoutStep('payment');
    } finally {
      setIsProcessing(false);
    }
  };

  const validatePaymentForm = (): boolean => {
    if (!paymentForm.cardNumber || paymentForm.cardNumber.length < 16) {
      toast({
        title: "Invalid Card Number",
        description: "Please enter a valid 16-digit card number.",
        variant: "destructive",
      });
      return false;
    }

    if (!paymentForm.expiryDate || !/^\d{2}\/\d{2}$/.test(paymentForm.expiryDate)) {
      toast({
        title: "Invalid Expiry Date",
        description: "Please enter expiry date in MM/YY format.",
        variant: "destructive",
      });
      return false;
    }

    if (!paymentForm.cvv || paymentForm.cvv.length < 3) {
      toast({
        title: "Invalid CVV",
        description: "Please enter a valid 3-digit CVV.",
        variant: "destructive",
      });
      return false;
    }

    if (!paymentForm.cardholderName.trim()) {
      toast({
        title: "Missing Cardholder Name",
        description: "Please enter the cardholder name.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const resetModal = () => {
    setCheckoutStep('cart');
    setPaymentForm({
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardholderName: '',
      billingEmail: userEmail
    });
  };

  const handleClose = () => {
    if (checkoutStep === 'processing') return; // Prevent closing during processing
    onClose();
    resetModal();
  };

  const renderCartStep = () => (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Crown className="h-6 w-6 text-yellow-500" />
          Choose Your Plan
        </DialogTitle>
        <DialogDescription>
          Select the perfect plan for your study needs. Upgrade anytime!
        </DialogDescription>
      </DialogHeader>

             <div className="grid grid-cols-1 gap-4 mt-4 md:mt-6 md:grid-cols-2 md:gap-6">
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
               <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                 <CardTitle className="flex items-center gap-2">
                   {plan.id === 'premium' ? (
                     <Crown className="h-5 w-5 text-yellow-500" />
                   ) : (
                     <Zap className="h-5 w-5 text-blue-500" />
                   )}
                   {plan.name}
                 </CardTitle>
                 <div className="text-left sm:text-right">
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

             <div className="flex flex-col gap-3 mt-4 md:mt-6 md:flex-row">
        <Button variant="outline" onClick={handleClose} className="flex-1">
          Cancel
        </Button>
        <Button 
          onClick={handleAddToCart}
          className="flex-1"
        >
          {selectedPlan === "free" ? "Continue with Free" : "Add to Cart"}
        </Button>
      </div>
    </>
  );

  const renderPaymentStep = () => (
    <>
      <DialogHeader>
        <div className="flex items-center gap-2 mb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCheckoutStep('cart')}
            className="p-0 h-auto"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Plans
          </Button>
        </div>
        <DialogTitle className="flex items-center gap-2">
          <CreditCard className="h-6 w-6 text-primary" />
          Secure Checkout
        </DialogTitle>
        <DialogDescription>
          Complete your purchase to unlock Premium features
        </DialogDescription>
      </DialogHeader>

             <div className="space-y-4 mt-4">
         {/* Order Summary */}
         <Card>
           <CardHeader className="pb-3">
             <CardTitle className="text-lg">Order Summary</CardTitle>
           </CardHeader>
           <CardContent className="pt-0">
             <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
               <div>
                 <p className="font-medium">{selectedPlanData?.name} Plan</p>
                 <p className="text-sm text-muted-foreground">Monthly subscription</p>
               </div>
               <div className="text-left sm:text-right">
                 <p className="text-xl font-bold">${selectedPlanData?.price}</p>
                 <p className="text-sm text-muted-foreground">per month</p>
               </div>
             </div>
           </CardContent>
         </Card>

                 {/* Payment Form */}
         <Card>
           <CardHeader className="pb-3">
             <CardTitle className="flex items-center gap-2">
               <Lock className="h-5 w-5 text-green-500" />
               Payment Information
             </CardTitle>
             <CardDescription>
               Your payment information is secure and encrypted
             </CardDescription>
           </CardHeader>
           <CardContent className="space-y-3 pt-0">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={paymentForm.cardNumber}
                onChange={(e) => setPaymentForm(prev => ({
                  ...prev,
                  cardNumber: formatCardNumber(e.target.value)
                }))}
                maxLength={19}
              />
            </div>

                         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  placeholder="MM/YY"
                  value={paymentForm.expiryDate}
                  onChange={(e) => setPaymentForm(prev => ({
                    ...prev,
                    expiryDate: formatExpiryDate(e.target.value)
                  }))}
                  maxLength={5}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={paymentForm.cvv}
                  onChange={(e) => setPaymentForm(prev => ({
                    ...prev,
                    cvv: e.target.value.replace(/\D/g, '').slice(0, 4)
                  }))}
                  maxLength={4}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardholderName">Cardholder Name</Label>
              <Input
                id="cardholderName"
                placeholder="John Doe"
                value={paymentForm.cardholderName}
                onChange={(e) => setPaymentForm(prev => ({
                  ...prev,
                  cardholderName: e.target.value
                }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="billingEmail">Billing Email</Label>
              <Input
                id="billingEmail"
                type="email"
                placeholder="billing@example.com"
                value={paymentForm.billingEmail}
                onChange={(e) => setPaymentForm(prev => ({
                  ...prev,
                  billingEmail: e.target.value
                }))}
              />
            </div>
          </CardContent>
        </Card>

                 {/* Mock Card Suggestions */}
         <div className="bg-muted/50 p-3 rounded-lg">
           <p className="text-sm font-medium mb-1">💡 Test Cards (Demo Only)</p>
           <div className="space-y-1 text-xs text-muted-foreground">
             <p>Visa: 4242 4242 4242 4242</p>
             <p>Mastercard: 5555 5555 5555 4444</p>
             <p>Any future date for expiry, any 3 digits for CVV</p>
           </div>
         </div>

                   <div className="flex flex-col gap-3 pt-2 sm:flex-row">
           <Button variant="outline" onClick={handleClose} className="flex-1">
             Cancel
           </Button>
           <Button 
             onClick={handlePayment}
             className="flex-1"
           >
             Pay ${selectedPlanData?.price}
           </Button>
         </div>
      </div>
    </>
  );

  const renderProcessingStep = () => (
    <div className="text-center py-12">
      <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
      <h3 className="text-xl font-semibold mb-2">Processing Payment...</h3>
      <p className="text-muted-foreground">
        Please wait while we securely process your payment.
      </p>
    </div>
  );

  const renderSuccessStep = () => (
    <PaymentSuccess
      planName={selectedPlanData?.name || 'Premium'}
      amount={selectedPlanData?.price || 0}
      userEmail={userEmail}
    />
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto mx-4">
        {checkoutStep === 'cart' && renderCartStep()}
        {checkoutStep === 'payment' && renderPaymentStep()}
        {checkoutStep === 'processing' && renderProcessingStep()}
        {checkoutStep === 'success' && renderSuccessStep()}
      </DialogContent>
    </Dialog>
  );
};
