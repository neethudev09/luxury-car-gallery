import { useMemo, useState } from "react";
import { Calculator } from "lucide-react";

function formatAED(n: number) {
  return new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED",
    maximumFractionDigits: 0,
  }).format(Math.round(n));
}

export function FinanceCalculator({ price }: { price: number }) {
  const [depositPct, setDepositPct] = useState(20);
  const [ratePct, setRatePct] = useState(4.5);
  const [termYears, setTermYears] = useState(5);

  const { deposit, loanAmount, monthly, totalPayable, totalInterest } = useMemo(() => {
    const deposit = (price * depositPct) / 100;
    const loanAmount = Math.max(price - deposit, 0);
    const months = termYears * 12;
    const monthlyRate = ratePct / 100 / 12;

    let monthly: number;
    if (monthlyRate === 0) {
      monthly = months > 0 ? loanAmount / months : 0;
    } else {
      monthly =
        (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1);
    }

    const totalPayable = monthly * months + deposit;
    const totalInterest = totalPayable - price;
    return { deposit, loanAmount, monthly, totalPayable, totalInterest };
  }, [price, depositPct, ratePct, termYears]);

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-2">
        <Calculator className="h-4 w-4 text-gold" />
        <h3 className="text-base">Finance Calculator</h3>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        Estimate your monthly payment. Adjust the values below.
      </p>

      <div className="mt-4 space-y-4">

        <Control
          label="Deposit"
          value={`${depositPct}%  ·  ${formatAED(deposit)}`}
          min={0}
          max={80}
          step={1}
          current={depositPct}
          onChange={setDepositPct}
        />
        <Control
          label="Interest Rate (APR)"
          value={`${ratePct.toFixed(1)}%`}
          min={0}
          max={15}
          step={0.1}
          current={ratePct}
          onChange={setRatePct}
        />
        <Control
          label="Term"
          value={`${termYears} ${termYears === 1 ? "year" : "years"}`}
          min={1}
          max={7}
          step={1}
          current={termYears}
          onChange={setTermYears}
        />
      </div>

      <div className="mt-6 rounded-xl border border-gold/30 bg-gold/5 p-5 text-center">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          Estimated Monthly Payment
        </p>
        <p className="mt-1 font-display text-3xl text-gold">{formatAED(monthly)}</p>
        <p className="mt-1 text-xs text-muted-foreground">per month over {termYears * 12} months</p>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 text-center text-sm">
        <Stat label="Loan Amount" value={formatAED(loanAmount)} />
        <Stat label="Total Interest" value={formatAED(totalInterest)} />
        <Stat label="Total Payable" value={formatAED(totalPayable)} />
      </div>

      <p className="mt-4 text-[0.7rem] leading-relaxed text-muted-foreground">
        Figures are estimates only and exclude fees. Contact us for a tailored finance quote.
      </p>
    </div>
  );
}

function Control({
  label,
  value,
  min,
  max,
  step,
  current,
  onChange,
}: {
  label: string;
  value: string;
  min: number;
  max: number;
  step: number;
  current: number;
  onChange: (n: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={current}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-gold"
      />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <p className="text-[0.65rem] uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm">{value}</p>
    </div>
  );
}
