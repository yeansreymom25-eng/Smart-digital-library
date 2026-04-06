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
      <h1 className="mt-3 text-[2.5rem] font-bold leading-none text-[#173b73]">
        {title}
      </h1>
      <p className="mt-2 max-w-3xl text-base leading-7 text-[#4d6691]">
        {description}
      </p>
    </div>
  );
}
