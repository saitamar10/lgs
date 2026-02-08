import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/lib/auth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { PaymentCallback } from "./pages/PaymentCallback";
import GizlilikPolitikasi from "./pages/GizlilikPolitikasi";
import KullanimKosullari from "./pages/KullanimKosullari";
import Hakkimizda from "./pages/Hakkimizda";
import Iletisim from "./pages/Iletisim";
import KVKKAydinlatma from "./pages/KVKKAydinlatma";
import CerezPolitikasi from "./pages/CerezPolitikasi";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/gizlilik-politikasi" element={<GizlilikPolitikasi />} />
            <Route path="/kullanim-kosullari" element={<KullanimKosullari />} />
            <Route path="/hakkimizda" element={<Hakkimizda />} />
            <Route path="/iletisim" element={<Iletisim />} />
            <Route path="/kvkk" element={<KVKKAydinlatma />} />
            <Route path="/cerez-politikasi" element={<CerezPolitikasi />} />
            <Route path="/payment-callback" element={<PaymentCallback />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
