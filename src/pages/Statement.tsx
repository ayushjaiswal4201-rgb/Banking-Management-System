import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/banking-utils";
import { FileText, Download, TrendingUp, TrendingDown } from "lucide-react";

export default function Statement() {
  const { user, transactions } = useAuth();
  if (!user) return null;

  const userTxns = transactions.filter(t => t.userId === user.id);

  const downloadPDF = () => {
    const lines = [
      "FINOVA BANK — ACCOUNT STATEMENT",
      "=".repeat(50),
      `Account Holder: ${user.fullName}`,
      `Account Number: ${user.accountNumber}`,
      `Statement Date: ${formatDate(new Date())}`,
      `Current Balance: ${formatCurrency(user.balance)}`,
      "",
      "TRANSACTIONS",
      "-".repeat(50),
      ...userTxns.map(t => `${formatDate(t.date)}  ${t.type.padEnd(15)}  ${(t.type === "deposit" ? "+" : "-") + formatCurrency(t.amount).padStart(12)}  Bal: ${formatCurrency(t.balance)}`),
      "",
      "-".repeat(50),
      "End of Statement",
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `statement_${user.accountNumber}_${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Bank Statement</h1>
            <p className="text-sm text-muted-foreground">{userTxns.length} transactions</p>
          </div>
          <Button onClick={downloadPDF}><Download className="h-4 w-4 mr-2" />Download Statement</Button>
        </div>

        <Card className="shadow-sm">
          <CardContent className="pt-5">
            <div className="p-4 rounded-xl bg-muted mb-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div><p className="text-xs text-muted-foreground">Account Holder</p><p className="font-medium">{user.fullName}</p></div>
              <div><p className="text-xs text-muted-foreground">Account No</p><p className="font-medium tabular-nums">{user.accountNumber}</p></div>
              <div><p className="text-xs text-muted-foreground">Balance</p><p className="font-semibold text-primary">{formatCurrency(user.balance)}</p></div>
              <div><p className="text-xs text-muted-foreground">Date</p><p className="font-medium">{formatDate(new Date())}</p></div>
            </div>

            {userTxns.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">No transactions</p>
            ) : (
              <div className="space-y-1">
                {userTxns.map(t => (
                  <div key={t.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`h-7 w-7 rounded-md flex items-center justify-center ${t.type === "deposit" || t.type === "loan_disbursement" ? "bg-success/10" : "bg-destructive/10"}`}>
                        {t.type === "deposit" || t.type === "loan_disbursement" ? <TrendingUp className="h-3.5 w-3.5 text-success" /> : <TrendingDown className="h-3.5 w-3.5 text-destructive" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{t.description}</p>
                        <p className="text-[10px] text-muted-foreground">{formatDate(t.date)}</p>
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
