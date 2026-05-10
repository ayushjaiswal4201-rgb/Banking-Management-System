import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Passbook from "./pages/Passbook";
import Dashboard from "./pages/Dashboard";
import Deposit from "./pages/Deposit";
import Withdraw from "./pages/Withdraw";
import Transactions from "./pages/Transactions";
import Loans from "./pages/Loans";
import FixedDeposits from "./pages/FixedDeposits";
import Statement from "./pages/Statement";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  if (adminOnly && user.role !== "admin") return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} replace /> : <Index />} />
      <Route path="/login/:role" element={user ? <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <Register />} />
      <Route path="/passbook" element={<Passbook />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/deposit" element={<ProtectedRoute><Deposit /></ProtectedRoute>} />
      <Route path="/withdraw" element={<ProtectedRoute><Withdraw /></ProtectedRoute>} />
      <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
      <Route path="/loans" element={<ProtectedRoute><Loans /></ProtectedRoute>} />
      <Route path="/fixed-deposits" element={<ProtectedRoute><FixedDeposits /></ProtectedRoute>} />
      <Route path="/statement" element={<ProtectedRoute><Statement /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/*" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
