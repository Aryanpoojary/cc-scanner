import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Clock, ShieldCheck } from "lucide-react";
import Button from "./Button";

const PRIORITY_RESPONSE_TIMES = {
  Low: "Within 72 Hours",
  Medium: "Within 48 Hours",
  High: "Within 24 Hours",
  Emergency: "Within 2 Hours",
};

export default function SuccessModal({ open, complaintId, onClose, priority = "Medium" }) {
  const closeRef = useRef(null);
  const estimatedResponse = PRIORITY_RESPONSE_TIMES[priority] || PRIORITY_RESPONSE_TIMES.Medium;

  useEffect(() => {
    if (!open) return undefined;
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        e.preventDefault();
        closeRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            className="absolute inset-0 bg-stone-900/35 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="success-title"
            data-testid="success-modal"
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 360, damping: 30 }}
            className="relative w-full max-w-sm rounded-[28px] border border-white/50 bg-canvas/95 p-7 text-center shadow-neu backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 16, delay: 0.1 }}
              className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-success text-white shadow-[0_14px_30px_-10px_rgba(47,158,110,.7)]"
            >
              <Check className="h-10 w-10" strokeWidth={3} aria-hidden />
            </motion.div>
            
            <motion.h2
              id="success-title"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="mt-6 text-2xl font-bold"
            >
              Complaint Submitted
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.3 }}
              className="mt-2 text-sm text-muted"
            >
              Your report has been sent to the maintenance team.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className="mt-6 rounded-2xl p-4 shadow-neu-in"
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">Complaint ID</p>
              <p className="mt-1 font-display text-3xl font-extrabold tracking-tight text-primary" data-testid="complaint-id">{complaintId}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.3 }}
              className="mt-5 rounded-2xl p-4 bg-gradient-to-r from-primary/5 to-sage/5 border border-primary/10 shadow-neu-sm"
            >
              <div className="flex items-center justify-center gap-2 text-sm font-semibold text-primary">
                <Clock className="h-4 w-4" aria-hidden />
                <span>Estimated Response Time</span>
              </div>
              <motion.p
                key={priority}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 25, delay: 0.1 }}
                className="mt-2 font-display text-xl font-bold text-primary"
              >
                {estimatedResponse}
              </motion.p>
              <p className="mt-1 text-xs text-muted">Priority: <span className="font-semibold capitalize">{priority.toLowerCase()}</span></p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              className="mt-5 flex items-center justify-center gap-2 text-xs text-success"
            >
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
              <span>No login needed · Sent straight to maintenance</span>
            </motion.div>

            <Button
              ref={closeRef}
              onClick={onClose}
              className="mt-6 w-full"
              data-testid="close-modal-button"
            >
              Close
            </Button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
