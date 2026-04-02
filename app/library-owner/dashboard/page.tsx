const topStats = [
  {
    title: "Total Users",
    value: "7",
    note: "5% from last month",
    icon: "user",
  },
  {
    title: "Total Books",
    value: "5",
    note: "5% from last month",
    icon: "book",
  },
  {
    title: "Total Revenue",
    value: "$13.33",
    note: "--",
    icon: "dollar",
  },
  {
    title: "Pending Payments",
    value: "2",
    note: "Awaiting verification",
    icon: "clock",
  },
];

const overviewCards = [
  {
    title: "Active Rentals",
    value: "2",
    note: "Books currently rented",
    icon: "external",
  },
  {
    title: "Total Purchases",
    value: "1",
    note: "Books purchased",
    icon: "money",
  },
  {
    title: "Published Books",
    value: "10",
    note: "Currently available",
    icon: "book",
  },
];

const transactions = [
  {
    user: "Yean Sreymom",
    book: "The Art of Programming",
    type: "Rent",
    amount: "$2.99",
    date: "15/3/2026",
    status: "approved",
  },
  {
    user: "Vy Seoul",
    book: "Graphic Design",
    type: "Purchase",
    amount: "$5.99",
    date: "15/2/2026",
    status: "approved",
  },
  {
    user: "Chim Lina",
    book: "Leadership Principle",
    type: "Rent",
    amount: "$1.99",
    date: "10/1/2026",
    status: "pending",
  },
];

function StatIcon({ kind }: { kind: "user" | "book" | "dollar" | "clock" | "external" | "money" }) {
  const className = "h-6 w-6";

  switch (kind) {
    case "user":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5.5 19a6.5 6.5 0 0 1 13 0" />
        </svg>
      );
    case "book":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
          <path d="M5 6.5A2.5 2.5 0 0 1 7.5 4H19v14H7.5A2.5 2.5 0 0 0 5 20.5V6.5Z" />
          <path d="M5 6h12" />
        </svg>
      );
    case "dollar":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M13.5 3v2.1c2.1.3 3.7 1.6 4.1 3.6h-2.8c-.3-.8-1.1-1.3-2.3-1.3-1.4 0-2.3.6-2.3 1.5 0 .8.5 1.2 2.6 1.7 3.2.8 4.7 1.9 4.7 4.4 0 2.2-1.6 3.8-4 4.2V21h-2.2v-1.9c-2.7-.3-4.5-1.8-4.8-4.1h2.8c.3 1.1 1.2 1.7 2.7 1.7s2.5-.6 2.5-1.6c0-.9-.6-1.3-2.7-1.8-3-.7-4.6-1.8-4.6-4.2 0-2.1 1.5-3.6 3.9-4.1V3h2.4Z" />
        </svg>
      );
    case "clock":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
    case "external":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
          <path d="M14 5h5v5" />
          <path d="M10 14 19 5" />
          <path d="M19 13v5H5V5h5" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M13.5 3v2.1c2.1.3 3.7 1.6 4.1 3.6h-2.8c-.3-.8-1.1-1.3-2.3-1.3-1.4 0-2.3.6-2.3 1.5 0 .8.5 1.2 2.6 1.7 3.2.8 4.7 1.9 4.7 4.4 0 2.2-1.6 3.8-4 4.2V21h-2.2v-1.9c-2.7-.3-4.5-1.8-4.8-4.1h2.8c.3 1.1 1.2 1.7 2.7 1.7s2.5-.6 2.5-1.6c0-.9-.6-1.3-2.7-1.8-3-.7-4.6-1.8-4.6-4.2 0-2.1 1.5-3.6 3.9-4.1V3h2.4Z" />
        </svg>
      );
  }
}

export default function AdminDashboardPage() {
  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-[2.1rem] font-bold leading-none text-slate-950">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Overview of your library system</p>
      </div>

      <div className="grid gap-3 xl:grid-cols-4">
        {topStats.map((card) => (
          <article
            key={card.title}
            className="rounded-[6px] bg-[#4d98f0] px-4 py-3 text-white shadow-[0_10px_20px_rgba(77,152,240,0.14)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm">{card.title}</p>
                <p className="mt-2 text-3xl font-bold leading-none">{card.value}</p>
                <p className="mt-3 text-[11px] text-white/80">{card.note}</p>
              </div>
              <div className="text-white/85">
                <StatIcon kind={card.icon} />
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="grid gap-3 xl:grid-cols-3">
        {overviewCards.map((card) => (
          <article
            key={card.title}
            className="rounded-[8px] border border-[#cfcfcf] bg-white px-4 py-4 shadow-[0_8px_20px_rgba(132,145,165,0.05)]"
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-[1.05rem] font-medium text-slate-950">{card.title}</h2>
              <span className={card.title === "Total Purchases" ? "text-[#19b03c]" : "text-slate-500"}>
                <StatIcon kind={card.icon} />
              </span>
            </div>
            <p className="mt-9 text-4xl font-bold leading-none text-slate-950">{card.value}</p>
            <p className="mt-10 text-sm text-slate-500">{card.note}</p>
          </article>
        ))}
      </div>

      <section className="rounded-[8px] border border-[#cfcfcf] bg-white shadow-[0_8px_20px_rgba(132,145,165,0.05)]">
        <div className="border-b border-[#cfcfcf] px-6 py-4">
          <h2 className="text-[1.4rem] font-bold text-slate-950">Recent Transactions</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-separate border-spacing-0">
            <thead>
              <tr className="text-left text-[1.05rem] text-[#2456b6]">
                <th className="px-6 py-5 font-medium">User</th>
                <th className="px-4 py-5 font-medium">Book</th>
                <th className="px-4 py-5 font-medium">Type</th>
                <th className="px-4 py-5 font-medium">Amount</th>
                <th className="px-4 py-5 font-medium">Date</th>
                <th className="px-4 py-5 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={`${transaction.user}-${transaction.book}`} className="text-[1.05rem] text-slate-900">
                  <td className="border-t border-[#cfcfcf] px-6 py-5">{transaction.user}</td>
                  <td className="border-t border-[#cfcfcf] px-4 py-5">{transaction.book}</td>
                  <td className="border-t border-[#cfcfcf] px-4 py-5">{transaction.type}</td>
                  <td className="border-t border-[#cfcfcf] px-4 py-5">{transaction.amount}</td>
                  <td className="border-t border-[#cfcfcf] px-4 py-5">{transaction.date}</td>
                  <td className="border-t border-[#cfcfcf] px-4 py-5">
                    <span
                      className={`inline-flex min-w-[80px] justify-center rounded-[4px] px-3 py-1 text-xs font-medium capitalize text-white ${
                        transaction.status === "approved" ? "bg-[#2ec84d]" : "bg-[#e3a11b]"
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
