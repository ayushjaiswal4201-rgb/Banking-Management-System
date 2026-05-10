import { useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency, formatDate } from "@/lib/banking-utils";
import { TrendingUp, TrendingDown, Search } from "lucide-react";

export default function Transactions() {
  const { user, transactions } = useAuth();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const userTxns = useMemo(() => {
    if (!user) return [];
    return transactions
      .filter(t => t.userId === user.id)
      .filter(t => typeFilter === "all" || t.type === typeFilter)
      .filter(t => t.description.toLowerCase().includes(search.toLowerCase()));
  }, [user, transactions, search, typeFilter]);

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="max-w-4xl space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold">Transaction History</h1>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search transactions..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="deposit">Deposits</SelectItem>
              <SelectItem value="withdrawal">Withdrawals</SelectItem>
              <SelectItem value="loan_disbursement">Loan</SelectItem>
              <SelectItem value="fd_investment">FD</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card className="shadow-sm">
          <CardContent className="pt-4">
            {userTxns.length === 0 ? (
              <p className="text-sm text-muted-foreground py-12 text-center">No transactions found</p>
            ) : (
              <div className="space-y-1">
                {userTxns.map(t => (
                  <div key={t.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${t.type === "deposit" || t.type === "loan_disbursement" ? "bg-success/10" : "bg-destructive/10"}`}>
                        {t.type === "deposit" || t.type === "loan_disbursement" ? <TrendingUp className="h-4 w-4 text-success" /> : <TrendingDown className="h-4 w-4 text-destructive" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{t.description}</p>
                        <p className="text-[11px] text-muted-foreground">{formatDate(t.date)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-sm font-semibold tabular-nums ${t.type === "deposit" || t.type === "loan_disbursement" ? "text-success" : "text-destructive"}`}>
                        {t.type === "deposit" || t.type === "loan_disbursement" ? "+" : "-"}{formatCurrency(t.amount)}
                      </span>
                      <p className="text-[10px] text-muted-foreground tabular-nums">Bal: {formatCurrency(t.balance)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
