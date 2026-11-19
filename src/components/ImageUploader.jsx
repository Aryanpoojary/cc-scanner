import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import { Camera, ImagePlus, X } from "lucide-react";

const MAX_MB = 10;

function PickButton({ icon: Icon, label, onClick, testId, iconBg }) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.96 }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      data-testid={testId}
      className="relative flex h-28 flex-col items-center justify-center gap-2.5 rounded-2xl text-sm font-semibold text-muted shadow-neu-sm transition-all duration-300 hover:shadow-neu hover:text-primary"
    >
      <motion.div
        initial={false}
        whileHover={{ scale: 1.1, rotate: 3 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className={`grid h-14 w-14 place-items-center rounded-xl ${iconBg} text-white shadow-[0_4px_12px_-4px_rgba(0,0,0,.15)]`}
      >
        <Icon className="h-7 w-7" aria-hidden />
      </motion.div>
      <span className="leading-tight">{label}</span>
    </motion.button>
  );
}

export default function ImageUploader({ file, onChange }) {
  const cameraRef = useRef(null);
  const galleryRef = useRef(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return undefined;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handle = (e) => {
    const picked = e.target.files?.[0];
    e.target.value = "";
    if (!picked) return;
    if (!picked.type.startsWith("image/")) return toast.error("Please choose an image file");
    if (picked.size > MAX_MB * 1024 * 1024) return toast.error(`Image must be under ${MAX_MB} MB`);
    onChange(picked);
  };

  const handleUnderDev = () => {
    toast("Photo uploading is currently under development", {
      icon: "ℹ️",
      duration: 3000,
    });
  };

  return (
    <div>
      <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handle} data-testid="camera-input" />
      <input ref={galleryRef} type="file" accept="image/*" className="hidden" onChange={handle} data-testid="gallery-input" />
      <AnimatePresence mode="wait">
        {file && preview ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="relative overflow-hidden rounded-2xl shadow-neu-in"
          >
            <img
              src={preview}
              alt="Selected issue photo"
              className="max-h-72 w-full rounded-t-2xl object-cover"
              data-testid="image-preview"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" aria-hidden />
            <div className="absolute inset-x-0 bottom-0 p-3 flex items-center justify-between">
              <p className="truncate text-sm font-medium text-white">{file.name}</p>
              <button
                type="button"
                onClick={() => onChange(null)}
                aria-label="Remove photo"
                data-testid="remove-image"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-all hover:bg-white/20"
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1 }}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-3 bg-canvas/95 backdrop-blur-sm border-t border-white/40">
              <p className="text-xs text-muted">Tap to change photo</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="pick"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="grid grid-cols-2 gap-3"
          >
            <PickButton
              icon={Camera}
              label="Take Photo"
              onClick={handleUnderDev}
              testId="camera-button"
              iconBg="bg-primary"
            />
            <PickButton
              icon={ImagePlus}
              label="From Gallery"
              onClick={handleUnderDev}
              testId="gallery-button"
              iconBg="bg-sage"
            />
          </motion.div>
        )}
      </AnimatePresence>
      <p className="mt-3 text-xs text-muted text-center">Optional · Photo upload under development</p>
    </div>
  );
}
