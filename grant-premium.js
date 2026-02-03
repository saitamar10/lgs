// Script to grant premium to specific users via RevenueCat
import { grantPromotionalEntitlement } from './src/lib/revenuecat.js';

const users = [
  'f1f01785-cbf4-491b-b063-5f9f51d3f08f',
  'c22e0d91-0799-4857-a7e5-fa95a9667254'
];

async function grantPremium() {
  for (const userId of users) {
    console.log(`Granting premium to user: ${userId}`);
    try {
      // Grant 365 days (1 year) premium
      const success = await grantPromotionalEntitlement(userId, 'premium', 365);
      if (success) {
        console.log(`✅ Premium granted to ${userId}`);
      } else {
        console.log(`❌ Failed to grant premium to ${userId}`);
      }
    } catch (error) {
      console.error(`Error granting premium to ${userId}:`, error);
    }
  }
}

grantPremium();
