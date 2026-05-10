import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/banking-utils";
import { ArrowDownToLine, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Deposit() {
  const [amount, setAmount] = useState("");
  const [done, setDone] = useState(false);
  const { user, deposit } = useAuth();
  const { toast } = useToast();
  const presets = [1000, 5000, 10000, 25000, 50000];

  const handleDeposit = () => {
    const val = parseInt(amount);
    if (!val || val <= 0) { toast({ title: "Invalid amount", variant: "destructive" }); return; }
    deposit(val);
    setDone(true);
    setTimeout(() => { setDone(false); setAmount(""); }, 2000);
  };

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="max-w-lg mx-auto space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold">Deposit Money</h1>
          <p className="text-sm text-muted-foreground">Current balance: {formatCurrency(user.balance)}</p>
        </div>

        <Card className="shadow-sm">
          <CardContent className="pt-6 space-y-5">
            {done ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 className="h-14 w-14 text-success mx-auto" />
                <p className="text-lg font-semibold">Deposit Successful!</p>
                <p className="text-sm text-muted-foreground">{formatCurrency(parseInt(amount) || 0)} added to your account</p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label>Amount (₹)</Label>
                  <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Enter amount" className="text-lg h-12" min={1} />
                </div>
                <div className="flex flex-wrap gap-2">
                  {presets.map(p => (
                    <Button key={p} variant="outline" size="sm" onClick={() => setAmount(p.toString())} className="text-xs">
                      ₹{p.toLocaleString("en-IN")}
                    </Button>
                  ))}
                </div>
                <Button onClick={handleDeposit} className="w-full h-11" disabled={!amount}>
                  <ArrowDownToLine className="h-4 w-4 mr-2" /> Deposit {amount ? formatCurrency(parseInt(amount)) : ""}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
