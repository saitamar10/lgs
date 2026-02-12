import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

export function PaymentCallback() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status');

    console.log('PayTR Payment callback:', { status });

    if (status === 'success') {
      toast.success('Ödeme başarılı! Aboneliğiniz aktif edildi.', { duration: 5000 });

      // Temizlik
      localStorage.removeItem('pending_order_id');
      localStorage.removeItem('pending_plan_type');

      // Abonelik verisini yenile
      queryClient.invalidateQueries({ queryKey: ['user-subscription'] });

      setTimeout(() => {
        navigate('/');
      }, 3000);
    } else if (status === 'failed') {
      toast.error('Ödeme başarısız oldu. Lütfen tekrar deneyin.', { duration: 5000 });

      localStorage.removeItem('pending_order_id');
      localStorage.removeItem('pending_plan_type');

      setTimeout(() => {
        navigate('/');
      }, 3000);
    } else {
      // Status bilgisi yok, işlem devam ediyor
      setTimeout(() => {
        navigate('/');
      }, 4000);
    }
  }, [navigate, queryClient]);

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
            <h1 className="text-3xl font-bold mb-2">Ödeme Basarili!</h1>
            <p className="text-muted-foreground mb-6">
              Aboneliginiz aktif edildi. Tum Plus ozelliklerinden yararlanabilirsiniz.
            </p>
          </>
        ) : status === 'failed' ? (
          <>
            <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-in">
              <XCircle className="w-12 h-12 text-destructive" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Odeme Basarisiz</h1>
            <p className="text-muted-foreground mb-6">
              Odemeniz tamamlanamadi. Lutfen tekrar deneyin.
            </p>
          </>
        ) : (
          <>
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Odeme Isleniyor...</h1>
            <p className="text-muted-foreground mb-6">
              Lutfen bekleyin, isleminiz kontrol ediliyor.
            </p>
          </>
        )}

        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Ana sayfaya yonlendiriliyorsunuz...</span>
        </div>
      </div>
    </div>
  );
}
