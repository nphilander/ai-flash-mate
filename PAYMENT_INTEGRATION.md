# Payment Integration with Intasend API

This document outlines the freemium/premium subscription system integrated with Intasend payment processing.

## 🏗️ **System Architecture**

### **Database Schema**
- **`subscriptions`** - User subscription plans and status
- **`payments`** - Payment history and transaction records
- **`flashcards`** - Enhanced with user limits based on plan

### **Plan Tiers**
- **Free Plan**: 50 flashcards, basic features
- **Premium Plan**: Unlimited flashcards, advanced features

## 🔧 **Components**

### **1. PaymentModal Component**
- Plan selection interface
- Intasend payment integration
- Success/failure handling

### **2. SubscriptionStatus Component**
- Current plan display
- Usage statistics
- Upgrade prompts

### **3. Enhanced FlashcardGenerator**
- Plan-based limits enforcement
- Upgrade prompts when limits reached
- Premium feature indicators

## 💳 **Intasend Integration**

### **Setup Requirements**
```bash
# Install Intasend SDK
npm install intasend-node

# Environment variables
INTASEND_PUBLISHABLE_KEY=your_publishable_key
INTASEND_SECRET_KEY=your_secret_key
BASE_URL=https://your-domain.com
```

### **Payment Flow**
1. User selects Premium plan
2. PaymentModal calls Intasend API
3. User redirected to Intasend payment page
4. Payment callback updates subscription status
5. User gains Premium access

### **API Endpoints**
```typescript
// Create payment
POST /api/create-payment
{
  "plan": "premium",
  "email": "user@example.com",
  "amount": 9.99,
  "currency": "USD"
}

// Payment callback
POST /api/payment-callback
{
  "state": "COMPLETE",
  "invoice_id": "INV_123",
  "payment_id": "PAY_456"
}
```

## 🎯 **Features by Plan**

### **Free Plan**
- ✅ 50 flashcards maximum
- ✅ Basic AI generation
- ✅ Web access
- ✅ Standard support
- ❌ Export features
- ❌ Advanced analytics

### **Premium Plan**
- ✅ Unlimited flashcards
- ✅ Advanced AI generation
- ✅ Priority support
- ✅ Mobile app access
- ✅ PDF export
- ✅ Study analytics
- ✅ Custom themes

## 🔒 **Security & Validation**

### **Database Functions**
```sql
-- Check user's current plan
SELECT public.get_user_plan(user_uuid);

-- Validate flashcard creation
SELECT public.can_create_flashcards(user_uuid);
```

### **Row Level Security**
- Users can only access their own data
- Subscription status enforced at database level
- Payment records protected by RLS policies

## 🚀 **Deployment**

### **1. Database Migration**
```bash
# Run the updated migration
supabase db push
```

### **2. Environment Setup**
```bash
# Add Intasend credentials
INTASEND_PUBLISHABLE_KEY=pk_test_...
INTASEND_SECRET_KEY=sk_test_...
```

### **3. Webhook Configuration**
- Configure Intasend webhooks for payment callbacks
- Set up success/failure redirect URLs

## 📊 **Usage Tracking**

### **Free Plan Limits**
- Flashcard count: 50 maximum
- Set count: 5 maximum
- Generation frequency: Standard

### **Premium Plan Benefits**
- Unlimited flashcards
- Unlimited sets
- Priority generation queue
- Advanced AI models

## 🔄 **Subscription Management**

### **Upgrade Flow**
1. User clicks "Upgrade to Premium"
2. PaymentModal opens with plan options
3. User completes payment via Intasend
4. Subscription status updated in database
5. User immediately gains Premium access

### **Downgrade Flow**
1. User cancels subscription
2. Current period continues until end
3. User reverts to Free plan
4. Existing flashcards preserved
5. New generation limited to Free tier

## 🛠️ **Development Notes**

### **Testing**
- Use Intasend test keys for development
- Simulate payment flows with test cards
- Verify subscription status updates

### **Error Handling**
- Payment failures gracefully handled
- Subscription status fallback to Free
- User-friendly error messages

### **Performance**
- Subscription status cached locally
- Database queries optimized
- Payment processing asynchronous

## 📈 **Analytics & Monitoring**

### **Key Metrics**
- Conversion rate (Free → Premium)
- Payment success rate
- User engagement by plan
- Revenue tracking

### **Monitoring**
- Payment processing errors
- Subscription status changes
- User limit enforcement
- API response times

## 🔮 **Future Enhancements**

### **Planned Features**
- Annual billing options
- Team/enterprise plans
- Usage-based pricing
- Referral program

### **Integration Opportunities**
- Multiple payment providers
- Subscription management dashboard
- Automated billing reminders
- Usage analytics dashboard
