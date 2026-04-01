type AdminPlaceholderCardProps = {
  title: string;
  items: string[];
};

export default function AdminPlaceholderCard({
  title,
  items,
}: AdminPlaceholderCardProps) {
  return (
    <section className="rounded-[28px] border border-[#d8e7ff] bg-white/85 p-6 shadow-[0_18px_45px_rgba(118,156,208,0.12)] sm:p-8">
      <h2 className="text-xl font-black text-slate-950">{title}</h2>
      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li
            key={item}
            className="rounded-2xl bg-[#f4f8ff] px-4 py-3 text-sm text-slate-700"
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
