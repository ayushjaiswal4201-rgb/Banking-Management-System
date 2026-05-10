export function generateAccountNumber(): string {
  const prefix = "2025";
  const random = Math.floor(Math.random() * 100000000).toString().padStart(8, "0");
  return prefix + random;
}

export function validatePAN(pan: string): boolean {
  return /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan);
}

export function validateAadhaar(aadhaar: string): boolean {
  return /^\d{12}$/.test(aadhaar.replace(/\s/g, ""));
}

export function validatePassword(password: string): { valid: boolean; message: string } {
  if (password.length < 8) return { valid: false, message: "Minimum 8 characters" };
  if (!/[A-Z]/.test(password)) return { valid: false, message: "Need uppercase letter" };
  if (!/[a-z]/.test(password)) return { valid: false, message: "Need lowercase letter" };
  if (!/[0-9]/.test(password)) return { valid: false, message: "Need a digit" };
  if (!/[!@#$%^&*]/.test(password)) return { valid: false, message: "Need special char (!@#$%^&*)" };
  return { valid: true, message: "Strong password" };
}

export function calculateEMI(principal: number, annualRate: number, months: number): number {
  const r = annualRate / 12 / 100;
  if (r === 0) return principal / months;
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

export function calculateSimpleInterest(principal: number, rate: number, years: number): number {
  return (principal * rate * years) / 100;
}

export function calculateCompoundInterest(principal: number, rate: number, years: number, n: number = 4): number {
  return principal * Math.pow(1 + rate / (n * 100), n * years) - principal;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(date));
}

export function maskAadhaar(aadhaar: string): string {
  const clean = aadhaar.replace(/\s/g, "");
  if (clean.length !== 12) return aadhaar;
  return `XXXX-XXXX-${clean.slice(-4)}`;
}

export function maskPAN(pan: string): string {
  if (pan.length !== 10) return pan;
  return `${pan.slice(0, 4)}XXXX${pan.slice(-1)}`;
}

export function checkLoanEligibility(salary: number, requestedAmount: number): { eligible: boolean; maxAmount: number; reason: string } {
  const maxAmount = salary * 60;
  if (requestedAmount > maxAmount) {
    return { eligible: false, maxAmount, reason: `Maximum eligible amount is ${formatCurrency(maxAmount)} based on your salary` };
  }
  return { eligible: true, maxAmount, reason: "You are eligible for this loan" };
}
