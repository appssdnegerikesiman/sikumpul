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
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { api, today, classes, readPhoto } from "./api";
import "./style.css";
const habits = [
  {
    name: "Bangun Pagi",
    icon: Sun,
    color: "yellow",
    hint: "Jam berapa kamu bangun pagi ini?",
    placeholder: "Contoh: Pukul 05.30 WITA",
  },
  {
    name: "Beribadah",
    icon: Heart,
    color: "purple",
    hint: "Beribadah sesuai agama dan kepercayaanmu.",
    placeholder: "Ceritakan kegiatan ibadahmu",
    photo: true,
  },
  {
    name: "Berolahraga",
    icon: Activity,
    color: "orange",
    hint: "Yuk, Senam Vasudhaiva Kutumbakam!",
    placeholder: "Ceritakan kegiatan olahragamu",
    photo: true,
    required: true,
  },
  {
    name: "Makan Sehat dan Bergizi",
    icon: Apple,
    color: "green",
    hint: "Isi piringmu dengan makanan bergizi.",
    placeholder: "Apa menu makananmu hari ini?",
    photo: true,
    required: true,
  },
  {
    name: "Gemar Belajar",
    icon: BookOpen,
    color: "blue",
    hint: "Hal baru apa yang kamu pelajari?",
    placeholder: "Membaca buku, berhitung, atau lainnya",
  },
  {
    name: "Bermasyarakat",
    icon: Users,
    color: "pink",
    hint: "Kebaikan kecilmu berarti besar.",
    placeholder: "Membantu keluarga atau menjaga lingkungan",
  },
  {
    name: "Tidur Cepat",
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
  const route = () => location.hash === "#guru" ? "guru" : location.hash === "#jurnal-7-kaih" ? "jurnal" : "beranda";
  const [page, setPage] = useState(route);
  useEffect(() => {
    const sync = () => { setPage(route()); window.scrollTo(0, 0); };
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);
  const navigate = (target) => {
    setPage(target);
    location.hash = target === "guru" ? "guru" : target === "jurnal" ? "jurnal-7-kaih" : "";
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
          <button
            className={page === "guru" ? "active" : ""}
            onClick={() => {
              navigate("guru");
            }}
          >
            <ShieldCheck size={16} /> Ruang Guru
          </button>
        </nav>
        <span className="school-tag">
          <span /> Denpasar, Bali
        </span>
      </header>
      {page === "beranda" ? <Home onOpen={() => navigate("jurnal")} /> : page === "jurnal" ? <><div className="journal-back"><button className="text-button" onClick={() => navigate("beranda")}>← Kembali ke tugas hari ini</button></div><Student /></> : <Teacher />}
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
  return <main className="home-page">
    <section className="hero home-hero">
      <div className="hero-copy">
        <span className="eyebrow"><Sparkles size={15} /> SELAMAT DATANG DI SIKUMPUL</span>
        <h1>Halo, anak hebat!<br /><span>Yuk, lihat tugasmu.</span></h1>
        <p>Tempat belajar, bercerita, dan mengumpulkan<br className="desktop" /> kebiasaan baik bersama SD Negeri 3 Kesiman.</p>
        <span className="hero-note"><Heart size={15} /> Siapkan semangatmu untuk belajar hari ini.</span>
      </div>
      <div className="hero-art"><Illustration /><span className="float-label"><Sun size={21} /> Jumat penuh semangat!</span></div>
    </section>
    <section className="daily-tasks" aria-labelledby="daily-title">
      <div className="section-heading"><div><span className="eyebrow">AGENDA BELAJARKU</span><h2 id="daily-title">Tugas hari ini</h2><p>Selesaikan kegiatanmu, lalu kumpulkan dengan jujur, ya.</p></div><span className="date-chip"><CalendarDays size={18} /><time dateTime="2026-10-16">Jumat, 16 Oktober 2026</time><small>WITA</small></span></div>
      <article className="task-card panel">
        <div className="task-art" aria-hidden="true"><span className="icon blue"><BookOpen size={36} /></span><div className="task-art-icons"><Sun size={23} /><Heart size={23} /><Leaf size={23} /></div><span>7 kebiasaan baik</span></div>
        <div className="task-copy"><span className="task-label">TUGAS 01 · PEMBIASAAN HARIAN</span><h2>Jurnal 7 KAIH</h2><p>7 Kebiasaan Anak Indonesia Hebat</p><p>Ceritakan kegiatan baikmu: bangun pagi, beribadah, berolahraga, makan sehat, belajar, bermasyarakat, dan tidur cepat.</p><div className="task-meta"><span><GraduationCap size={16} /> Kelas I–VI</span><span><CalendarDays size={16} /> Jumat, 16 Oktober</span></div><button className="primary" onClick={onOpen}>Buka Jurnal 7 KAIH <ArrowRight size={19} /></button></div>
      </article>
      <div className="home-reminder"><Heart size={20} /><p>Belum melakukan semua kebiasaan? Tidak apa-apa. Setiap usaha kecilmu tetap berharga.</p></div>
    </section>
  </main>;
}
function Student() {
  const [started, start] = useState(false),
    [identity, setIdentity] = useState({
      kelas: "",
      absen: "",
      nama: "",
      tanggal: today(),
    }),
    [answers, setAnswers] = useState(
      habits.map(() => ({ status: "", note: "", photo: null })),
    ),
    [consent, setConsent] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [saved, setSaved] = useState(null);
  const form = useRef(null);
  const done = answers.filter((a) => a.status === "Sudah").length;
  const answered = answers.filter((a) => a.status).length;
  const update = (i, key, value) =>
    setAnswers((a) => a.map((x, n) => (n === i ? { ...x, [key]: value } : x)));
  async function submit(e) {
    e.preventDefault();
    if (busy) return;
    setError("");
    if (answered !== 7) {
      setError("Pilih Sudah atau Belum untuk ketujuh kebiasaan, ya.");
      return;
    }
    setBusy(true);
    try {
      const result = await api("submitJournal", {
        ...identity,
        consent,
        answers,
      });
      setSaved(result);
      form.current?.scrollIntoView({ behavior: "smooth" });
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">
            <Sparkles size={15} /> 7 KEBIASAAN ANAK INDONESIA HEBAT
          </span>
          <h1>
            Jurnal 7 KAIH.
            <br />
            <span>
              Kebiasaan kecil,
              <br />
              masa depan hebat.
            </span>
          </h1>
          <p>
            Selamat datang di <strong>Jurnal 7 KAIH!</strong> Yuk, ceritakan
            <br className="desktop" /> kebiasaan baikmu hari ini. Sedikit demi
            sedikit,
            <br className="desktop" /> kita tumbuh menjadi anak Indonesia hebat.
          </p>
          <button
            className="primary"
            onClick={() => {
              start(true);
              setTimeout(
                () => form.current?.scrollIntoView({ behavior: "smooth" }),
                50,
              );
            }}
          >
            Mulai Jurnalku <ArrowRight size={19} />
          </button>
          <span className="hero-note">
            <Heart size={15} /> Isi dengan jujur, setiap prosesmu berharga.
          </span>
        </div>
        <div className="hero-art">
          <Illustration />
          <span className="float-label">
            <Sun size={21} /> Semangat hari ini!
          </span>
          <span className="float-badge">
            <Sparkles size={18} /> Aku anak Indonesia hebat
          </span>
        </div>
      </section>
      <div className="habit-ribbon">
        {habits.map((h, i) => (
          <div key={h.name}>
            <span className={`icon ${h.color}`}>
              <h.icon size={22} />
            </span>
            <span>
              {i + 1}. {h.name}
            </span>
          </div>
        ))}
      </div>
      <section className="journal" ref={form}>
        <div className="section-heading">
          <div>
            <span className="eyebrow">JURNAL HARIANKU</span>
            <h2>
              Hari baru, semangat baru <Sun className="sun-inline" />
            </h2>
            <p>Tujuh kebiasaan kecil untuk menjadi versi terbaik dirimu.</p>
          </div>
          <span className="date-chip">
            <CalendarDays size={18} />
            {new Date(identity.tanggal + "T12:00:00+08:00").toLocaleDateString(
              "id-ID",
              {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
                timeZone: "Asia/Makassar",
              },
            )}
            <small>WITA</small>
          </span>
        </div>
        {saved ? (
          <div className="success" role="status">
            <span className="icon green">
              <Check />
            </span>
            <h2>Jurnalmu berhasil disimpan!</h2>
            <p>
              Terima kasih sudah bercerita dengan jujur. Sampai besok, anak
              hebat!
            </p>
            <p>
              {saved.updated
                ? "Jurnal hari ini diperbarui."
                : "Jurnal hari ini telah diterima sekolah."}
            </p>
            <button className="primary" onClick={() => setSaved(null)}>
              Perbarui jurnal hari ini
            </button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <div className="identity panel">
              <div className="panel-title">
                <span className="icon blue">
                  <GraduationCap />
                </span>
                <div>
                  <h3>Kenalan dulu, yuk!</h3>
                  <p>Pastikan identitasmu sudah benar, ya.</p>
                </div>
                <span className="step">LANGKAH 01</span>
              </div>
              <div className="identity-fields">
                <label>
                  Kelasmu
                  <select
                    required
                    value={identity.kelas}
                    onChange={(e) => {
                      start(true);
                      setIdentity({ ...identity, kelas: e.target.value });
                    }}
                  >
                    <option value="">Pilih kelas</option>
                    {classes.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Nomor absen
                  <select
                    required
                    disabled={!identity.kelas}
                    value={identity.absen}
                    onChange={(e) =>
                      setIdentity({ ...identity, absen: e.target.value })
                    }
                  >
                    <option value="">Pilih absen</option>
                    {Array.from({ length: 38 }, (_, i) => (
                      <option key={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                </label>
                <label className="name-field">
                  Nama lengkap
                  <input
                    required
                    minLength={2}
                    maxLength={100}
                    disabled={!identity.absen}
                    placeholder="Ketik nama lengkapmu"
                    value={identity.nama}
                    onChange={(e) =>
                      setIdentity({ ...identity, nama: e.target.value })
                    }
                  />
                </label>
              </div>
            </div>
            <div className="journal-columns">
              <div className="cards">
                <div className="cards-heading">
                  <h3>Kebiasaan baikku hari ini</h3>
                  <span>{answered} dari 7 terisi</span>
                </div>
                {habits.map((h, i) => (
                  <motion.article
                    key={h.name}
                    className={`habit-card panel ${answers[i].status === "Sudah" ? "completed" : ""}`}
                    animate={{
                      scale: answers[i].status === "Sudah" ? 1.005 : 1,
                    }}
                  >
                    <div className="habit-top">
                      <span className={`icon ${h.color}`}>
                        <h.icon size={25} />
                      </span>
                      <div>
                        <small>KEBIASAAN {i + 1}</small>
                        <h3>{h.name}</h3>
                      </div>
                      {answers[i].status === "Sudah" && (
                        <span className="checkmark">
                          <Check size={17} />
                        </span>
                      )}
                    </div>
                    <p>{h.hint}</p>
                    {i === 2 && (
                      <a
                        className="video-link"
                        href="https://www.youtube.com/watch?v=mSXOa-qFvSM"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Play size={15} /> Tonton Video Senam{" "}
                        <ChevronRight size={15} />
                      </a>
                    )}
                    <div
                      className="status-options"
                      role="group"
                      aria-label={`Status ${h.name}`}
                    >
                      {["Sudah", "Belum"].map((s) => (
                        <button
                          key={s}
                          type="button"
                          aria-pressed={answers[i].status === s}
                          className={
                            answers[i].status === s
                              ? s === "Sudah"
                                ? "yes selected"
                                : "no selected"
                              : ""
                          }
                          onClick={() => {
                            update(i, "status", s);
                            if (s === "Belum") update(i, "photo", null);
                          }}
                        >
                          {s === "Sudah" ? (
                            <Check size={17} />
                          ) : (
                            <span className="option-circle" />
                          )}
                          {s === "Sudah"
                            ? "Sudah dilakukan"
                            : "Belum dilakukan"}
                        </button>
                      ))}
                    </div>
                    {answers[i].status && (
                      <div className="habit-extra">
                        <label className="sr-only" htmlFor={`note-${i}`}>
                          Keterangan {h.name}
                        </label>
                        <input
                          id={`note-${i}`}
                          maxLength={500}
                          placeholder={
                            answers[i].status === "Belum"
                              ? "Tidak apa-apa, ceritakan jika kamu mau"
                              : h.placeholder
                          }
                          value={answers[i].note}
                          onChange={(e) => update(i, "note", e.target.value)}
                        />
                        {h.photo && answers[i].status === "Sudah" && (
                          <label className="upload">
                            <Camera size={20} />
                            <span>
                              {answers[i].photo
                                ? "Foto sudah dipilih ✓"
                                : `Tambahkan foto ${h.required ? "kegiatan" : "(opsional)"}`}
                              <small>
                                JPG, PNG, WebP · Maks. 1,5 MB
                                {!h.required
                                  ? " · Foto ibadah tidak wajib"
                                  : ""}
                              </small>
                            </span>
                            <input
                              aria-label={`Foto ${h.name}`}
                              type="file"
                              accept="image/jpeg,image/png,image/webp"
                              required={h.required && !answers[i].photo}
                              onChange={async (e) => {
                                try {
                                  if (e.target.files[0])
                                    update(
                                      i,
                                      "photo",
                                      await readPhoto(e.target.files[0]),
                                    );
                                } catch (err) {
                                  setError(err.message);
                                  e.target.value = "";
                                }
                              }}
                            />
                          </label>
                        )}
                      </div>
                    )}
                  </motion.article>
                ))}
              </div>
              <aside>
                <div className="progress-card panel">
                  <span className="icon yellow">
                    <Sparkles />
                  </span>
                  <h3>Langkah hebatmu</h3>
                  <p>
                    Setiap kebiasaan baik adalah
                    <br />
                    satu langkah untuk masa depan.
                  </p>
                  <div className="progress-number">
                    {done}
                    <span>/ 7</span>
                  </div>
                  <div
                    className="progress-track"
                    role="progressbar"
                    aria-label="Kebiasaan terlaksana"
                    aria-valuemin={0}
                    aria-valuemax={7}
                    aria-valuenow={done}
                  >
                    <span style={{ width: `${(done / 7) * 100}%` }} />
                  </div>
                  <p className="small">kebiasaan sudah dilakukan</p>
                  <div className="mini-habits">
                    {habits.map((h, i) => (
                      <span
                        key={i}
                        className={
                          answers[i].status === "Sudah" ? "mini done" : "mini"
                        }
                        title={h.name}
                      >
                        <h.icon size={17} />
                      </span>
                    ))}
                  </div>
                  <div className="encouragement">
                    <Leaf size={19} />
                    <span>
                      {done === 7
                        ? "Hebat! Terus rawat kebiasaan baikmu."
                        : "Tidak harus sempurna. Yang penting, terus mencoba!"}
                    </span>
                  </div>
                </div>
                <div className="tip">
                  <Heart size={21} />
                  <h4>Jujur itu hebat!</h4>
                  <p>
                    Belum melakukan semuanya? Tidak apa-apa. Jawab sesuai
                    kegiatanmu, ya.
                  </p>
                </div>
                <div className="privacy">
                  <ShieldCheck size={19} />
                  <p>
                    Jurnal dan fotomu hanya dapat dilihat oleh guru yang
                    berwenang.
                  </p>
                </div>
              </aside>
            </div>
            <div className="submit-panel panel">
              <label className="consent">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                />{" "}
                Saya dan orang tua mengizinkan foto pilihan digunakan dalam
                laporan internal sekolah. (Opsional)
              </label>
              <p className="small">
                Tidur cepat diisi berdasarkan tadi malam. Foto hanya diminta
                untuk olahraga dan makan sehat yang sudah dilakukan.
              </p>
              {error && (
                <p className="error" role="alert">
                  {error}
                </p>
              )}
              <div className="submit-row">
                <span>
                  <ShieldCheck size={18} /> Periksa kembali sebelum dikirim.
                </span>
                <button className="primary" disabled={busy} type="submit">
                  {busy ? "Menyimpan jurnal…" : "Kirim Jurnalku"}
                  <ArrowRight size={19} />
                </button>
              </div>
            </div>
          </form>
        )}
      </section>
    </main>
  );
}
function Teacher() {
  const [token, setToken] = useState(""),
    [data, setData] = useState(null),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(false),
    [filter, setFilter] = useState({ from: today(), to: today(), kelas: "" }),
    [tab, setTab] = useState("dashboard"),
    [detail, setDetail] = useState(null),
    [photos, setPhotos] = useState([]),
    [selected, setSelected] = useState([]),
    [settings, setSettings] = useState({
      kepala: "Desak Nyoman Sari",
      gelar: "",
      nip: "",
      alamat: "",
    });
  const login = useRef(null);
  useEffect(() => {
    if (token) return;
    const client = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!client) return;
    let disposed = false;
    const init = () => {
      if (disposed) return;
      window.google.accounts.id.initialize({
        client_id: client,
        callback: (r) => setToken(r.credential),
      });
      window.google.accounts.id.renderButton(login.current, {
        theme: "outline",
        size: "large",
        text: "signin_with",
      });
    };
    if (window.google?.accounts) init();
    else {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.onload = init;
      document.head.appendChild(script);
    }
    return () => {
      disposed = true;
    };
  }, [token]);
  async function load() {
    setData(null);
    setLoading(true);
    setError("");
    try {
      setData(await api("adminSummary", filter, token));
      setSelected([]);
      setPhotos([]);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    if (token) load();
  }, [token]);
  async function openDetail(row) {
    try {
      setDetail(await api("adminDetail", { id: row.id }, token));
    } catch (e) {
      setError(e.message);
    }
  }
  async function choosePhoto(p) {
    try {
      if (selected.includes(p.id)) {
        setSelected(selected.filter((x) => x !== p.id));
        return;
      }
      if (selected.length >= 4)
        throw new Error("Pilih maksimal empat foto untuk laporan.");
      const image = await api("adminPhoto", { id: p.id }, token);
      setPhotos((v) => [
        ...v.filter((x) => x.id !== p.id),
        { ...p, src: image.src },
      ]);
      setSelected((v) => [...v, p.id]);
    } catch (e) {
      setError(e.message);
    }
  }
  if (!token)
    return (
      <main className="login panel">
        <span className="icon blue">
          <ShieldCheck size={28} />
        </span>
        <span className="eyebrow">RUANG GURU</span>
        <h1>
          Ruang untuk
          <br />
          <span>menumbuhkan potensi.</span>
        </h1>
        <p>
          Masuk dengan akun Google guru yang telah
          <br />
          didaftarkan oleh pengelola sekolah.
        </p>
        <div ref={login} />
        {!import.meta.env.VITE_GOOGLE_CLIENT_ID && (
          <p className="notice">
            Login belum dikonfigurasi. Ikuti panduan pemasangan OAuth pada
            README proyek.
          </p>
        )}
        <div className="privacy">
          <ShieldCheck size={17} /> Akses diverifikasi oleh server.
        </div>
      </main>
    );
  const chart = (data?.habits || []).map((h, i) => ({
    ...h,
    name: habits[i].name,
  }));
  return (
    <main className="admin">
      <div className="section-heading">
        <div>
          <span className="eyebrow">RUANG GURU · 7 KAIH</span>
          <h1>Pantau kebiasaan, tumbuhkan karakter.</h1>
          <p>Ringkasan kegiatan siswa SD Negeri 3 Kesiman.</p>
        </div>
        <button
          className="secondary"
          onClick={() => {
            setToken("");
            setData(null);
            setDetail(null);
            setPhotos([]);
          }}
        >
          <LogOut size={17} /> Keluar
        </button>
      </div>
      <div className="admin-tabs">
        {[
          ["dashboard", "Dashboard", LayoutDashboard],
          ["rekap", "Rekap Per Kelas", Users],
          ["laporan", "Laporan Sekolah", FileText],
        ].map(([id, label, Icon]) => (
          <button
            className={tab === id ? "active" : ""}
            key={id}
            onClick={() => setTab(id)}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </div>
      <form
        className="filters panel"
        onSubmit={(e) => {
          e.preventDefault();
          load();
        }}
      >
        <label>
          Dari tanggal
          <input
            type="date"
            required
            value={filter.from}
            onChange={(e) => setFilter({ ...filter, from: e.target.value })}
          />
        </label>
        <label>
          Sampai tanggal
          <input
            type="date"
            required
            min={filter.from}
            value={filter.to}
            onChange={(e) => setFilter({ ...filter, to: e.target.value })}
          />
        </label>
        <label>
          Kelas
          <select
            value={filter.kelas}
            onChange={(e) => setFilter({ ...filter, kelas: e.target.value })}
          >
            <option value="">Seluruh sekolah</option>
            {classes.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <button disabled={loading} className="primary">
          {loading ? "Memuat…" : "Tampilkan"}
        </button>
      </form>
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
      {loading && <p role="status">Memuat data dari sekolah…</p>}
      {data && !loading && (
        <>
          <div className="stats">
            {[
              ["Siswa aktif", data.total],
              ["Jurnal terkumpul", data.submitted],
              ["Belum ada jurnal", data.missing],
              ["Partisipasi", `${data.percent}%`],
            ].map(([label, value]) => (
              <div className="panel" key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
          <p className="small">
            {data.days} hari kalender · partisipasi berdasarkan kesempatan siswa
            per hari, termasuk akhir pekan dalam rentang yang dipilih.
          </p>
          {tab === "dashboard" && (
            <>
              <div className="panel chart">
                <h3>Pelaksanaan tujuh kebiasaan</h3>
                <p>Sudah, Belum, dan Belum ada jurnal dihitung terpisah.</p>
                <ResponsiveContainer width="100%" height={310}>
                  <BarChart data={chart}>
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 10 }}
                      interval={0}
                    />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="sudah"
                      name="Sudah"
                      fill="#3775e9"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar dataKey="belum" name="Belum" fill="#f3b84d" />
                    <Bar
                      dataKey="missing"
                      name="Belum ada jurnal"
                      fill="#d9e2f0"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="panel table-wrap">
                <h3>Jurnal siswa</h3>
                {data.rows.length === 0 ? (
                  <p>Belum ada jurnal pada periode ini.</p>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        {[
                          "Tanggal",
                          "Kelas",
                          "Absen",
                          "Nama",
                          "Status",
                          "Kebiasaan",
                          "Detail",
                        ].map((x) => (
                          <th key={x}>{x}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.rows.map((r) => (
                        <tr key={r.id}>
                          <td>{r.tanggal}</td>
                          <td>{r.kelas}</td>
                          <td>{r.absen}</td>
                          <td>{r.nama}</td>
                          <td>
                            <span className="pill">Terkumpul</span>
                          </td>
                          <td>{r.count}/7</td>
                          <td>
                            <button
                              className="text-button"
                              onClick={() => openDetail(r)}
                            >
                              Lihat detail
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}
          {tab === "rekap" && (
            <>
              <ClassTable data={data} />
              <div className="panel table-wrap">
                <h3>Siswa belum mengisi</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Tanggal</th>
                      <th>Kelas</th>
                      <th>Absen</th>
                      <th>Nama</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.absent.map((r) => (
                      <tr key={`${r.tanggal}-${r.kelas}-${r.absen}`}>
                        <td>{r.tanggal}</td>
                        <td>{r.kelas}</td>
                        <td>{r.absen}</td>
                        <td>{r.nama}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!data.absent.length && (
                  <p>Tidak ada siswa yang belum mengisi pada periode ini.</p>
                )}
              </div>
            </>
          )}
          {tab === "laporan" && (
            <>
              <div className="panel report-controls">
                <h3>Siapkan laporan sekolah</h3>
                <div className="identity-fields">
                  {Object.entries(settings).map(([k, v]) => (
                    <label key={k}>
                      {
                        {
                          kepala: "Kepala sekolah",
                          gelar: "Gelar (opsional)",
                          nip: "NIP (opsional)",
                          alamat: "Alamat sekolah (opsional)",
                        }[k]
                      }
                      <input
                        value={v}
                        onChange={(e) =>
                          setSettings({ ...settings, [k]: e.target.value })
                        }
                      />
                    </label>
                  ))}
                </div>
                <h4>Dokumentasi pilihan</h4>
                <p>
                  Hanya foto dengan izin dokumentasi yang dapat dipilih.
                  Maksimal 4 foto.
                </p>
                <div className="photo-options">
                  {data.documentation.map((p) => (
                    <button
                      className={
                        selected.includes(p.id)
                          ? "selected secondary"
                          : "secondary"
                      }
                      key={p.id}
                      onClick={() => choosePhoto(p)}
                    >
                      {selected.includes(p.id) ? (
                        <Check size={15} />
                      ) : (
                        <Camera size={15} />
                      )}{" "}
                      {p.tanggal} · {p.kelas} · {p.kind}
                    </button>
                  ))}
                </div>
                {!data.documentation.length && (
                  <p className="small">Belum ada dokumentasi berizin.</p>
                )}
                <div className="report-actions">
                  <button
                    className="secondary"
                    onClick={() =>
                      document
                        .getElementById("report")
                        .scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    <FileText size={17} /> Preview Laporan
                  </button>
                  <button className="primary" onClick={() => window.print()}>
                    <Printer size={17} /> Cetak PDF
                  </button>
                  <button
                    className="secondary"
                    onClick={() => downloadCsv(data)}
                  >
                    <Download size={17} /> Ekspor CSV
                  </button>
                </div>
              </div>
              <Report
                data={data}
                settings={settings}
                chart={chart}
                photos={photos.filter((p) => selected.includes(p.id))}
              />
            </>
          )}
        </>
      )}
      {detail && (
        <div className="modal-backdrop">
          <section
            className="modal panel"
            role="dialog"
            aria-modal="true"
            aria-label="Detail jurnal"
          >
            <button
              autoFocus
              className="close secondary"
              onClick={() => setDetail(null)}
              aria-label="Tutup detail"
            >
              <X />
            </button>
            <h2>{detail.nama}</h2>
            <p>
              {detail.tanggal} · {detail.kelas} · Absen {detail.absen}
            </p>
            {detail.answers.map((a, i) => (
              <div className="detail-row" key={i}>
                <strong>
                  {habits[i].name} — {a.status}
                </strong>
                <p>{a.note || "Tanpa keterangan"}</p>
              </div>
            ))}
            {detail.photos.map((p) => (
              <PrivatePhoto key={p.id} photo={p} token={token} />
            ))}
          </section>
        </div>
      )}
    </main>
  );
}
function PrivatePhoto({ photo, token }) {
  const [src, setSrc] = useState(""),
    [error, setError] = useState("");
  return (
    <div>
      <button
        className="secondary"
        onClick={async () => {
          try {
            setSrc((await api("adminPhoto", { id: photo.id }, token)).src);
          } catch (e) {
            setError(e.message);
          }
        }}
      >
        Lihat foto {photo.kind}
      </button>
      {src && (
        <img
          className="private-photo"
          src={src}
          alt={`Dokumentasi ${photo.kind}`}
        />
      )}
      <p>{error}</p>
    </div>
  );
}
function ClassTable({ data }) {
  return (
    <div className="panel table-wrap">
      <h3>Rekap partisipasi per kelas</h3>
      <table>
        <thead>
          <tr>
            <th>Kelas</th>
            <th>Siswa aktif</th>
            <th>Sudah mengisi</th>
            <th>Belum mengisi</th>
            <th>Partisipasi</th>
            {habits.map((h, i) => (
              <th key={i} title={h.name}>
                K{i + 1}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.classes.map((c) => (
            <tr key={c.kelas}>
              <td>
                <strong>{c.kelas}</strong>
              </td>
              <td>{c.total}</td>
              <td>{c.submitted}</td>
              <td>{c.missing}</td>
              <td>{c.percent}%</td>
              {c.habits.map((v, i) => (
                <td key={i}>{v}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="small">
        K1–K7 mengikuti urutan tujuh kebiasaan. Angka kebiasaan menunjukkan
        jawaban Sudah.
      </p>
    </div>
  );
}
function Report({ data, settings, chart, photos }) {
  return (
    <article id="report" className="report panel">
      <div className="letterhead">
        <GraduationCap size={42} />
        <h2>SD NEGERI 3 KESIMAN</h2>
        <p>Denpasar, Bali{settings.alamat && ` · ${settings.alamat}`}</p>
      </div>
      <h2 className="report-title">LAPORAN PELAKSANAAN 7 KAIH</h2>
      <p className="center">
        7 Kebiasaan Anak Indonesia Hebat
        <br />
        {data.from} s.d. {data.to} · {data.kelas || "Seluruh sekolah"}
      </p>
      <h3>1. Tujuan kegiatan</h3>
      <p>
        Menumbuhkan karakter siswa melalui pembiasaan bangun pagi, beribadah,
        berolahraga, makan sehat dan bergizi, gemar belajar, bermasyarakat,
        serta tidur cepat selama pembelajaran daring.
      </p>
      <h3>2. Ringkasan pelaksanaan</h3>
      <p>
        Dari {data.total} siswa aktif selama {data.days} hari, tercatat{" "}
        {data.submitted} jurnal dari {data.opportunities} kesempatan pengisian.
        Partisipasi mencapai {data.percent}%. Terdapat {data.missing} kesempatan
        pengisian yang belum memiliki jurnal.
      </p>
      <ClassTable data={data} />
      <h3>3. Penerapan tujuh kebiasaan</h3>
      <div className="print-bars">
        {chart.map((h) => (
          <div key={h.name}>
            <span>{h.name}</span>
            <div>
              <i
                style={{
                  width: `${data.opportunities ? (h.sudah / data.opportunities) * 100 : 0}%`,
                }}
              />
            </div>
            <b>
              {h.sudah} Sudah · {h.belum} Belum · {h.missing} tanpa jurnal
            </b>
          </div>
        ))}
      </div>
      <h3>4. Analisis dan tindak lanjut</h3>
      <p>
        {data.submitted
          ? `Partisipasi tercatat ${data.percent}%. Guru perlu menindaklanjuti ${data.missing} kesempatan pengisian yang belum tercatat, serta memberi pendampingan pada kebiasaan yang masih dijawab Belum.`
          : "Belum ada jurnal pada periode ini. Belum tersedia data yang cukup untuk menyimpulkan keterlaksanaan kebiasaan."}{" "}
        Ketiadaan jurnal tidak dihitung sebagai jawaban Belum. Hasil ini
        berdasarkan laporan mandiri siswa.
      </p>
      <h3>5. Dokumentasi pilihan</h3>
      {photos.length ? (
        <div className="report-photos">
          {photos.map((p) => (
            <figure key={p.id}>
              <img src={p.src} alt={p.kind} />
              <figcaption>
                {p.kind} · {p.kelas} · {p.tanggal}
              </figcaption>
            </figure>
          ))}
        </div>
      ) : (
        <p>Tidak ada foto yang dipilih untuk laporan ini.</p>
      )}
      <h3>6. Kesimpulan</h3>
      <p>
        Pembiasaan 7 KAIH dilanjutkan dengan pendampingan guru dan orang tua,
        penguatan perilaku positif, serta evaluasi rutin berdasarkan jurnal yang
        masuk.
      </p>
      <div className="signature">
        Denpasar, {today()}
        <br />
        Kepala SD Negeri 3 Kesiman
        <div />
        <strong>
          {settings.kepala}
          {settings.gelar && `, ${settings.gelar}`}
        </strong>
        {settings.nip && <p>NIP {settings.nip}</p>}
      </div>
    </article>
  );
}
function downloadCsv(data) {
  const rows = [
    ["Tanggal", "Kelas", "Absen", "Nama", "Status", "Jumlah Sudah"],
    ...data.rows.map((r) => [
      r.tanggal,
      r.kelas,
      r.absen,
      r.nama,
      "Terkumpul",
      r.count,
    ]),
    ...data.absent.map((r) => [
      r.tanggal,
      r.kelas,
      r.absen,
      r.nama,
      "Belum ada jurnal",
      "",
    ]),
  ];
  const safe = (x) =>
    '"' +
    String(x ?? "")
      .replace(/^[=+@-]/, "'$&")
      .replaceAll('"', '""') +
    '"';
  const url = URL.createObjectURL(
    new Blob(["\ufeff" + rows.map((r) => r.map(safe).join(";")).join("\r\n")], {
      type: "text/csv;charset=utf-8",
    }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = `laporan-7kaih-${data.from}.csv`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
createRoot(document.getElementById("root")).render(<App />);
