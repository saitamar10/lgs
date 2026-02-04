// Payment configuration
// Web: WhatsApp payment
// Mobile: RevenueCat

export const PAYMENT_CONFIG = {
  // WhatsApp business number for payment inquiries (Web only)
  WHATSAPP_NUMBER: '905555555555', // TODO: Buraya gerçek WhatsApp numaranızı yazın

  // Payment platform by device type
  WEB_PAYMENT_METHOD: 'whatsapp' as const,
  MOBILE_PAYMENT_METHOD: 'revenuecat' as const,
};

export const getWhatsAppPaymentUrl = (planName: string, price: string) => {
  const message = encodeURIComponent(
    `Merhaba! ${planName} planını satın almak istiyorum.\n\nPlan: ${planName}\nFiyat: ${price}\n\nÖdeme bilgilerini alabilir miyim?`
  );

  return `https://wa.me/${PAYMENT_CONFIG.WHATSAPP_NUMBER}?text=${message}`;
};
