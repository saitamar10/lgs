import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

export function PaymentCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status');
    const orderId = params.get('order_id');

    console.log('Payment callback:', { status, orderId });

    if (status === 'success') {
      toast.success('Ödeme başarılı! Aboneliğiniz aktif edildi.', { duration: 3000 });
      localStorage.removeItem('pending_order_id');

      // 2 saniye sonra dashboard'a yönlendir
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } else if (status === 'failed') {
      toast.error('Ödeme başarısız oldu. Lütfen tekrar deneyin.', { duration: 3000 });
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } else {
      // Status bilgisi yok, işlem devam ediyor
      setTimeout(() => {
        navigate('/');
      }, 3000);
    }
  }, [navigate]);

  const params = new URLSearchParams(window.location.search);
  const status = params.get('status');

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-8">
        {status === 'success' ? (
          <>
            <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-in">
              <CheckCircle2 className="w-12 h-12 text-success" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Ödeme Başarılı!</h1>
            <p className="text-muted-foreground mb-6">
              Aboneliğiniz aktif edildi. Tüm Plus özelliklerinden yararlanabilirsiniz.
            </p>
          </>
        ) : status === 'failed' ? (
          <>
            <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-in">
              <XCircle className="w-12 h-12 text-destructive" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Ödeme Başarısız</h1>
            <p className="text-muted-foreground mb-6">
              Ödemeniz tamamlanamadı. Lütfen tekrar deneyin.
            </p>
          </>
        ) : (
          <>
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Ödeme İşleniyor...</h1>
            <p className="text-muted-foreground mb-6">
              Lütfen bekleyin, işleminiz kontrol ediliyor.
            </p>
          </>
        )}

        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Ana sayfaya yönlendiriliyorsunuz...</span>
        </div>
      </div>
    </div>
  );
}
