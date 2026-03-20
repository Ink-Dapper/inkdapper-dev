import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../utils/axios";
import { teesCollection } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";

const STYLES = [
  { id: "vector", label: "Vector", icon: "◈", desc: "Clean bold lines & shapes" },
  { id: "vintage", label: "Vintage", icon: "⌘", desc: "Retro & classic feel" },
  { id: "streetwear", label: "Street", icon: "◉", desc: "Urban bold graphics" },
  { id: "anime", label: "Anime", icon: "✦", desc: "Japanese manga art" },
  { id: "minimalist", label: "Minimal", icon: "◻", desc: "Simple & elegant" },
  { id: "realistic", label: "Realistic", icon: "◆", desc: "Photo-real detail" },
];

const EXAMPLE_PROMPTS = [
  "Cyberpunk tiger with neon glowing eyes",
  "Astronaut surfing a galaxy wave",
  "Samurai wolf under a full moon",
  "Dragon made of fire and lightning",
  "Skeleton riding a motorcycle",
  "Lotus flower with geometric patterns",
];

const BLEND_MODES = ["auto", "multiply", "screen", "overlay", "normal"];
const LIGHT_COLORS = ["white", "beige", "lavender"];
const SIZES = ["S", "M", "L", "XL", "XXL"];



// ── Section card wrapper ─────────────────────────────────────────────
const Panel = ({ children, className = "" }) => (
  <div
    className={`rounded-2xl overflow-hidden my-3 ${className}`}
    style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(249,115,22,0.13)" }}
  >
    {children}
  </div>
);

// ── Icon components ──────────────────────────────────────────────────
const DownloadIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);
const EyeIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);
const CartIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);
const RefreshIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);
const CloseIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);
const UploadCloudIcon = () => (
  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);
const SparkleIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

// ── Shirt mockup — now with opacity + rotation ──────────────────────
const ShirtMockup = ({
  shirt, generatedImage, loading,
  designWidth, designHeight, designX, designY,
  blendMode, designOpacity = 1, designRotation = 0, size = 220,
}) => (
  <div className="relative w-full" style={{ maxWidth: size }}>
    <img
      src={Array.isArray(shirt.image) ? shirt.image[0] : shirt.image}
      alt={`${shirt.color} shirt`}
      className="w-full h-auto drop-shadow-2xl"
    />
    <div
      className="absolute flex items-center justify-center"
      style={{
        top: `${designY}%`,
        left: `${designX}%`,
        transform: `translateX(-50%) rotate(${designRotation}deg)`,
        width: `${designWidth}%`,
        height: `${designHeight}%`,
        opacity: designOpacity,
      }}
    >
      {loading ? (
        <div className="flex flex-col items-center gap-3">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-2 border-orange-400/20 animate-ping" />
            <div className="w-12 h-12 rounded-full border-2 border-transparent border-t-orange-400 border-r-orange-400/40 animate-spin" />
          </div>
          <span className="text-[10px] text-slate-700 font-semibold tracking-widest uppercase">Creating…</span>
        </div>
      ) : generatedImage ? (
        <img
          src={generatedImage}
          alt="AI Generated Design"
          className="w-full h-full object-fill"
          style={{ mixBlendMode: blendMode }}
        />
      ) : (
        <div className="flex flex-col items-center gap-2 opacity-20 pointer-events-none select-none">
          <div className="w-14 h-14 rounded-full border-2 border-dashed border-slate-500 flex items-center justify-center">
            <span className="text-2xl">✦</span>
          </div>
          <span className="text-[9px] tracking-widest uppercase text-slate-500">Design area</span>
        </div>
      )}
    </div>
  </div>
);

// ── Reusable slider ──────────────────────────────────────────────────
const Slider = ({ label, value, set, min, max, unit = "%" }) => {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold ragged-subtitle">{label}</span>
        <span className="ragged-pill text-[10px] font-black px-2 py-0.5">{value}{unit}</span>
      </div>
      <input
        type="range" min={min} max={max} value={value}
        onChange={(e) => set(Number(e.target.value))}
        className="w-full h-1 appearance-none cursor-pointer rounded-full"
        style={{
          background: `linear-gradient(to right, var(--ragged-accent) ${pct}%, rgba(255,255,255,0.07) ${pct}%)`,
          accentColor: "var(--ragged-accent)",
        }}
      />
    </div>
  );
};

const PanelHeader = ({ children }) => (
  <div className="px-4 pt-4 pb-3" style={{ borderBottom: "1px solid rgba(249,115,22,0.08)" }}>
    <span className="text-[10px] font-black uppercase tracking-[0.22em] ragged-subtitle">{children}</span>
  </div>
);

