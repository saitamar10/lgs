import { useEffect } from 'react';
import { getPayTRIframeUrl } from '@/config/payment';

interface PayTRPaymentDialogProps {
  token: string;
  onClose: () => void;
}

export function PayTRPaymentDialog({ token, onClose }: PayTRPaymentDialogProps) {
  useEffect(() => {
    const iframeUrl = getPayTRIframeUrl(token);
    window.open(iframeUrl, '_blank');
    onClose();
  }, [token, onClose]);

  return null;
}
