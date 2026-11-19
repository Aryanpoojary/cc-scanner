import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import { Toaster } from "react-hot-toast";
import { QrCode } from "lucide-react";
import ReportIssue from "./pages/ReportIssue";

function ScanPrompt() {
  return (
    <main className="grid min-h-dvh place-items-center p-6 text-center" data-testid="scan-prompt">
      <div className="neu-card max-w-sm p-8">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl shadow-neu-in text-primary"><QrCode className="h-8 w-8" /></span>
        <h1 className="mt-5 text-2xl font-bold">Scan a room QR code</h1>
        <p className="mt-2 text-sm text-muted">Each room has a QR code. Scan it to report an issue for that exact location.</p>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Routes>
          <Route path="/report/:roomId" element={<ReportIssue />} />
          <Route path="*" element={<ScanPrompt />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          style: { borderRadius: "16px", background: "#EFEBE6", color: "#2B2825", boxShadow: "6px 6px 16px rgba(170,159,145,.5), -6px -6px 16px rgba(255,255,255,.8)", fontWeight: 600, fontSize: "14px" },
          success: { iconTheme: { primary: "#2F9E6E", secondary: "#fff" } },
          error: { iconTheme: { primary: "#D64545", secondary: "#fff" } },
        }}
      />
    </MotionConfig>
  );
}
