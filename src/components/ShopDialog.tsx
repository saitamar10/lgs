import { useState } from 'react';
import { useShopItems, usePurchaseItem, ShopItem } from '@/hooks/useShop';
import { useProfile } from '@/hooks/useLeaderboard';
import { useUserHearts } from '@/hooks/useUserHearts';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Coins, Heart, Shield, Zap, Crown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ShopDialogProps {
  open: boolean;
  onClose: () => void;
}

const iconMap: Record<string, React.ReactNode> = {
  '❤️': <Heart className="w-8 h-8 text-destructive" />,
  '💕': <Heart className="w-8 h-8 text-pink-500" />,
  '🛡️': <Shield className="w-8 h-8 text-primary" />,
  '⚡': <Zap className="w-8 h-8 text-warning" />,
  '👑': <Crown className="w-8 h-8 text-amber-500" />,
};

export function ShopDialog({ open, onClose }: ShopDialogProps) {
  const { data: items, isLoading } = useShopItems();
  const { data: profile } = useProfile();
  const { hearts, maxHearts } = useUserHearts();
  const purchaseItem = usePurchaseItem();
  const [purchasing, setPurchasing] = useState<string | null>(null);

  const handlePurchase = async (item: ShopItem) => {
    if ((profile?.coins ?? 0) < item.price_coins) {
      toast.error('Yeterli coin yok!');
      return;
    }

    if (item.item_type === 'hearts' && hearts >= maxHearts) {
      toast.error('Kalpler zaten dolu!');
      return;
    }

    setPurchasing(item.id);
    try {
      await purchaseItem.mutateAsync(item);
      toast.success(`${item.name} satın alındı!`);
    } catch (error) {
      toast.error('Satın alma başarısız!');
    } finally {
      setPurchasing(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              🛒 Mağaza
            </span>
            <span className="flex items-center gap-1 text-sm font-normal">
              <Coins className="w-4 h-4 text-warning" />
              <span className="font-bold">{profile?.coins ?? 0}</span>
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : items?.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Mağazada henüz ürün yok.
            </p>
          ) : (
            items?.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center">
                      {iconMap[item.icon || ''] || <span className="text-2xl">{item.icon}</span>}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                    <Button
                      size="sm"
                      variant={(profile?.coins ?? 0) < item.price_coins ? "outline" : "default"}
                      disabled={
                        purchasing === item.id || 
                        (profile?.coins ?? 0) < item.price_coins ||
                        (item.item_type === 'hearts' && hearts >= maxHearts)
                      }
                      onClick={() => handlePurchase(item)}
                      className={cn(
                        "min-w-[80px]",
                        (profile?.coins ?? 0) >= item.price_coins && "bg-warning text-warning-foreground hover:bg-warning/90"
                      )}
                    >
                      {purchasing === item.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Coins className="w-3 h-3 mr-1" />
                          {item.price_coins}
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="text-center text-xs text-muted-foreground mt-4">
          Quiz tamamlayarak ve görevleri yaparak coin kazan!
        </div>
      </DialogContent>
    </Dialog>
  );
}
