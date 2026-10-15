import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { motion } from "motion/react";
import {
  BookOpen,
  Sun,
  Heart,
  Activity,
  Apple,
  Users,
  Moon,
  ArrowRight,
  Check,
  Camera,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  CalendarDays,
  ChevronRight,
  LogOut,
  Printer,
  Download,
  LayoutDashboard,
  FileText,
  X,
  Play,
  Leaf,
} from "lucide-react";
import Student from "./Student";
import { api, today, classes, readPhoto } from "./api";
import "./style.css";
const habits = [
  {
    name: "Bangun Pagi",
    cover: "bangun-pagi",
    icon: Sun,
    color: "yellow",
    hint: "Jam berapa kamu bangun pagi ini?",
    placeholder: "Contoh: Pukul 05.30 WITA",
  },
  {
    name: "Beribadah",
    cover: "beribadah",
    icon: Heart,
    color: "purple",
    hint: "Beribadah sesuai agama dan kepercayaanmu.",
    placeholder: "Ceritakan kegiatan ibadahmu",
    photo: true,
  },
  {
    name: "Berolahraga",
    cover: "berolahraga",
    icon: Activity,
    color: "orange",
    hint: "Yuk, Senam Vasudhaiva Kutumbakam!",
    placeholder: "Ceritakan kegiatan olahragamu",
    photo: true,
    required: true,
  },
  {
    name: "Makan Sehat dan Bergizi",
    cover: "makan-sehat",
    icon: Apple,
    color: "green",
    hint: "Isi piringmu dengan makanan bergizi.",
    placeholder: "Apa menu makananmu hari ini?",
    photo: true,
    required: true,
  },
  {
    name: "Gemar Belajar",
    cover: "gemar-belajar",
    icon: BookOpen,
    color: "blue",
    hint: "Hal baru apa yang kamu pelajari?",
    placeholder: "Membaca buku, berhitung, atau lainnya",
  },
  {
    name: "Bermasyarakat",
    cover: "bermasyarakat",
    icon: Users,
    color: "pink",
    hint: "Kebaikan kecilmu berarti besar.",
    placeholder: "Membantu keluarga atau menjaga lingkungan",
  },
  {
    name: "Tidur Cepat",
    cover: "tidur-cepat",
    icon: Moon,
    color: "purple",
    hint: "Ceritakan waktu tidurmu tadi malam.",
    placeholder: "Contoh: Tadi malam tidur pukul 20.30",
  },
];
function Illustration() {
  return (
    <svg
      viewBox="0 0 480 330"
      role="img"
      aria-label="Dua anak sekolah merawat kebiasaan baik"
      className="illustration"
    >
      <circle cx="248" cy="166" r="139" fill="#dfeaff" />
      <path
        d="M68 270Q235 240 423 270"
        fill="none"
        stroke="#b6c9ef"
        strokeWidth="3"
      />
      <g fill="#ffcc58">
        <path d="m93 65 6 13 14 2-10 10 3 14-13-7-13 7 3-14-10-10 14-2z" />
        <circle cx="385" cy="101" r="15" />
      </g>
      <g transform="translate(128 65)">
        <path d="M28 95Q-6 103 1 163l33-11" fill="#fff" />
        <path d="M90 96q42 5 49 43l-25 10-28-31" fill="#fff" />
        <path d="m35 140-8 75 34 1 8-60 9 60h34l-18-77" fill="#e84f50" />
        <path d="m27 215-6 15h45v-15m12 0v15h44l-10-15" fill="#263b66" />
        <rect x="29" y="87" width="66" height="64" rx="14" fill="#fff" />
        <path d="m56 89 8 12-7 28 13 10 10-10-9-28 8-12" fill="#df4449" />
        <rect x="33" y="9" width="63" height="80" rx="30" fill="#eab28c" />
        <path
          d="M30 44Q19-5 64 0q44-2 33 48L82 29q-24 15-52 15"
          fill="#283649"
        />
        <circle cx="51" cy="52" r="3" fill="#283649" />
        <circle cx="77" cy="52" r="3" fill="#283649" />
        <path
          d="M55 67q10 10 18 0"
          fill="none"
          stroke="#934e3e"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>
      <g transform="translate(264 85)">
        <path d="M22 33q-11-49 32-47 45-6 47 45l11 71-91 2z" fill="#283649" />
        <path d="m31 115-14 68h91l-19-68" fill="#e84f50" />
        <path d="m35 181-1 35h18l6-35m16 0 3 35h18l-7-35" fill="#eab28c" />
        <path d="m30 211-7 14h35v-14m17 0v14h34l-12-14" fill="#263b66" />
        <rect x="28" y="75" width="66" height="61" rx="17" fill="white" />
        <path d="m49 76 13 16 14-16-7 28H56z" fill="#e84f50" />
        <rect x="32" y="2" width="58" height="73" rx="29" fill="#efba94" />
        <path d="M27 26 39-1q37-24 54 24L65 8 47 29z" fill="#283649" />
        <circle cx="49" cy="38" r="3" fill="#283649" />
        <circle cx="74" cy="38" r="3" fill="#283649" />
        <path
          d="M53 53q9 9 16 0"
          fill="none"
          stroke="#934e3e"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="m29 87-30 31-25-12m119-17 23 34"
          fill="none"
          stroke="#efba94"
          strokeWidth="15"
          strokeLinecap="round"
        />
      </g>
      <g transform="translate(70 184)">
        <rect x="0" y="25" width="46" height="61" rx="10" fill="#e8a75b" />
        <path
          d="M23 33V-7M23 12Q-11 14-7-9q30-2 30 21M23 0q0-27 29-25 2 25-29 25"
          fill="#69ac83"
          stroke="#69ac83"
          strokeWidth="5"
        />
      </g>
      <rect x="338" y="206" width="91" height="44" rx="13" fill="white" />
      <path
        d="m353 228 8 8 16-18"
        fill="none"
        stroke="#3da77e"
        strokeWidth="5"
      />
      <text x="385" y="235" fontSize="19" fontWeight="800" fill="#305b9b">
        7/7
      </text>
    </svg>
  );
}
function App() {
  const route = () =>
    location.hash === "#jurnal-7-kaih" ? "jurnal" : "beranda";
  const [page, setPage] = useState(route);
  useEffect(() => {
    const sync = () => {
      setPage(route());
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);
  const navigate = (target) => {
    setPage(target);
    location.hash =
      target === "guru" ? "guru" : target === "jurnal" ? "jurnal-7-kaih" : "";
    window.scrollTo(0, 0);
  };
  return (
    <>
      <header>
        <a className="brand" href="#" onClick={() => navigate("beranda")}>
          <span className="brand-icon">
            <BookOpen />
          </span>
          <span>
            <b>Sikumpul</b>
            <small>SD NEGERI 3 KESIMAN</small>
          </span>
        </a>
        <nav>
          <button
            className={page !== "guru" ? "active" : ""}
            onClick={() => {
              navigate("beranda");
            }}
          >
            Tugas Hari Ini
          </button>
        </nav>
        <span className="school-tag">
          <span /> Denpasar, Bali
        </span>
      </header>
      {page === "beranda" ? (
        <Home onOpen={() => navigate("jurnal")} />
      ) : page === "jurnal" ? (
        <>
          <div className="journal-back">
            <button className="text-button" onClick={() => navigate("beranda")}>
              ← Kembali ke tugas hari ini
            </button>
          </div>
          <Student habits={habits} Illustration={Illustration} />
        </>
      ) : (
        <Home onOpen={() => navigate("jurnal")} />
      )}
      <footer>
        <div className="brand">
          <BookOpen size={21} /> Sikumpul · SD Negeri 3 Kesiman
        </div>
        <span>Langkah kecil hari ini, masa depan hebat nanti.</span>
        <small>7 Kebiasaan Anak Indonesia Hebat</small>
      </footer>
    </>
  );
}
function Home({ onOpen }) {
  return (
    <main className="home-page">
      <section className="hero home-hero">
        <div className="hero-copy">
          <span className="eyebrow">
            <Sparkles size={15} /> SELAMAT DATANG DI SIKUMPUL
          </span>
          <h1>
            Halo, anak hebat!
            <br />
            <span>Yuk, lihat tugasmu.</span>
          </h1>
          <p>
            Tempat belajar, bercerita, dan mengumpulkan
            <br className="desktop" /> kebiasaan baik bersama SD Negeri 3
            Kesiman.
          </p>
          <span className="hero-note">
            <Heart size={15} /> Siapkan semangatmu untuk belajar hari ini.
          </span>
        </div>
        <div className="hero-art">
          <Illustration />
          <span className="float-label">
            <Sun size={21} /> Jumat penuh semangat!
          </span>
        </div>
      </section>
      <section className="daily-tasks" aria-labelledby="daily-title">
        <div className="section-heading">
          <div>
            <span className="eyebrow">AGENDA BELAJARKU</span>
            <h2 id="daily-title">Tugas hari ini</h2>
            <p>Selesaikan kegiatanmu, lalu kumpulkan dengan jujur, ya.</p>
          </div>
          <span className="date-chip">
            <CalendarDays size={18} />
            <time dateTime="2026-10-16">Jumat, 16 Oktober 2026</time>
            <small>WITA</small>
          </span>
        </div>
        <article className="task-card panel">
          <div className="task-art" aria-hidden="true">
            <span className="icon blue">
              <BookOpen size={36} />
            </span>
            <div className="task-art-icons">
              <Sun size={23} />
              <Heart size={23} />
              <Leaf size={23} />
            </div>
            <span>7 kebiasaan baik</span>
          </div>
          <div className="task-copy">
            <span className="task-label">TUGAS 01 · PEMBIASAAN HARIAN</span>
            <h2>Jurnal 7 KAIH</h2>
            <p>7 Kebiasaan Anak Indonesia Hebat</p>
            <p>
              Ceritakan kegiatan baikmu: bangun pagi, beribadah, berolahraga,
              makan sehat, belajar, bermasyarakat, dan tidur cepat.
            </p>
            <div className="task-meta">
              <span>
                <GraduationCap size={16} /> Kelas I–VI
              </span>
              <span>
                <CalendarDays size={16} /> Jumat, 16 Oktober
              </span>
            </div>
            <button className="primary" onClick={onOpen}>
              Buka Jurnal 7 KAIH <ArrowRight size={19} />
            </button>
          </div>
        </article>
        <div className="home-reminder">
          <Heart size={20} />
          <p>
            Belum melakukan semua kebiasaan? Tidak apa-apa. Setiap usaha kecilmu
            tetap berharga.
          </p>
        </div>
      </section>
    </main>
  );
}
createRoot(document.getElementById("root")).render(<App />);
