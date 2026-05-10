import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/banking-utils";
import { ArrowUpFromLine, CheckCircle2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Withdraw() {
  const [amount, setAmount] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const { user, withdraw } = useAuth();
  const { toast } = useToast();

  const handleWithdraw = () => {
    const val = parseInt(amount);
    if (!val || val <= 0) { toast({ title: "Invalid amount", variant: "destructive" }); return; }
    const result = withdraw(val);
    if (!result.success) { setError(result.message); return; }
    setError("");
    setDone(true);
    setTimeout(() => { setDone(false); setAmount(""); }, 2000);
  };

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="max-w-lg mx-auto space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold">Withdraw Money</h1>
          <p className="text-sm text-muted-foreground">Available: {formatCurrency(user.balance)}</p>
        </div>
        <Card className="shadow-sm">
          <CardContent className="pt-6 space-y-5">
            {done ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 className="h-14 w-14 text-success mx-auto" />
                <p className="text-lg font-semibold">Withdrawal Successful!</p>
              </div>
            ) : (
              <>
                {error && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                    <AlertCircle className="h-4 w-4 shrink-0" /> {error}
                  </div>
                )}
                <div className="space-y-2">
                  <Label>Amount (₹)</Label>
                  <Input type="number" value={amount} onChange={e => { setAmount(e.target.value); setError(""); }} placeholder="Enter amount" className="text-lg h-12" min={1} max={user.balance} />
                </div>
                <Button onClick={handleWithdraw} className="w-full h-11" disabled={!amount}>
                  <ArrowUpFromLine className="h-4 w-4 mr-2" /> Withdraw {amount ? formatCurrency(parseInt(amount)) : ""}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
