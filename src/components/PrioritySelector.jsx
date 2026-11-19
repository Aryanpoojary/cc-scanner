import { motion } from "framer-motion";
import { AlertTriangle, Check, Circle, Flag, Zap } from "lucide-react";

export const PRIORITIES = [
  { value: "Low", label: "Low", icon: Circle, desc: "Minor issue, no urgency", responseTime: "72 Hours", responseLabel: "Response within" },
  { value: "Medium", label: "Medium", icon: Flag, desc: "Needs attention soon", responseTime: "48 Hours", responseLabel: "Response within" },
  { value: "High", label: "High", icon: AlertTriangle, desc: "Affecting operations", responseTime: "24 Hours", responseLabel: "Response within" },
  { value: "Emergency", label: "Emergency", icon: Zap, desc: "Safety risk or critical failure", responseTime: "2 Hours", responseLabel: "Within" },
];

const PRIORITY_COLORS = {
  Low: { gradient: "from-success to-sage", glow: "shadow-[0_12px_28px_-8px_rgba(47,158,110,.55)]", iconBg: "bg-success", border: "border-success/30", bg: "bg-success/10" },
  Medium: { gradient: "from-sage to-primary", glow: "shadow-[0_12px_28px_-8px_rgba(122,154,107,.55)]", iconBg: "bg-sage", border: "border-sage/30", bg: "bg-sage/10" },
  High: { gradient: "from-primary to-orange-500", glow: "shadow-[0_12px_28px_-8px_rgba(234,90,42,.55)]", iconBg: "bg-primary", border: "border-primary/30", bg: "bg-primary/10" },
  Emergency: { gradient: "from-danger to-red-600", glow: "shadow-[0_12px_28px_-8px_rgba(214,69,69,.55)]", iconBg: "bg-danger", border: "border-danger/30", bg: "bg-danger/10" },
};

export default function PrioritySelector({ value, onChange, error }) {
  return (
    <div>
      <div role="radiogroup" aria-label="Issue priority" className="grid grid-cols-2 gap-3">
        {PRIORITIES.map(({ value: v, label, icon: Icon, desc, responseTime, responseLabel }) => {
          const active = value === v;
          const colors = PRIORITY_COLORS[v];
          return (
            <motion.button
              key={v}
              type="button"
              role="radio"
              aria-checked={active}
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: active ? 1.01 : 1.02 }}
              onClick={() => onChange(v)}
              data-testid={`priority-${v.toLowerCase()}`}
              className={`relative flex flex-col items-start gap-2.5 p-4 rounded-2xl transition-all duration-250 ease-out ${
                active
                  ? `${colors.glow} border-2 border-white/30 bg-gradient-to-br ${colors.gradient} text-white scale-[1.03]`
                  : `shadow-neu-sm border ${colors.border} ${colors.bg} hover:shadow-neu hover:border-primary/30 hover:scale-[1.01]`
              }`}
              style={{ willChange: "transform, box-shadow" }}
            >
              <div className="relative z-10 flex w-full items-start justify-between gap-2">
                <motion.div
                  initial={false}
                  animate={{ 
                    scale: active ? 1.1 : 1, 
                    rotate: active ? 5 : 0,
                    boxShadow: active ? "0 8px 20px -6px rgba(0,0,0,0.15)" : "none"
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-250 ${
                    active ? "text-white bg-white/15" : `${colors.iconBg} text-ink`
                  }`}
                >
                  <Icon className="h-5 w-5" aria-hidden />
                </motion.div>
                
                <motion.div
                  initial={{ scale: 0, opacity: 0, rotate: -20 }}
                  animate={{ scale: active ? 1 : 0, opacity: active ? 1 : 0, rotate: active ? 0 : -20 }}
                  exit={{ scale: 0, opacity: 0, rotate: -20 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25, delay: active ? 0.05 : 0 }}
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-white/50 bg-white/10 text-white"
                >
                  <Check className="h-3.5 w-3.5" strokeWidth={3.5} aria-hidden />
                </motion.div>
              </div>

              <div className="relative z-10 flex-1 min-w-0 text-left">
                <motion.span
                  initial={false}
                  animate={{ 
                    x: active ? 2 : 0, 
                    color: active ? "#ffffff" : "#2B2825"
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                  className="block font-semibold text-sm leading-tight"
                >
                  {label}
                </motion.span>
                <motion.span
                  initial={false}
                  animate={{ 
                    opacity: active ? 1 : 0.7, 
                    x: active ? 2 : 0,
                    color: active ? "rgba(255,255,255,0.9)" : "#786F66"
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                  className="block text-[11px] leading-tight"
                >
                  {desc}
                </motion.span>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 4, scale: 0.95 }}
                animate={{ opacity: active ? 1 : 0.6, y: 0, scale: active ? 1 : 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 25, delay: 0.08 }}
                className={`relative z-10 flex items-center gap-1 text-[10px] font-medium leading-tight ${active ? "text-white" : "text-ink"}`}
              >
                <span className="font-display">{responseLabel}</span>
                <span className="tabular-nums">{responseTime}</span>
              </motion.div>
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