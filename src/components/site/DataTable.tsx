import type { ReactNode } from "react";

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Pending: "bg-gold/15 text-navy",
    Confirmed: "bg-success/15 text-success",
    Cancelled: "bg-destructive/15 text-destructive",
    Received: "bg-gold/15 text-navy",
    "Under Review": "bg-gold/15 text-navy",
    "Quote Sent": "bg-success/15 text-success",
    Closed: "bg-muted text-muted-foreground",
  };
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${map[status] || "bg-muted text-muted-foreground"}`}>{status}</span>;
}

export function DataTable({
  cols,
  rows,
  empty,
  className = "",
}: {
  cols: string[];
  rows: ReactNode[][];
  empty: string;
  className?: string;
}) {
  if (rows.length === 0) {
    return (
      <div className={`rounded-xl border-hairline border-border bg-card p-10 text-center text-sm text-muted-foreground ${className}`}>
        {empty}
      </div>
    );
  }
  return (
    <div className={`overflow-hidden rounded-xl border-hairline border-border bg-card ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>{cols.map((c) => <th key={c} className="whitespace-nowrap px-5 py-3 text-left font-semibold text-navy">{c}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-hairline border-t">
                {r.map((v, j) => <td key={j} className="whitespace-nowrap px-5 py-3">{v}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
