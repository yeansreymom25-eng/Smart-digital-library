import Link from "next/link";

const links = [
  {
    href: "/profile",
    label: "Profile",
    description: "Edit personal details, avatar, and reading identity.",
  },
  {
    href: "/settings",
    label: "Setting",
    description: "Control appearance, privacy, reading mode, and payment options.",
  },
  {
    href: "/transactions",
    label: "Transaction",
    description: "Review QR payments, proof uploads, and purchase history.",
  },
];

export default function DropdownAccountPanel({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="mt-5 grid gap-3">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={onNavigate}
          className="rounded-[1.3rem] border border-[#e3e8ef] bg-white px-4 py-4 transition hover:bg-[#fbfcff] hover:shadow-[0_10px_18px_rgba(15,23,42,0.05)]"
        >
          <div className="text-sm font-semibold text-[#556072]">{link.label}</div>
          <div className="mt-1 text-xs leading-5 text-[#8790a0]">{link.description}</div>
        </Link>
      ))}
    </div>
  );
}
