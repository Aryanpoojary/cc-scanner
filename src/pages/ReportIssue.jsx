import { useCallback, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, ShieldCheck, Wrench, Building2, Layers, DoorOpen, Monitor } from "lucide-react";
import Card from "../components/Card";
import ComplaintForm from "../components/ComplaintForm";
import SuccessModal from "../components/SuccessModal";

const API_BASE_URL = (import.meta.env.VITE_API_URL || (typeof window !== "undefined" && window.location.origin.includes("onrender.com") ? window.location.origin : (typeof window !== "undefined" && window.location.port === "8000" ? window.location.origin : "https://ccbackend-9chd.onrender.com"))).replace(/\/+$/, "");

async function submitComplaint(payload) {
  const body = {
    title: payload.title || `${payload.category} issue in ${payload.roomId || "Room"}`,
    description: payload.description,
    category: payload.category,
    priority: payload.priority === "Emergency" ? "Critical" : (payload.priority || "Medium"),
    roomId: payload.roomId,
    buildingId: payload.buildingId || undefined,
    reporterName: "Student / Scanner User",
    reporterEmail: "scanner@campuscare.edu",
    reporterRole: "Student",
  };

  const response = await fetch(`${API_BASE_URL}/api/complaints/public`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let msg = `Submission failed (${response.status})`;
    try {
      const err = await response.json();
      if (err.detail) {
        msg = typeof err.detail === "string" ? err.detail : JSON.stringify(err.detail);
      }
    } catch { /* use default */ }
    throw new Error(msg);
  }

  const result = await response.json();
  return result.id;
}

// Parse room ID to extract building, floor, room, and room type
function parseLocation(roomId) {
  const decoded = decodeURIComponent(roomId).toUpperCase();
  
  // Format: MB-101 or NMB-102
  const parts = decoded.split(/[-_]/).filter(Boolean);
  
  let building = "Main Building (MB)";
  let floor = "Floor 1";
  let room = decoded;
  let roomType = "Room";
  
  if (parts.length >= 2) {
    const bCode = parts[0];
    if (bCode === "MB") {
      building = "Main Building (MB)";
    } else if (bCode === "NMB") {
      building = "New Mechanical Block (NMB)";
    } else {
      building = `Building ${bCode}`;
    }
    
    // Extract floor from room number e.g. 101 -> Floor 1, 702 -> Floor 7
    const rNum = parts[1];
    if (/^\d{3,4}$/.test(rNum)) {
      const fNum = rNum.length === 3 ? rNum[0] : rNum.slice(0, 2);
      floor = `Floor ${fNum}`;
    } else {
      floor = `Floor 1`;
    }
    room = `${bCode}-${rNum}`;
  }
  
  // Determine room type based on room code
  const roomUpper = room.toUpperCase();
  if (roomUpper.includes("LAB") || roomUpper.endsWith("01") || roomUpper.endsWith("02") || roomUpper.endsWith("03")) {
    roomType = "Laboratory";
  } else if (roomUpper.endsWith("17") || roomUpper.endsWith("18") || roomUpper.endsWith("19") || roomUpper.endsWith("20") || roomUpper.endsWith("21") || roomUpper.endsWith("06") || roomUpper.endsWith("07")) {
    roomType = "Faculty Office";
  } else {
    roomType = "Classroom";
  }
  
  return { building, floor, room, roomType };
}

export default function ReportIssue() {
  const { roomId } = useParams();
  // react-router already decodes params; decoding again throws on values like "%25", so fall back safely.
  let location = roomId;
  try { location = decodeURIComponent(roomId); } catch { /* keep raw */ }
  location = location.toUpperCase();
  
  const locationData = useMemo(() => parseLocation(location), [location]);
  const [complaintId, setComplaintId] = useState(null);
  const [submittedPriority, setSubmittedPriority] = useState("Medium");

  const handleSubmit = async (data) => {
    setSubmittedPriority(data.priority || "Medium");
    setComplaintId(await submitComplaint({ ...data, roomId: location }));
  };
  const close = useCallback(() => setComplaintId(null), []);

  return (
    <main className="mx-auto min-h-dvh w-full max-w-md px-4 pb-10 pt-6">
      <motion.header initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-center gap-3">
        <span className="gradient-primary grid h-11 w-11 place-items-center rounded-2xl text-white shadow-glow"><Wrench className="h-5 w-5" aria-hidden /></span>
        <div>
          <p className="font-display text-lg font-bold leading-tight">Campus Reporter</p>
          <p className="text-xs text-muted">Report an issue in under a minute</p>
        </div>
      </motion.header>

      <Card className="mb-5" data-testid="location-card">
        <div className="flex items-start gap-4">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl shadow-neu-in text-primary"><MapPin className="h-7 w-7" aria-hidden /></span>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">Location</p>
            <div className="mt-1 grid gap-1.5">
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.3 }}>
                <div className="flex items-center gap-2 text-sm font-medium text-ink">
                  <Building2 className="h-4 w-4 text-primary" aria-hidden />
                  <span className="font-display text-lg font-bold">{locationData.building}</span>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15, duration: 0.3 }}>
                <div className="flex items-center gap-2 text-sm font-medium text-ink">
                  <Layers className="h-4 w-4 text-primary" aria-hidden />
                  <span className="font-display text-lg font-bold">{locationData.floor}</span>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.3 }}>
                <div className="flex items-center gap-2 text-sm font-medium text-ink">
                  <DoorOpen className="h-4 w-4 text-primary" aria-hidden />
                  <span className="font-display text-lg font-bold">{locationData.room}</span>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25, duration: 0.3 }}>
                <div className="flex items-center gap-2 text-sm text-muted">
                  <Monitor className="h-4 w-4 text-primary" aria-hidden />
                  <span>{locationData.roomType}</span>
                </div>
              </motion.div>
            </div>
            <p className="mt-2 text-xs text-muted">Detected from the QR code</p>
          </div>
        </div>
      </Card>

      <ComplaintForm onSubmit={handleSubmit} location={locationData} />

      <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-muted">
        <ShieldCheck className="h-3.5 w-3.5" aria-hidden /> No login needed · Sent straight to maintenance
      </p>

      <SuccessModal open={!!complaintId} complaintId={complaintId} onClose={close} priority={submittedPriority} />
    </main>
  );
}
