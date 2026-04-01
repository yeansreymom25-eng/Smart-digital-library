type AdminPageIntroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export default function AdminPageIntro({
  eyebrow,
  title,
  description,
}: AdminPageIntroProps) {
  return (
    <div className="rounded-[28px] border border-[#d8e7ff] bg-white/85 p-6 shadow-[0_18px_45px_rgba(118,156,208,0.12)] sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#648ab6]">
        {eyebrow}
      </p>
      <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
        {title}
      </h1>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
        {description}
      </p>
    </div>
  );
}
