-- Create flashcards table for storing quiz questions and answers
CREATE TABLE public.flashcards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  set_name TEXT DEFAULT 'Untitled Set',
  difficulty VARCHAR(20) DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create subscriptions table for user plans
CREATE TABLE public.subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_type VARCHAR(20) NOT NULL DEFAULT 'free' CHECK (plan_type IN ('free', 'premium')),
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
  intasend_subscription_id VARCHAR(255),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payments table for tracking payment history
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE CASCADE,
  intasend_payment_id VARCHAR(255),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_method VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Create policies for flashcards
CREATE POLICY "Users can view their own flashcards" 
ON public.flashcards 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own flashcards" 
ON public.flashcards 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own flashcards" 
ON public.flashcards 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own flashcards" 
ON public.flashcards 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create policies for subscriptions
CREATE POLICY "Users can view their own subscriptions" 
ON public.subscriptions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own subscriptions" 
ON public.subscriptions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions" 
ON public.subscriptions 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create policies for payments
CREATE POLICY "Users can view their own payments" 
ON public.payments 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own payments" 
ON public.payments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_flashcards_updated_at
  BEFORE UPDATE ON public.flashcards
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to get user's current plan
CREATE OR REPLACE FUNCTION public.get_user_plan(user_uuid UUID)
RETURNS VARCHAR(20) AS $$
DECLARE
  plan_type VARCHAR(20);
BEGIN
  SELECT s.plan_type INTO plan_type
  FROM public.subscriptions s
  WHERE s.user_id = user_uuid 
    AND s.status = 'active'
    AND (s.current_period_end IS NULL OR s.current_period_end > now())
  ORDER BY s.created_at DESC
  LIMIT 1;
  
  RETURN COALESCE(plan_type, 'free');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if user can create more flashcards
CREATE OR REPLACE FUNCTION public.can_create_flashcards(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_plan VARCHAR(20);
  current_count INTEGER;
BEGIN
  -- Get user's plan
  user_plan := public.get_user_plan(user_uuid);
  
  -- If premium, always allow
  IF user_plan = 'premium' THEN
    RETURN TRUE;
  END IF;
  
  -- For free users, check limits
  SELECT COUNT(*) INTO current_count
  FROM public.flashcards
  WHERE user_id = user_uuid;
  
  -- Free users can have up to 50 flashcards
  RETURN current_count < 50;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;