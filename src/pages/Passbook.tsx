import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Download, LayoutDashboard } from "lucide-react";
import { maskAadhaar, maskPAN } from "@/lib/banking-utils";
import finovaLogo from "@/assets/finova-logo.png";

export default function Passbook() {
  const [searchParams] = useSearchParams();
  const accountNumber = searchParams.get("account");
  const { users } = useAuth();
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(true);

  const user = users.find(u => u.accountNumber === accountNumber);

  useEffect(() => {
    const timer = setTimeout(() => setShowSuccess(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <p className="text-muted-foreground">Account not found.</p>
      </div>
    );
  }

  const passbookData = [
    { label: "Account Holder", value: user.fullName },
    { label: "Account Number", value: user.accountNumber },
    { label: "Account Type", value: "Savings" },
    { label: "IFSC Code", value: "FNVA0001234" },
    { label: "Mobile Number", value: user.phone },
    { label: "Email", value: user.email },
    { label: "Address", value: user.address },
    { label: "PAN Card", value: maskPAN(user.pan) },
    { label: "Aadhaar Number", value: maskAadhaar(user.aadhaar) },
    { label: "Account Opened", value: user.createdAt },
  ];

  const handleDownloadPDF = () => {
    // Build a printable HTML document and trigger print/save as PDF
    const html = `
<!DOCTYPE html>
<html>
<head>
<title>Finova Bank - Passbook</title>
<style>
  @page { margin: 20mm; }
  body { font-family: 'Segoe UI', Arial, sans-serif; color: #1a1a2e; margin: 0; padding: 0; }
  .header { background: #1a1a2e; color: white; padding: 24px 32px; display: flex; align-items: center; gap: 16px; }
  .logo { height: 48px; width: auto; }
  .bank-name { font-size: 22px; font-weight: 700; }
  .bank-sub { font-size: 12px; opacity: 0.7; margin-top: 2px; }
  .title { text-align: center; font-size: 16px; font-weight: 600; margin: 24px 0 16px; text-transform: uppercase; letter-spacing: 1px; color: #1a1a2e; border-bottom: 2px solid #3b82f6; display: inline-block; padding-bottom: 4px; }
  .title-wrapper { text-align: center; }
  table { width: 100%; border-collapse: collapse; margin-top: 16px; }
  td { padding: 10px 16px; border-bottom: 1px solid #e5e7eb; font-size: 14px; }
  td:first-child { font-weight: 600; color: #64748b; width: 40%; }
  td:last-child { color: #1a1a2e; }
  .footer { margin-top: 40px; text-align: center; font-size: 11px; color: #94a3b8; }
  .stamp { margin-top: 32px; text-align: right; font-size: 12px; color: #64748b; font-style: italic; }
</style>
</head>
<body>
  <div class="header">
    <img class="logo" src="${window.location.origin}/finova-logo.png" alt="Finova Bank" />
    <div>
      <div class="bank-name">Finova Bank</div>
      <div class="bank-sub">Your Trusted Banking Partner</div>
    </div>
  </div>
  <div class="title-wrapper"><div class="title">Account Passbook</div></div>
  <table>
    ${passbookData.map(row => `<tr><td>${row.label}</td><td>${row.value}</td></tr>`).join("")}
  </table>
  <div class="stamp">Issued on: ${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}</div>
  <div class="footer">
    This is a computer-generated document and does not require a physical signature.<br/>
    Finova Bank • IFSC: FNVA0001234 • CIN: U00000MH2025PLC000000
  </div>
</body>
</html>`;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      setTimeout(() => printWindow.print(), 400);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-lg animate-fade-in">
        {showSuccess && (
          <div className="text-center mb-6 animate-fade-in">
            <CheckCircle2 className="h-14 w-14 text-green-500 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-foreground">Account Created Successfully!</h2>
            <p className="text-sm text-muted-foreground mt-1">Your digital passbook is ready</p>
          </div>
        )}

        {!showSuccess && (
          <div className="text-center mb-6">
            <img src={finovaLogo} alt="Finova Bank" className="h-14 w-auto mx-auto mb-3" />
            <h2 className="text-xl font-bold text-foreground">Digital Passbook</h2>
            <p className="text-sm text-muted-foreground">Finova Bank</p>
          </div>
        )}

        <Card className="shadow-lg border-border/50 overflow-hidden">
          {/* Header band */}
          <div className="bg-primary px-6 py-4 flex items-center gap-3">
            <img src={finovaLogo} alt="Finova Bank" className="h-10 w-auto" />
            <div>
              <p className="text-primary-foreground font-semibold text-sm">Finova Bank</p>
              <p className="text-primary-foreground/70 text-xs">Your Trusted Banking Partner</p>
            </div>
          </div>

          <CardContent className="p-0">
            <table className="w-full">
              <tbody>
                {passbookData.map((row, i) => (
                  <tr key={row.label} className={i % 2 === 0 ? "bg-muted/30" : ""}>
                    <td className="px-6 py-3 text-sm font-medium text-muted-foreground w-[40%]">{row.label}</td>
                    <td className="px-6 py-3 text-sm text-foreground">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <div className="flex gap-3 mt-6">
          <Button variant="outline" className="flex-1 gap-2" onClick={handleDownloadPDF}>
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
          <Button className="flex-1 gap-2" onClick={() => navigate("/login/customer")}>
            <LayoutDashboard className="h-4 w-4" />
            Go to Login
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Please save your account number for login
        </p>
      </div>
    </div>
  );
}
