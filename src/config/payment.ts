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
      amount: 4900, // kuruş cinsinden
      name: 'Plus Aylık',
      duration: '1 Ay',
      displayPrice: '₺49',
    },
    premium: {
      amount: 39900,
      name: 'Plus Yıllık',
      duration: '1 Yıl',
      displayPrice: '₺399',
    },
  },
};

export const getPayTRIframeUrl = (token: string) => {
  return `${PAYMENT_CONFIG.PAYTR_IFRAME_URL}${token}`;
};
