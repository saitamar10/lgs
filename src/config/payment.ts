// Payment configuration
// PayTR iFrame integration

export const PAYMENT_CONFIG = {
  // Payment method
  PAYMENT_METHOD: 'paytr' as const,

  // PayTR iFrame base URL
  PAYTR_IFRAME_URL: 'https://www.paytr.com/odeme/guvenli/',

  // Plans
  PLANS: {
    plus: {
      amount: 4500, // kuruş cinsinden
      name: 'Plus Aylık',
      duration: '1 Ay',
      displayPrice: '₺45',
    },
    premium: {
      amount: 45000,
      name: 'Plus Yıllık',
      duration: '1 Yıl',
      displayPrice: '₺450',
    },
  },
};

export const getPayTRIframeUrl = (token: string) => {
  return `${PAYMENT_CONFIG.PAYTR_IFRAME_URL}${token}`;
};
