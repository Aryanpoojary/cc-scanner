import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Send, Clock } from "lucide-react";
import Card from "./Card";
import Button from "./Button";
import CategorySelector from "./CategorySelector";
import PrioritySelector from "./PrioritySelector";
import ImageUploader from "./ImageUploader";
import { PRIORITIES } from "./PrioritySelector";

const MAX_CHARS = 500;
const MIN_CHARS = 10;
const EMPTY = { category: "", priority: "Medium", description: "", image: null };

const PRIORITY_RESPONSE_TIMES = {
  Low: "Within 72 Hours",
  Medium: "Within 48 Hours",
  High: "Within 24 Hours",
  Emergency: "Within 2 Hours",
};

export default function ComplaintForm({ onSubmit, location }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});

  const set = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const handleBlur = (key) => {
    setTouched((t) => ({ ...t, [key]: true }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!form.category) next.category = "Choose what kind of issue it is";
    if (form.description.trim().length < MIN_CHARS) next.description = `Describe the issue in at least ${MIN_CHARS} characters`;
    setErrors(next);
    setTouched({ category: true, description: true });
    if (Object.keys(next).length) return toast.error("Please complete the form", { id: "form-invalid" });
    setLoading(true);
    toast.dismiss("form-invalid");
    try {
      await onSubmit({ ...form, description: form.description.trim() });
      setForm(EMPTY);
      setTouched({});
    } catch (err) {
      toast.error(err?.message || "Could not submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isSubmitDisabled = useMemo(
    () => !form.category || form.description.trim().length < MIN_CHARS,
    [form.category, form.description]
  );

  const estimatedResponse = useMemo(
    () => PRIORITY_RESPONSE_TIMES[form.priority] || PRIORITY_RESPONSE_TIMES.Medium,
    [form.priority]
  );

  return (
    <form onSubmit={submit} noValidate className="space-y-5" data-testid="complaint-form">
      <Card title="What's the issue?" step="1" delay={0.08}>
        <CategorySelector value={form.category} onChange={(v) => set("category", v)} error={errors.category} />
      </Card>

      <Card title="How urgent is it?" step="2" delay={0.14}>
        <PrioritySelector value={form.priority} onChange={(v) => set("priority", v)} error={errors.priority} />
      </Card>

      <Card title="Describe it" step="3" delay={0.2}>
        <div className="relative">
          <textarea
            id="description"
            rows={4}
            maxLength={MAX_CHARS}
            placeholder=" "
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            onBlur={() => handleBlur("description")}
            aria-invalid={!!errors.description || undefined}
            aria-describedby="description-hint"
            data-testid="description-input"
            className={`peer w-full resize-none rounded-2xl bg-canvas px-4 pb-3 pt-7 text-base shadow-neu-in outline-none transition-all duration-300 ${
              errors.description ? "ring-2 ring-danger/50" : ""
            } ${touched.description && form.description.length > 0 ? "ring-2 ring-success/40" : ""} focus:ring-2 focus:ring-primary/40`}
          />
          <label
            htmlFor="description"
            className="pointer-events-none absolute left-4 top-2.5 text-xs font-semibold text-muted transition-all duration-300 peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:font-medium peer-focus:top-2.5 peer-focus:text-xs peer-focus:font-semibold peer-focus:text-primary peer-[&:not(:placeholder-shown)]:top-2.5 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:font-semibold peer-[&:not(:placeholder-shown)]:text-primary"
          >
            What's wrong? e.g. AC leaking water on desks
          </label>
          <div className="absolute right-4 bottom-3 flex items-center gap-1.5">
            <span id="description-hint" className="sr-only">Character count</span>
            <motion.span
              initial={false}
              animate={{ scale: form.description.length >= MIN_CHARS ? 1 : 0.95 }}
              className={`tabular-nums text-xs font-mono transition-all duration-200 ${
                form.description.length >= MIN_CHARS ? "text-success" : "text-muted"
              }`}
            >
              {form.description.length}/{MAX_CHARS}
            </motion.span>
            {form.description.length >= MIN_CHARS && (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="text-success"
              >
                <Clock className="h-3.5 w-3.5" aria-hidden />
              </motion.span>
            )}
          </div>
        </div>
        {errors.description && touched.description && (
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            role="alert"
            className="mt-2 text-sm font-medium text-danger"
          >
            {errors.description}
          </motion.p>
        )}
      </Card>

      <Card title="Add a photo" step="4" delay={0.26}>
        <ImageUploader file={form.image} onChange={(f) => set("image", f)} />
      </Card>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.32, duration: 0.35 }}
        className="rounded-2xl p-4 shadow-neu-in bg-gradient-to-r from-primary/5 to-sage/5 border border-primary/10"
        data-testid="response-time-card"
      >
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary shadow-neu-sm">
            <Clock className="h-5 w-5" aria-hidden />
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">Estimated Resolution Time</p>
            <motion.p
              key={form.priority}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="mt-1 font-display text-lg font-bold text-primary"
            >
              {estimatedResponse}
            </motion.p>
            <p className="mt-1 text-xs text-muted">Based on <span className="font-semibold">{form.priority}</span> priority</p>
          </div>
        </div>
      </motion.div>

      <Button
        type="submit"
        loading={loading}
        icon={Send}
        className="w-full"
        disabled={isSubmitDisabled}
        data-testid="submit-button"
      >
        {loading ? "Submitting…" : "Submit report"}
      </Button>
    </form>
  );
}
