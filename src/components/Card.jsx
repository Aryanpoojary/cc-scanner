import { motion } from "framer-motion";

export default function Card({ title, step, children, className = "", delay = 0, ...props }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: "easeOut" }}
      className={`neu-card p-5 ${className}`}
      {...props}
    >
      {title && (
        <h2 className="mb-4 flex items-center gap-2.5 text-base font-bold">
          {step && <span className="grid h-6 w-6 place-items-center rounded-full shadow-neu-in text-xs font-bold text-primary">{step}</span>}
          {title}
        </h2>
      )}
      {children}
    </motion.section>
  );
}
