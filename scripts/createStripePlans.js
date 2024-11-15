const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function createPlans() {
  try {
    // Free Plan
    await stripe.plans.create({
      amount: 0,
      interval: 'month',
      product: {
        name: 'Free Plan',
      },
      currency: 'usd',
      nickname: 'Free',
    });

    // Pro Plan
    await stripe.plans.create({
      amount: 2900, // $29.00
      interval: 'month',
      product: {
        name: 'Pro Plan',
      },
      currency: 'usd',
      nickname: 'Pro',
    });

    // Enterprise Plan
    // Note: Enterprise plan is custom, typically handled via sales, not automated
    console.log('Plans created successfully.');
  } catch (error) {
    console.error('Error creating plans:', error);
  }
}

createPlans();