// ────────────────────────────────────────────────────────────────────
const AIDesigner = () => {
  const { token, getUserCustomData } = useContext(ShopContext);

  // Prompt
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [showNegativePrompt, setShowNegativePrompt] = useState(false);

  // Style & shirt
  const [style, setStyle] = useState("vector");
  const [selectedShirtId, setSelectedShirtId] = useState("0001");

  // Generation
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [revisedPrompt, setRevisedPrompt] = useState("");

  // Design transform
  const [designWidth, setDesignWidth] = useState(64);
  const [designHeight, setDesignHeight] = useState(55);
  const [designX, setDesignX] = useState(50);
  const [designY, setDesignY] = useState(22);
  const [designOpacity, setDesignOpacity] = useState(1);
  const [designRotation, setDesignRotation] = useState(0);
  const [manualBlendMode, setManualBlendMode] = useState("auto");

  // UI
  const [showPreview, setShowPreview] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [activeTransformTab, setActiveTransformTab] = useState("size");

  // Order
  const [orderSize, setOrderSize] = useState("");
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [orderLoading, setOrderLoading] = useState(false);

  // Upload mode
  const [designMode, setDesignMode] = useState("ai");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [mobileStep, setMobileStep] = useState(0); // 0 = Design, 1 = Customize

  const navigate = useNavigate();
  const selectedShirt = teesCollection.find((t) => t._id === selectedShirtId) || teesCollection[0];
  const isLightShirt = LIGHT_COLORS.includes(selectedShirt.color);
  const autoBlendMode = isLightShirt ? "multiply" : "screen";
  const blendMode = manualBlendMode === "auto" ? autoBlendMode : manualBlendMode;
  const activeDesign = designMode === "upload" ? uploadedImage : generatedImage;

  // ── Handlers ──────────────────────────────────────────────────────
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Please upload an image file."); return; }
    const reader = new FileReader();
    reader.onload = (ev) => setUploadedImage(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleOrderCustomShirt = () => {
    if (!token) { toast.error("Please log in to place an order."); return; }
    if (!activeDesign) { toast.error("Please generate or upload a design first."); return; }
    setOrderSize("");
    setOrderQuantity(1);
    setShowOrderModal(true);
    setShowPreview(false);
  };

  const captureShirtMockup = async () => {
    const W = 800, H = 960;
    const toDataUrl = async (src) => {
      if (!src || src.startsWith("data:")) return src;
      const res = await fetch(src);
      const blob = await res.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(blob);
      });
    };
    const loadImg = (src) => new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });

    const canvas = document.createElement("canvas");
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext("2d");

    const shirtSrc = Array.isArray(selectedShirt.image) ? selectedShirt.image[0] : selectedShirt.image;
    const shirtImg = await loadImg(await toDataUrl(shirtSrc));
    ctx.drawImage(shirtImg, 0, 0, W, H);

    if (activeDesign) {
      const designImg = await loadImg(await toDataUrl(activeDesign));
      const dw = W * (designWidth / 100);
      const dh = H * (designHeight / 100);
      const dx = W * (designX / 100) - dw / 2;
      const dy = H * (designY / 100);
      ctx.save();
      ctx.globalAlpha = designOpacity;
      if (designRotation !== 0) {
        ctx.translate(dx + dw / 2, dy + dh / 2);
        ctx.rotate((designRotation * Math.PI) / 180);
        ctx.translate(-(dx + dw / 2), -(dy + dh / 2));
      }
      ctx.globalCompositeOperation = blendMode === "normal" ? "source-over" : blendMode;
      ctx.drawImage(designImg, dx, dy, dw, dh);
      ctx.restore();
    }

    return new Promise((resolve, reject) =>
      canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Canvas toBlob failed"))), "image/png")
    );
  };

  const handleAddToCart = async () => {
    if (!orderSize) { toast.error("Please select a size."); return; }
    if (orderQuantity < 1) { toast.error("Quantity must be at least 1."); return; }
    setOrderLoading(true);
    try {
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
      const randomPart = Math.random().toString(36).substring(2, 10).toUpperCase();
      const customOrderId = `CUST-${dateStr}-${randomPart}`;

      const formData = new FormData();
      formData.append("imageId", customOrderId);
      formData.append("size", orderSize);
      formData.append("views", "Front");
      formData.append("gender", "Men");
      formData.append("imageValue", selectedShirt.color);
      formData.append("customQuantity", orderQuantity);

      if (designMode === "ai" && generatedImage) {
        formData.append("aiDesignUrl", generatedImage);
      }
      if (designMode === "upload" && uploadedImage) {
        const rawRes = await fetch(uploadedImage);
        const rawBlob = await rawRes.blob();
        const rawFile = new File([rawBlob], `raw-design-${customOrderId}.png`, { type: rawBlob.type || "image/png" });
        formData.append("rawDesignImage", rawFile);
      }

      try {
        const mockupBlob = await captureShirtMockup();
        const mockupFile = new File([mockupBlob], `cart-mockup-${customOrderId}.png`, { type: "image/png" });
        formData.append("reviewImageCustom", mockupFile);
        formData.append("designFolder", "cart");
      } catch (err) {
        console.error("Mockup capture failed, falling back to raw design:", err);
        if (activeDesign) {
          const res = await fetch(activeDesign);
          const blob = await res.blob();
          const file = new File([blob], `cart-design-${customOrderId}.png`, { type: blob.type || "image/png" });
          formData.append("reviewImageCustom", file);
          formData.append("designFolder", "cart");
        }
      }

      const { data } = await axios.post(`/cart/custom`, formData, { headers: { "Content-Type": undefined } });
      if (data.success) {
        toast.success("Added to cart!");
        setShowOrderModal(false);
        await getUserCustomData();
        navigate("/cart");
      } else {
        toast.error(data.message || "Failed to add to cart.");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong.");
    } finally {
      setOrderLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) { toast.error("Please describe your design first."); return; }
    if (prompt.trim().length < 5) { toast.error("Please provide a more detailed description."); return; }
    setLoading(true);
    setGeneratedImage(null);
    setRevisedPrompt("");
    try {
      const fullPrompt = negativePrompt.trim()
        ? `${prompt.trim()}. Avoid: ${negativePrompt.trim()}`
        : prompt.trim();
      const { data } = await axios.post(`/ai/generate`, { prompt: fullPrompt, style }, { timeout: 90000 });
      if (data.success) {
        setGeneratedImage(data.imageUrl);
        setRevisedPrompt(data.revisedPrompt || "");
        toast.success("Design generated!");
      } else {
        toast.error(data.message || "Generation failed.");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!activeDesign) return;
    if (designMode === "upload" && uploadedImage) {
      const a = document.createElement("a");
      a.href = uploadedImage;
      a.download = `inkdapper-design-${Date.now()}.png`;
      a.click();
      return;
    }
    try {
      const res = await fetch(generatedImage);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `inkdapper-design-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Download failed. Try right-clicking the image.");
    }
  };

  // ── Render ────────────────────────────────────────────────────────
  return (
    <div className="ragged-section min-h-screen flex flex-col">
      <div className="ragged-noise" />
      <div className="ragged-divider" />

      {/* ══ ORDER MODAL ══════════════════════════════════════════════ */}
      {showOrderModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(24px)" }}
          onClick={() => setShowOrderModal(false)}
        >
          <div
            className="relative w-full overflow-hidden rounded-2xl max-h-[90vh] overflow-y-auto"
            style={{ maxWidth: 400, background: "rgba(13,13,14,0.98)", border: "1px solid rgba(249,115,22,0.28)", boxShadow: "0 0 80px rgba(249,115,22,0.08), 0 40px 80px rgba(0,0,0,0.6)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-px w-full" style={{ background: "linear-gradient(90deg,transparent,var(--ragged-accent),var(--ragged-accent-2),transparent)" }} />
            <div className="px-6 pt-5 pb-4 flex items-start justify-between">
              <div>
                <div className="ragged-pill text-[10px] font-black uppercase tracking-widest px-2.5 py-1 mb-2 inline-flex items-center gap-1.5">
                  <SparkleIcon /> Custom Order
                </div>
                <p className="ragged-title text-xl capitalize">{selectedShirt.color} T-Shirt</p>
                <p className="text-xs mt-0.5 ragged-subtitle capitalize">{designMode === "upload" ? "Custom Upload" : "AI Generated"} · ₹699 each</p>
              </div>
              <button onClick={() => setShowOrderModal(false)}
                className="mt-1 w-8 h-8 flex items-center justify-center rounded-xl transition-all hover:bg-white/5"
                style={{ border: "1px solid rgba(255,255,255,0.1)", color: "#64748b" }}>
                <CloseIcon />
              </button>
            </div>

            <div style={{ height: 1, background: "rgba(249,115,22,0.1)" }} />

            <div className="flex justify-center py-6 px-8"
              style={{ background: "radial-gradient(ellipse at center, rgba(249,115,22,0.06) 0%, transparent 70%)" }}>
              <ShirtMockup shirt={selectedShirt} generatedImage={activeDesign} loading={false}
                designWidth={designWidth} designHeight={designHeight} designX={designX} designY={designY}
                blendMode={blendMode} designOpacity={designOpacity} designRotation={designRotation} size={160} />
            </div>

            <div style={{ height: 1, background: "rgba(249,115,22,0.1)" }} />

            <div className="px-5 py-5 space-y-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] ragged-subtitle mb-2.5">Select Size</p>
                <div className="flex gap-2">
                  {SIZES.map((s) => (
                    <button key={s} onClick={() => setOrderSize(s)}
                      className="flex-1 py-2 sm:py-2.5 text-[10px] sm:text-xs font-black uppercase tracking-wide transition-all rounded-xl"
                      style={orderSize === s
                        ? { background: "rgba(249,115,22,0.18)", border: "1.5px solid var(--ragged-accent)", color: "var(--ragged-accent)", boxShadow: "0 0 14px rgba(249,115,22,0.2)" }
                        : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", color: "#64748b" }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] ragged-subtitle mb-2.5">Quantity</p>
                <div className="flex items-center overflow-hidden rounded-xl"
                  style={{ border: "1px solid rgba(249,115,22,0.2)", background: "rgba(255,255,255,0.02)" }}>
                  <button onClick={() => setOrderQuantity(q => Math.max(1, q - 1))}
                    className="w-11 h-11 text-lg font-black flex items-center justify-center transition-colors hover:bg-orange-500/10"
                    style={{ color: "#94a3b8", borderRight: "1px solid rgba(249,115,22,0.15)" }}>−</button>
                  <span className="text-white font-black text-xl flex-1 text-center">{orderQuantity}</span>
                  <button onClick={() => setOrderQuantity(q => q + 1)}
                    className="w-11 h-11 text-lg font-black flex items-center justify-center transition-colors hover:bg-orange-500/10"
                    style={{ color: "#94a3b8", borderLeft: "1px solid rgba(249,115,22,0.15)" }}>+</button>
                  <span className="pr-4 text-xs ragged-subtitle">
                    = <span className="font-black" style={{ color: "var(--ragged-accent)" }}>₹{699 * orderQuantity}</span>
                  </span>
                </div>
              </div>

              <button onClick={handleAddToCart} disabled={orderLoading || !orderSize}
                className="ragged-solid-btn w-full py-3.5 text-xs font-black uppercase tracking-[0.2em] transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {orderLoading
                  ? <><span className="w-4 h-4 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" /> Adding…</>
                  : <><CartIcon /> Add to Cart</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ FULL PREVIEW MODAL ═══════════════════════════════════════ */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(24px)" }}
          onClick={() => setShowPreview(false)}>
          <div className="relative w-full overflow-hidden rounded-2xl"
            style={{ maxWidth: 500, background: "rgba(13,13,14,0.98)", border: "1px solid rgba(249,115,22,0.22)", boxShadow: "0 0 80px rgba(0,0,0,0.8)" }}
            onClick={(e) => e.stopPropagation()}>
            <div className="h-px w-full" style={{ background: "linear-gradient(90deg,transparent,var(--ragged-accent),var(--ragged-accent-2),transparent)" }} />
            <div className="flex items-center justify-between px-6 py-4">
              <div>
                <div className="ragged-pill text-[10px] font-black uppercase tracking-widest px-2.5 py-1 mb-1.5 inline-flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" /> Full Preview
                </div>
                <p className="ragged-title text-xl capitalize">{selectedShirt.color} · {STYLES.find(s => s.id === style)?.label}</p>
              </div>
              <button onClick={() => setShowPreview(false)}
                className="w-8 h-8 flex items-center justify-center rounded-xl transition-all hover:bg-white/5"
                style={{ border: "1px solid rgba(255,255,255,0.1)", color: "#64748b" }}>
                <CloseIcon />
              </button>
            </div>
            <div style={{ height: 1, background: "rgba(249,115,22,0.1)" }} />
            <div className="flex items-center justify-center py-10 px-8"
              style={{ background: "radial-gradient(ellipse at center, rgba(249,115,22,0.05) 0%, transparent 70%)" }}>
              <ShirtMockup shirt={selectedShirt} generatedImage={activeDesign} loading={loading}
                designWidth={designWidth} designHeight={designHeight} designX={designX} designY={designY}
                blendMode={blendMode} designOpacity={designOpacity} designRotation={designRotation} size={320} />
            </div>
            <div style={{ height: 1, background: "rgba(249,115,22,0.1)" }} />
            <div className="px-5 py-4 flex gap-3">
              <button onClick={handleDownload}
                className="ragged-outline-btn flex-1 py-3 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                <DownloadIcon /> Download
              </button>
              <button onClick={handleOrderCustomShirt}
                className="ragged-solid-btn flex-1 py-3 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2">
                <CartIcon /> Order Shirt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ PAGE HEADER ══════════════════════════════════════════════ */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 md:px-6 pt-8 md:pt-12 pb-4 md:pb-6">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
              <div className="ragged-pill text-[9px] sm:text-[10px] font-black uppercase tracking-[0.18em] sm:tracking-[0.22em] px-2.5 sm:px-3 py-1 sm:py-1.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                AI Powered Studio
              </div>
              <div className="hidden sm:flex items-center gap-1.5 text-[10px] ragged-subtitle font-medium">
                <span>DALL·E 3</span>
                <span className="opacity-30">·</span>
                <span>Real-time preview</span>
                <span className="opacity-30">·</span>
                <span>Instant print</span>
              </div>
            </div>
            <h1 className="ragged-title" style={{ fontSize: "clamp(2.1rem,6.5vw,5rem)", lineHeight: 0.9 }}>
              Design<br /><span style={{ color: "var(--ragged-accent)" }}>Your</span> Shirt
            </h1>
            <p className="ragged-subtitle text-xs sm:text-sm mt-3 sm:mt-4 max-w-sm leading-relaxed">
              Generate AI art or upload your own design. Preview it live on any shirt color, then order instantly.
            </p>
          </div>
          <div className="hidden lg:grid grid-cols-1 gap-2.5 text-right shrink-0">
            {[
              ["✦", "DALL·E 3 AI generation"],
              ["◎", "Real-time shirt mockup"],
              ["◈", "100% custom print"],
            ].map(([icon, text]) => (
              <div key={text} className="flex items-center justify-end gap-2">
                <span className="text-xs ragged-subtitle">{text}</span>
                <span className="text-[10px]" style={{ color: "var(--ragged-accent)" }}>{icon}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ MAIN LAYOUT ══════════════════════════════════════════════ */}
      <div className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-3 sm:px-4 md:px-6 pb-14 md:pb-16 flex flex-col md:grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-4 sm:gap-5 items-start">

        {/* ═══ LEFT — CONTROLS ════════════════════════════════════════ */}
        <div className="space-y-2.5 sm:space-y-3 order-2 md:order-1">

          {/* ── Mobile step tabs ── */}
          <div className="md:hidden flex rounded-2xl overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', padding: 4, gap: 4 }}>
            {[
              { id: 0, icon: '✦', label: 'Design' },
              { id: 1, icon: '◎', label: 'Customize' },
            ].map(({ id, icon, label }) => (
              <button key={id} onClick={() => setMobileStep(id)}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-black text-xs uppercase tracking-wider"
                style={mobileStep === id
                  ? { background: 'rgba(249,115,22,0.14)', border: '1px solid rgba(249,115,22,0.38)', color: 'var(--ragged-accent)' }
                  : { border: '1px solid transparent', color: '#64748b' }}>
                <span>{icon}</span> {label}
              </button>
            ))}
          </div>

          {/* ── Step 0: Design (mode, prompt, style, upload) ── */}
          <div className={mobileStep !== 0 ? 'hidden md:block' : ''}>

          {/* Mode Toggle */}
          <div className="flex p-1 gap-1 rounded-2xl"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
            {[
              { id: "ai", label: "✦ AI Generate", sub: "DALL·E 3 powered" },
              { id: "upload", label: "↑ Upload Image", sub: "PNG · JPG · SVG" },
            ].map(({ id, label, sub }) => (
              <button key={id} onClick={() => setDesignMode(id)}
                className="flex-1 flex flex-col items-center py-3 sm:py-3.5 px-2 sm:px-4 rounded-xl text-center transition-all duration-200"
                style={designMode === id
                  ? { background: "rgba(249,115,22,0.14)", border: "1px solid rgba(249,115,22,0.38)", color: "var(--ragged-accent)" }
                  : { border: "1px solid transparent", color: "#64748b" }}>
                <span className="text-[11px] sm:text-xs font-black text-white uppercase tracking-wider">{label}</span>
                <span className="text-[8px] sm:text-[9px] mt-0.5 opacity-60 font-semibold tracking-wider hidden xs:block sm:block">{sub}</span>
              </button>
            ))}
          </div>

          {/* ── AI: Prompt ─────────────────────────────────────────── */}
          {designMode === "ai" && (
            <Panel>
              <div className="flex items-center justify-between px-4 pt-4 pb-3">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] ragged-subtitle">Your Prompt</span>
                <span className="text-[10px] ragged-subtitle">
                  <span style={{ color: prompt.length > 400 ? "var(--ragged-accent)" : undefined }}>{prompt.length}</span>/500
                </span>
              </div>
              <textarea
                rows={4} value={prompt} onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. Cyberpunk tiger with neon glowing eyes, bold graphic style..."
                className="w-full bg-transparent text-sm resize-none outline-none leading-relaxed placeholder-slate-700 px-4 py-3"
                style={{ color: "#e2e8f0", caretColor: "var(--ragged-accent)" }}
                onKeyDown={(e) => { if (e.key === "Enter" && e.ctrlKey) handleGenerate(); }}
              />
              <div className="flex items-center justify-between px-4 py-2.5"
                style={{ borderTop: "1px solid rgba(249,115,22,0.08)" }}>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowNegativePrompt(v => !v)}
                    className="text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5"
                    style={{ color: showNegativePrompt ? "var(--ragged-accent)" : "#64748b" }}>
                    <span className="text-sm leading-none font-black">{showNegativePrompt ? "−" : "+"}</span>
                    Avoid
                  </button>
                  <span className="text-[10px] opacity-30 hidden sm:block">Ctrl+Enter to generate</span>
                </div>
                <button onClick={() => { setPrompt(""); setNegativePrompt(""); }}
                  className="text-[10px] font-bold uppercase tracking-wider ragged-subtitle hover:text-red-400 transition-colors">
                  Clear ✕
                </button>
              </div>
              {showNegativePrompt && (
                <div style={{ borderTop: "1px solid rgba(249,115,22,0.08)" }}>
                  <div className="px-4 pt-3 pb-1 flex items-center gap-2">
                    <span className="w-1 h-3 rounded-full" style={{ background: "rgba(249,115,22,0.5)" }} />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em]" style={{ color: "rgba(249,115,22,0.7)" }}>
                      Negative Prompt — avoid these in the design
                    </span>
                  </div>
                  <textarea
                    rows={2} value={negativePrompt} onChange={(e) => setNegativePrompt(e.target.value)}
                    placeholder="e.g. blurry, text, watermark, low quality, distorted..."
                    className="w-full bg-transparent text-xs resize-none outline-none leading-relaxed placeholder-slate-700 px-4 py-2 pb-3"
                    style={{ color: "rgba(249,115,22,0.75)", caretColor: "var(--ragged-accent)" }}
                  />
                </div>
              )}
            </Panel>
          )}

          {/* ── AI: Style Grid ─────────────────────────────────────── */}
          {designMode === "ai" && (
            <Panel>
              <div className="px-3 pt-2 pb-2 grid grid-cols-3 gap-1.5">
                {STYLES.map((s) => (
                  <button key={s.id} onClick={() => setStyle(s.id)}
                    className="flex items-center gap-2 px-2.5 py-2 rounded-xl transition-all duration-200 hover:scale-[1.02]"
                    style={style === s.id
                      ? { background: "rgba(249,115,22,0.13)", border: "1.5px solid rgba(249,115,22,0.5)", color: "var(--ragged-accent)" }
                      : { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", color: "#64748b" }}>
                    <span className="text-base text-white shrink-0">{s.icon}</span>
                    <span className="text-[10px] font-black text-white uppercase tracking-wide leading-tight">{s.label}</span>
                  </button>
                ))}
              </div>

              {/* Inspiration chips */}
              <div style={{ borderTop: "1px solid rgba(249,115,22,0.08)" }}>
                <div className="px-4 pt-3 pb-2">
                  <span className="text-[9px] text-white font-black uppercase tracking-[0.22em] ragged-subtitle">Inspiration</span>
                </div>
                <div className="px-3 pb-3 flex flex-wrap gap-1.5">
                  {EXAMPLE_PROMPTS.map((ex) => (
                    <button key={ex} onClick={() => setPrompt(ex)}
                      className="text-[10px] font-medium px-2.5 py-1.5 rounded-full transition-all hover:border-orange-400/40 hover:text-orange-300"
                      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", color: "#94a3b8" }}>
                      {ex}
                    </button>
                  ))}
                </div>
              </div>
            </Panel>
          )}

          {/* ── Upload Mode ─────────────────────────────────────────── */}
          {designMode === "upload" && (
            <Panel>
              <PanelHeader>Upload Your Design</PanelHeader>
              <div className="p-3">
                {uploadedImage ? (
                  <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(249,115,22,0.22)" }}>
                    <img src={uploadedImage} alt="Uploaded design"
                      className="w-full max-h-56 object-contain"
                      style={{ background: "rgba(255,255,255,0.02)" }} />
                    <div className="flex items-center justify-between px-3 py-2.5"
                      style={{ borderTop: "1px solid rgba(249,115,22,0.1)", background: "rgba(0,0,0,0.45)" }}>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span className="text-[10px] font-bold text-emerald-400">Image ready</span>
                      </div>
                      <button onClick={() => setUploadedImage(null)}
                        className="text-[10px] font-bold ragged-subtitle hover:text-red-400 transition-colors flex items-center gap-1">
                        <CloseIcon /> Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center gap-3 sm:gap-4 cursor-pointer py-8 sm:py-12 rounded-xl transition-all group hover:border-orange-400/35"
                    style={{ border: "2px dashed rgba(249,115,22,0.2)", minHeight: 170, background: "rgba(249,115,22,0.01)" }}>
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all group-hover:scale-105"
                      style={{ background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.2)", color: "var(--ragged-accent)" }}>
                      <UploadCloudIcon />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-black uppercase tracking-wider" style={{ color: "var(--ragged-muted)" }}>Drop image here</p>
                      <p className="text-xs mt-1 ragged-subtitle">PNG · JPG · SVG · WebP · Max 10MB</p>
                    </div>
                    <div className="ragged-pill text-[10px] font-black uppercase tracking-widest px-4 py-1.5">Browse Files</div>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                )}
              </div>
            </Panel>
          )}

          </div>{/* end step 0: Design */}

          {/* ── Step 1: Customize (transform, shirt color) ── */}
          <div className={mobileStep !== 1 ? 'hidden md:block' : ''}>

          {/* ── Transform Panel (tabbed) ────────────────────────────── */}
          <Panel>
            {/* Tab bar */}
            <div className="flex" style={{ borderBottom: "1px solid rgba(249,115,22,0.09)" }}>
              {[
                { id: "size", label: "Size" },
                { id: "position", label: "Position" },
                { id: "advanced", label: "Advanced" },
              ].map((tab) => (
                <button key={tab.id} onClick={() => setActiveTransformTab(tab.id)}
                  className="flex-1 py-3 text-[9px] sm:text-[10px] font-black uppercase tracking-wider transition-all"
                  style={activeTransformTab === tab.id
                    ? { borderBottom: "2px solid var(--ragged-accent)", color: "var(--ragged-accent)", background: "rgba(249,115,22,0.05)" }
                    : { borderBottom: "2px solid transparent", color: "#64748b" }}>
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="px-4 py-4">
              {/* Size tab */}
              {activeTransformTab === "size" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] ragged-subtitle font-bold uppercase tracking-wider">Design Scale</span>
                    <button onClick={() => { setDesignWidth(64); setDesignHeight(55); }}
                      className="text-[9px] font-bold uppercase tracking-wider ragged-subtitle hover:text-orange-400 transition-colors px-2 py-1 rounded-lg"
                      style={{ border: "1px solid rgba(249,115,22,0.18)" }}>Reset</button>
                  </div>
                  <Slider label="Width" value={designWidth} set={setDesignWidth} min={10} max={120} />
                  <Slider label="Height" value={designHeight} set={setDesignHeight} min={10} max={120} />
                </div>
              )}

              {/* Position tab */}
              {activeTransformTab === "position" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] ragged-subtitle font-bold uppercase tracking-wider">Position</span>
                    <button onClick={() => { setDesignX(50); setDesignY(22); }}
                      className="text-[9px] font-bold uppercase tracking-wider ragged-subtitle hover:text-orange-400 transition-colors px-2 py-1 rounded-lg"
                      style={{ border: "1px solid rgba(249,115,22,0.18)" }}>Center</button>
                  </div>
                  <Slider label="Horizontal (X)" value={designX} set={setDesignX} min={10} max={90} />
                  <Slider label="Vertical (Y)" value={designY} set={setDesignY} min={5} max={80} />

                  {/* D-Pad */}
                  <div className="flex flex-col items-center gap-1.5 pt-2">
                    <button onClick={() => setDesignY(y => Math.max(5, y - 3))}
                      className="w-9 h-9 flex items-center justify-center rounded-xl font-black text-lg transition-all hover:text-orange-400 active:scale-90"
                      style={{ background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.14)", color: "#94a3b8" }}>↑</button>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => setDesignX(x => Math.max(10, x - 3))}
                        className="w-9 h-9 flex items-center justify-center rounded-xl font-black text-lg transition-all hover:text-orange-400 active:scale-90"
                        style={{ background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.14)", color: "#94a3b8" }}>←</button>
                      <button onClick={() => { setDesignX(50); setDesignY(22); }}
                        className="w-9 h-9 flex items-center justify-center rounded-xl font-black transition-all hover:text-orange-400 active:scale-90"
                        style={{ background: "rgba(249,115,22,0.12)", border: "1.5px solid rgba(249,115,22,0.32)", color: "var(--ragged-accent)" }}>⌖</button>
                      <button onClick={() => setDesignX(x => Math.min(90, x + 3))}
                        className="w-9 h-9 flex items-center justify-center rounded-xl font-black text-lg transition-all hover:text-orange-400 active:scale-90"
                        style={{ background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.14)", color: "#94a3b8" }}>→</button>
                    </div>
                    <button onClick={() => setDesignY(y => Math.min(80, y + 3))}
                      className="w-9 h-9 flex items-center justify-center rounded-xl font-black text-lg transition-all hover:text-orange-400 active:scale-90"
                      style={{ background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.14)", color: "#94a3b8" }}>↓</button>
                  </div>
                </div>
              )}

              {/* Advanced tab */}
              {activeTransformTab === "advanced" && (
                <div className="space-y-4">
                  {/* Opacity */}
                  <Slider
                    label="Opacity"
                    value={Math.round(designOpacity * 100)}
                    set={(v) => setDesignOpacity(v / 100)}
                    min={10} max={100}
                  />

                  {/* Rotation */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold ragged-subtitle">Rotation</span>
                      <div className="flex items-center gap-1.5">
                        <span className="ragged-pill text-[10px] font-black px-2 py-0.5">{designRotation}°</span>
                        <button onClick={() => setDesignRotation(0)}
                          className="text-[9px] font-bold ragged-subtitle hover:text-orange-400 transition-colors px-1.5 py-0.5 rounded"
                          style={{ border: "1px solid rgba(249,115,22,0.18)" }}>Reset</button>
                      </div>
                    </div>
                    <input type="range" min={-180} max={180} value={designRotation}
                      onChange={(e) => setDesignRotation(Number(e.target.value))}
                      className="w-full h-1 appearance-none cursor-pointer rounded-full"
                      style={{
                        background: `linear-gradient(to right, rgba(255,255,255,0.06) 0%, var(--ragged-accent) 50%, rgba(255,255,255,0.06) 100%)`,
                        accentColor: "var(--ragged-accent)",
                      }}
                    />
                    <div className="flex justify-between mt-1 text-[8px] ragged-subtitle">
                      <span>-180°</span><span>0°</span><span>+180°</span>
                    </div>
                  </div>

                  {/* Blend Mode */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold ragged-subtitle">Blend Mode</span>
                      <span className="text-[9px] ragged-subtitle opacity-60">
                        {manualBlendMode === "auto" ? `Auto → ${autoBlendMode}` : manualBlendMode}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {BLEND_MODES.map((m) => (
                        <button key={m} onClick={() => setManualBlendMode(m)}
                          className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all"
                          style={manualBlendMode === m
                            ? { background: "rgba(249,115,22,0.16)", border: "1px solid rgba(249,115,22,0.42)", color: "var(--ragged-accent)" }
                            : { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", color: "#64748b" }}>
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => { setDesignOpacity(1); setDesignRotation(0); setManualBlendMode("auto"); }}
                    className="w-full py-2 text-[10px] font-bold uppercase tracking-wider ragged-subtitle hover:text-orange-400 transition-colors rounded-xl"
                    style={{ border: "1px solid rgba(249,115,22,0.14)", background: "rgba(249,115,22,0.02)" }}>
                    Reset Advanced Settings
                  </button>
                </div>
              )}
            </div>
          </Panel>

          {/* ── Shirt Color ─────────────────────────────────────────── */}
          <Panel>
            <div className="flex items-center justify-between px-4 pt-4 pb-3"
              style={{ borderBottom: "1px solid rgba(249,115,22,0.08)" }}>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] ragged-subtitle">Shirt Color</span>
              <span className="ragged-pill text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 capitalize">
                {selectedShirt.color}
              </span>
            </div>
            <div className="p-3 grid grid-cols-4 sm:grid-cols-5 gap-2">
              {teesCollection.map((t) => (
                <button key={t._id} onClick={() => setSelectedShirtId(t._id)} title={t.color}
                  className="relative overflow-hidden rounded-xl transition-all duration-200 hover:scale-105 group"
                  style={{
                    border: selectedShirtId === t._id ? "2px solid var(--ragged-accent)" : "2px solid rgba(255,255,255,0.06)",
                    boxShadow: selectedShirtId === t._id ? "0 0 0 3px rgba(249,115,22,0.14)" : "none",
                    aspectRatio: "3/4",
                  }}>
                  <img src={Array.isArray(t.image) ? t.image[0] : t.image} alt={t.color} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-1"
                    style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 60%)" }}>
                    <span className="text-white text-[7px] font-black uppercase">{t.color}</span>
                  </div>
                  {selectedShirtId === t._id && (
                    <div className="absolute inset-0 flex items-end justify-center pb-1"
                      style={{ background: "linear-gradient(to top,rgba(249,115,22,0.6) 0%,transparent 55%)" }}>
                      <span className="text-white text-[7px] font-black uppercase">{t.color}</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </Panel>

          </div>{/* end step 1: Customize */}
        </div>

        {/* ═══ RIGHT — LIVE PREVIEW ════════════════════════════════════ */}
        <div className="order-1 md:order-2 lg:sticky lg:top-[62px] self-start rounded-2xl overflow-hidden"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(249,115,22,0.16)" }}>

          {/* Top accent line */}
          <div className="h-px w-full" style={{ background: "linear-gradient(90deg,transparent,var(--ragged-accent),var(--ragged-accent-2),transparent)" }} />

          {/* Header */}
          <div className="flex items-center justify-between px-3 sm:px-5 py-3 sm:py-3.5"
            style={{ borderBottom: "1px solid rgba(249,115,22,0.08)" }}>
            <div className="flex items-center gap-3">
              <div className="ragged-pill text-[10px] font-black uppercase tracking-[0.2em] px-2.5 py-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                Live Preview
              </div>
              <span className="hidden sm:block text-[10px] ragged-subtitle">
                <span className="capitalize font-semibold" style={{ color: "var(--ragged-accent)" }}>{selectedShirt.color}</span>
                {" · "}
                <span className="capitalize">{STYLES.find(s => s.id === style)?.label}</span>
              </span>
            </div>
            {activeDesign && (
              <button onClick={() => setShowPreview(true)}
                className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-xl transition-all hover:text-orange-400"
                style={{ border: "1px solid rgba(249,115,22,0.18)", color: "#64748b" }}>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                Fullscreen
              </button>
            )}
          </div>

          {/* Quick style + generate bar (desktop) */}
          <div className="hidden lg:flex items-center gap-1.5 px-4 py-2.5 overflow-x-auto"
            style={{ borderBottom: "1px solid rgba(249,115,22,0.06)" }}>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] ragged-subtitle shrink-0 mr-1">Style:</span>
            {STYLES.map((s) => (
              <button key={s.id} onClick={() => setStyle(s.id)}
                className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all"
                style={style === s.id
                  ? { background: "rgba(249,115,22,0.14)", border: "1px solid rgba(249,115,22,0.4)", color: "var(--ragged-accent)" }
                  : { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", color: "#64748b" }}>
                <span>{s.icon}</span> {s.label}
              </button>
            ))}
            {designMode === "ai" && (
              <button onClick={handleGenerate} disabled={loading || !prompt.trim()}
                className="ragged-solid-btn shrink-0 ml-auto flex items-center gap-1.5 px-4 py-1.5 text-[11px] font-black uppercase tracking-wider transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={loading || !prompt.trim() ? { background: "rgba(249,115,22,0.12)", boxShadow: "none", color: "var(--ragged-accent)" } : {}}>
                {loading
                  ? <><span className="w-3 h-3 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" /> Generating</>
                  : <><SparkleIcon /> Generate</>}
              </button>
            )}
          </div>

          {/* Shirt canvas */}
          <div className="flex items-center justify-center px-4 sm:px-8 py-6 sm:py-10"
            style={{
              minHeight: "clamp(280px, 55vw, 520px)",
              background: "radial-gradient(ellipse at 50% 35%, rgba(249,115,22,0.055) 0%, transparent 65%)",
            }}>
            <ShirtMockup
              shirt={selectedShirt} generatedImage={activeDesign} loading={loading}
              designWidth={designWidth} designHeight={designHeight} designX={designX} designY={designY}
              blendMode={blendMode} designOpacity={designOpacity} designRotation={designRotation}
              size={480}
            />
          </div>

          {/* Revised prompt */}
          {revisedPrompt && designMode === "ai" && (
            <div className="mx-5 mb-3 px-3 py-2.5 rounded-xl"
              style={{ background: "rgba(249,115,22,0.04)", border: "1px solid rgba(249,115,22,0.1)" }}>
              <p className="text-[10px] leading-relaxed line-clamp-2 ragged-subtitle" title={revisedPrompt}>
                <span className="font-black" style={{ color: "var(--ragged-accent)" }}>AI interpreted: </span>
                {revisedPrompt}
              </p>
            </div>
          )}

          {/* Transform readout */}
          {activeDesign && (
            <div className="flex items-center justify-center gap-2 sm:gap-3 pb-2 text-[9px] sm:text-[10px] ragged-subtitle flex-wrap px-3 sm:px-4">
              <span>W <span className="font-black" style={{ color: "var(--ragged-accent)" }}>{designWidth}%</span></span>
              <span className="opacity-25">·</span>
              <span>H <span className="font-black" style={{ color: "var(--ragged-accent)" }}>{designHeight}%</span></span>
              <span className="opacity-25">·</span>
              <span>X <span className="font-black" style={{ color: "var(--ragged-accent)" }}>{designX}%</span></span>
              <span className="opacity-25">·</span>
              <span>Y <span className="font-black" style={{ color: "var(--ragged-accent)" }}>{designY}%</span></span>
              {designOpacity < 1 && <><span className="opacity-25">·</span><span>Opacity <span className="font-black" style={{ color: "var(--ragged-accent)" }}>{Math.round(designOpacity * 100)}%</span></span></>}
              {designRotation !== 0 && <><span className="opacity-25">·</span><span>Rot <span className="font-black" style={{ color: "var(--ragged-accent)" }}>{designRotation}°</span></span></>}
            </div>
          )}

          {/* Actions footer */}
          <div className="px-3 sm:px-5 pb-4 sm:pb-5 pt-2" style={{ borderTop: "1px solid rgba(249,115,22,0.08)" }}>
            {activeDesign ? (
              <div className="space-y-2.5">
                <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                  <button onClick={handleDownload}
                    className="py-2.5 sm:py-3 text-[9px] sm:text-[10px] font-bold uppercase tracking-wide sm:tracking-widest transition-all hover:border-orange-400/40 hover:text-orange-300 flex flex-col items-center gap-1 sm:gap-1.5 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", color: "#94a3b8" }}>
                    <DownloadIcon /> Download
                  </button>
                  <button onClick={() => setShowPreview(true)}
                    className="py-2.5 sm:py-3 text-[9px] sm:text-[10px] font-bold uppercase tracking-wide sm:tracking-widest transition-all hover:border-orange-400/40 hover:text-orange-300 flex flex-col items-center gap-1 sm:gap-1.5 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", color: "#94a3b8" }}>
                    <EyeIcon /> Preview
                  </button>
                  {designMode === "ai" ? (
                    <button onClick={handleGenerate} disabled={loading}
                      className="py-2.5 sm:py-3 text-[9px] sm:text-[10px] font-bold uppercase tracking-wide sm:tracking-widest transition-all disabled:opacity-40 flex flex-col items-center gap-1 sm:gap-1.5 rounded-xl"
                      style={{ background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.22)", color: "var(--ragged-accent)" }}>
                      <RefreshIcon /> Redo
                    </button>
                  ) : (
                    <label className="py-2.5 sm:py-3 text-[9px] sm:text-[10px] font-bold uppercase tracking-wide sm:tracking-widest transition-all cursor-pointer flex flex-col items-center gap-1 sm:gap-1.5 rounded-xl"
                      style={{ background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.22)", color: "var(--ragged-accent)" }}>
                      <UploadCloudIcon /> Change
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                  )}
                </div>
                <button onClick={handleOrderCustomShirt}
                  className="ragged-solid-btn w-full py-3.5 sm:py-4 text-xs sm:text-sm font-black uppercase tracking-[0.15em] sm:tracking-[0.18em] transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                  <CartIcon /> Order Custom Shirt · ₹699
                </button>
              </div>
            ) : (
              <div className="text-center py-4 sm:py-5">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
                  style={{ background: "rgba(249,115,22,0.05)", border: "1px solid rgba(249,115,22,0.12)" }}>
                  <span className="text-2xl opacity-35">✦</span>
                </div>
                <p className="ragged-title text-sm sm:text-base mb-1">
                  {designMode === "ai" ? "Awaiting Design" : "No Image Uploaded"}
                </p>
                <p className="text-[10px] sm:text-xs ragged-subtitle">
                  {designMode === "ai"
                    ? "Write your prompt above and click Generate"
                    : "Upload an image to preview it on the shirt"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile sticky bottom generate bar ── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40"
        style={{ background: 'linear-gradient(to top, #0a0a0c 65%, rgba(10,10,12,0))', paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}>
        <div className="px-4 pt-4 pb-2">
          {designMode === "ai" ? (
            <button onClick={handleGenerate} disabled={loading || !prompt.trim()}
              className="ragged-solid-btn w-full py-4 font-black text-sm uppercase tracking-[0.18em] transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] flex items-center justify-center gap-2"
              style={{ color: 'white' }}>
              {loading
                ? <><span className="w-5 h-5 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" /> Generating…</>
                : activeDesign
                  ? <><RefreshIcon /> Regenerate Design</>
                  : <><SparkleIcon /> Generate Design</>}
            </button>
          ) : activeDesign ? (
            <button onClick={handleOrderCustomShirt}
              className="ragged-solid-btn w-full py-4 font-black text-sm uppercase tracking-[0.18em] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              style={{ color: 'white' }}>
              <CartIcon /> Order Custom Shirt · ₹699
            </button>
          ) : (
            <label className="flex items-center justify-center gap-2 w-full py-4 font-black text-sm uppercase tracking-[0.18em] rounded-2xl cursor-pointer"
              style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.3)', color: 'var(--ragged-accent)' }}>
              <UploadCloudIcon /> Upload Your Design
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIDesigner;
