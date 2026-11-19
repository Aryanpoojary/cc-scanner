import { forwardRef } from "react";
import { motion } from "framer-motion";
import { Loader2, Send } from "lucide-react";

const VARIANTS = {
  primary: "gradient-primary text-white shadow-glow hover:brightness-105",
  secondary: "bg-canvas text-ink shadow-neu-sm hover:text-primary active:shadow-neu-in",
};

const Button = forwardRef(function Button({ children, variant = "primary", loading = false, icon: Icon, className = "", disabled, type = "button", ...props }, ref) {
  return (
    <motion.button
      ref={ref}
      type={type}
      whileTap={{ scale: loading ? 1 : 0.97 }}
      whileHover={{ scale: loading ? 1 : 1.01 }}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={`relative inline-flex h-14 items-center justify-center gap-2 rounded-2xl px-6 text-base font-bold transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
          <span className="relative z-10">Submitting…</span>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
            className="absolute inset-0 rounded-2xl bg-white/20"
            aria-hidden
          />
        </>
      ) : (
        <>
          {Icon && <Icon className="h-5 w-5 transition-transform group-hover:translate-x-0.5" aria-hidden />}
          <span className="relative z-10">{children}</span>
        </>
      )}
      {!loading && !disabled && (
        <motion.div
          initial={{ scale: 0, opacity: 0.5 }}
          whileTap={{ scale: [0, 0.3, 1], opacity: [0.5, 0.3, 0] }}
          className="absolute inset-0 rounded-2xl bg-white/30 pointer-events-none"
          aria-hidden
        />
      )}
    </motion.button>
  );
});

export default Button;
