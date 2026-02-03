import axios from 'axios';

/**
 * RevenueCat REST API Integration for Web
 * API Key: test_COfzeyxLiqKRWhrXUZepVQrrPyT
 */

const REVENUECAT_API_KEY = 'test_COfzeyxLiqKRWhrXUZepVQrrPyT';
const REVENUECAT_BASE_URL = 'https://api.revenuecat.com/v1';

const revenueCatApi = axios.create({
  baseURL: REVENUECAT_BASE_URL,
  headers: {
    'Authorization': `Bearer ${REVENUECAT_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

export interface Subscriber {
  subscriber: {
    subscriptions: {
      [key: string]: {
        expires_date: string;
        purchase_date: string;
        billing_issues_detected_at: string | null;
        unsubscribe_detected_at: string | null;
        is_sandbox: boolean;
        original_purchase_date: string;
        store: string;
      };
    };
    entitlements: {
      [key: string]: {
        expires_date: string | null;
        purchase_date: string;
        product_identifier: string;
      };
    };
    original_app_user_id: string;
    original_application_version: string | null;
    first_seen: string;
  };
}

export interface SubscriptionOffering {
  identifier: string;
  description: string;
  packages: SubscriptionPackage[];
}

export interface SubscriptionPackage {
  identifier: string;
  platform_product_identifier: string;
  price: string;
  currency: string;
  duration: string;
}

/**
 * Get subscriber info from RevenueCat
 */
export async function getSubscriberInfo(userId: string): Promise<Subscriber | null> {
  try {
    const response = await revenueCatApi.get(`/subscribers/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching subscriber info:', error);
    return null;
  }
}

/**
 * Check if user has active subscription
 */
export async function hasActiveSubscription(userId: string): Promise<boolean> {
  try {
    const subscriberInfo = await getSubscriberInfo(userId);

    if (!subscriberInfo) return false;

    // Check if user has any active entitlements
    const entitlements = subscriberInfo.subscriber.entitlements;

    for (const entitlementKey in entitlements) {
      const entitlement = entitlements[entitlementKey];
      const expiresDate = entitlement.expires_date;

      // If expires_date is null, it's a lifetime subscription
      if (!expiresDate) return true;

      // Check if subscription is still active
      const isActive = new Date(expiresDate) > new Date();
      if (isActive) return true;
    }

    return false;
  } catch (error) {
    console.error('Error checking subscription status:', error);
    return false;
  }
}

/**
 * Create or update subscriber in RevenueCat
 */
export async function createSubscriber(userId: string, email?: string): Promise<boolean> {
  try {
    await revenueCatApi.post(`/subscribers/${userId}`, {
      app_user_id: userId,
      attributes: email ? { email: { value: email } } : {},
    });
    return true;
  } catch (error) {
    console.error('Error creating subscriber:', error);
    return false;
  }
}

/**
 * Grant promotional entitlement (for testing)
 */
export async function grantPromotionalEntitlement(
  userId: string,
  entitlementIdentifier: string = 'premium',
  durationDays: number = 30
): Promise<boolean> {
  try {
    const expiresDate = new Date();
    expiresDate.setDate(expiresDate.getDate() + durationDays);

    await revenueCatApi.post(`/subscribers/${userId}/entitlements/${entitlementIdentifier}/promotional`, {
      duration: 'custom',
      expires_at: expiresDate.toISOString(),
    });
    return true;
  } catch (error) {
    console.error('Error granting promotional entitlement:', error);
    return false;
  }
}

/**
 * Revoke promotional entitlement
 */
export async function revokePromotionalEntitlement(
  userId: string,
  entitlementIdentifier: string = 'premium'
): Promise<boolean> {
  try {
    await revenueCatApi.delete(`/subscribers/${userId}/entitlements/${entitlementIdentifier}/promotional`);
    return true;
  } catch (error) {
    console.error('Error revoking promotional entitlement:', error);
    return false;
  }
}

/**
 * Get subscription offerings (products)
 */
export async function getOfferings(): Promise<SubscriptionOffering[]> {
  // For web, you'll need to configure these offerings manually
  // or fetch from your backend
  return [
    {
      identifier: 'monthly',
      description: 'Aylık Premium Abonelik',
      packages: [
        {
          identifier: 'monthly_premium',
          platform_product_identifier: 'com.lgscalis.premium.monthly',
          price: '29.99',
          currency: 'TRY',
          duration: '1 Ay',
        },
      ],
    },
    {
      identifier: 'yearly',
      description: 'Yıllık Premium Abonelik',
      packages: [
        {
          identifier: 'yearly_premium',
          platform_product_identifier: 'com.lgscalis.premium.yearly',
          price: '249.99',
          currency: 'TRY',
          duration: '1 Yıl',
        },
      ],
    },
  ];
}

export default {
  getSubscriberInfo,
  hasActiveSubscription,
  createSubscriber,
  grantPromotionalEntitlement,
  revokePromotionalEntitlement,
  getOfferings,
};
