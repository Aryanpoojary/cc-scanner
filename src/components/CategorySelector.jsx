import { motion } from "framer-motion";
import { Armchair, Brush, Droplets, HardHat, ShieldAlert, Wifi, Wind, Zap } from "lucide-react";

export const CATEGORIES = [
  { value: "Electrical", icon: Zap },
  { value: "Plumbing", icon: Droplets },
  { value: "HVAC", icon: Wind },
  { value: "Furniture", icon: Armchair },
  { value: "Network/IT", icon: Wifi },
  { value: "Cleaning", icon: Brush },
  { value: "Civil", icon: HardHat },
  { value: "Safety", icon: ShieldAlert },
];

export default function CategorySelector({ value, onChange, error }) {
  return (
    <div>
      <div role="radiogroup" aria-label="Issue category" className="grid grid-cols-4 gap-3">
        {CATEGORIES.map(({ value: v, icon: Icon }) => {
          const active = value === v;
          return (
            <motion.button
              key={v}
              type="button"
              role="radio"
              aria-checked={active}
              whileTap={{ scale: 0.94 }}
              whileHover={{ scale: active ? 1.02 : 1.03 }}
              onClick={() => onChange(v)}
              data-testid={`category-${v.toLowerCase().replace("/", "-")}`}
              className={`relative flex aspect-square flex-col items-center justify-center gap-1.5 rounded-2xl text-[11px] font-semibold transition-all duration-300 ease-out ${
                active
                  ? "gradient-primary text-white shadow-[0_8px_20px_-6px_rgba(234,90,42,.5)] scale-105"
                  : "shadow-neu-sm text-muted hover:text-ink hover:shadow-neu"
              }`}
            >
              <motion.span
                initial={false}
                animate={{ scale: active ? 1.15 : 1, rotate: active ? 5 : 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="relative z-10 flex h-6 w-6 items-center justify-center"
              >
                <Icon className={`h-6 w-6 transition-transform ${active ? "text-white" : ""}`} aria-hidden />
              </motion.span>
              <motion.span
                initial={false}
                animate={{ y: active ? -2 : 0, color: active ? "#ffffff" : "#786F66" }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="relative z-10 leading-tight"
              >
                {v}
              </motion.span>
            </motion.button>
          );
        })}
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          role="alert"
          className="mt-3 text-sm font-medium text-danger"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
