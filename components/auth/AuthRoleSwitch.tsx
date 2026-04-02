type AuthRoleSwitchProps = {
  value: "user" | "admin";
  onChange: (value: "user" | "admin") => void;
};

export default function AuthRoleSwitch({ value, onChange }: AuthRoleSwitchProps) {
  return (
    <div className="relative inline-grid w-[188px] grid-cols-2 rounded-full bg-gradient-to-r from-[#eef2ff] via-[#f8edff] to-[#fff1db] p-1 shadow-[0_8px_20px_rgba(99,102,241,0.12)]">
      <span
        aria-hidden="true"
        className={`absolute bottom-1 top-1 w-[90px] rounded-full transition-all duration-300 ease-out ${
          value === "user"
            ? "left-1 bg-[#2f6fe4] shadow-[0_10px_24px_rgba(47,111,228,0.34)]"
            : "left-[94px] bg-[#ff8b5e] shadow-[0_10px_24px_rgba(255,139,94,0.3)]"
        }`}
      />
      <button
        type="button"
        onClick={() => onChange("user")}
        className={`relative z-10 min-w-[92px] rounded-full px-5 py-2 text-sm font-semibold transition-colors duration-300 ${
          value === "user"
            ? "text-white"
            : "text-[#5f5d7a] hover:text-[#2f6fe4]"
        }`}
      >
        User
      </button>
      <button
        type="button"
        onClick={() => onChange("admin")}
        className={`relative z-10 min-w-[92px] rounded-full px-5 py-2 text-sm font-semibold transition-colors duration-300 ${
          value === "admin"
            ? "text-white"
            : "text-[#7b6b5d] hover:text-[#ff8b5e]"
        }`}
      >
        Admin
      </button>
    </div>
  );
}
