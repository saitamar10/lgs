// Payment configuration
// WhatsApp payment for all platforms

export const PAYMENT_CONFIG = {
  // WhatsApp business number for payment inquiries (Web only)
  WHATSAPP_NUMBER: '447925405768',

  // Payment method
  PAYMENT_METHOD: 'whatsapp' as const,
};

export const getWhatsAppPaymentUrl = (planName: string, price: string) => {
  const message = encodeURIComponent(
    `Merhaba! ${planName} planını satın almak istiyorum.\n\nPlan: ${planName}\nFiyat: ${price}\n\nÖdeme bilgilerini alabilir miyim?`
  );

  return `https://wa.me/${PAYMENT_CONFIG.WHATSAPP_NUMBER}?text=${message}`;
};
