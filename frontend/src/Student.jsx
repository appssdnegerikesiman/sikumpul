import React, { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Camera,
  Check,
  GraduationCap,
  Heart,
  Leaf,
  Play,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { api, classes, today, readPhoto } from "./api";

const emptyAnswers = () =>
  Array.from({ length: 7 }, () => ({
    status: "",
    note: "",
    photo: null,
    photoStored: false,
    saved: false,
  }));
export default function Student({ habits, Illustration }) {
  const [identity, setIdentity] = useState({
    kelas: "",
    absen: "",
    nama: "",
    tanggal: today(),
  });
  const [answers, setAnswers] = useState(emptyAnswers),
    [consent, setConsent] = useState(false),
    [busy, setBusy] = useState(null),
    [error, setError] = useState(""),
    [message, setMessage] = useState("");
  const [savedConsent, setSavedConsent] = useState(false);
  const identityRef = useRef(null),
    saving = useRef(false);
  const done = answers.filter((a) => a.status === "Sudah").length,
    savedCount = answers.filter((a) => a.saved).length;
  const hasUnsaved = answers.some(a => !a.saved && (a.status || a.note || a.photo)) || consent !== savedConsent;
  const confirmDiscard = () => !hasUnsaved || window.confirm('Masih ada isian atau izin foto yang belum disimpan. Pilih Batal untuk menyimpan dahulu, atau OK untuk meninggalkan perubahan ini.');
  useEffect(() => {
    if (!hasUnsaved) return;
    const warn = e => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [hasUnsaved]);
  const resetChild = () => {
    setAnswers(emptyAnswers());
    setConsent(false);
    setSavedConsent(false);
    setMessage('');
    setError('');
  };
  const switchChild = () => {
    if (saving.current || !confirmDiscard()) return;
    setIdentity({kelas:'',absen:'',nama:'',tanggal:today()});
    resetChild();
    identityRef.current?.scrollIntoView({behavior:'smooth'});
    requestAnimationFrame(() => identityRef.current?.querySelector('select')?.focus());
  };
  const changeIdentity = (key, value) => {
    if (saving.current || identity[key] === value) return;
    if (key !== 'nama' && !confirmDiscard()) return;
    setIdentity((v) => ({
      ...v,
      [key]: value,
      ...(key === "kelas"
        ? { absen: "", nama: "" }
        : key === "absen"
          ? { nama: "" }
          : {}),
    }));
    if (key !== "nama") {
      resetChild();
    }
  };
  const update = (i, key, value) =>
    setAnswers((v) =>
      v.map((a, n) =>
        n === i
          ? {
              ...a,
              [key]: value,
              ...(key === "photoError" ? {} : { saved: false }),
            }
          : a,
      ),
    );
  async function resume() {
    if (saving.current) return;
    if (!identity.kelas || !identity.absen) {
      setError("Pilih kelas dan nomor absen terlebih dahulu.");
      return;
    }
    if (!confirmDiscard()) return;
    saving.current = true;
    setBusy("resume");
    setError("");
    setMessage("");
    try {
      const r = await api("resumeJournal", identity);
      if (r.exists) {
        setIdentity((v) => ({ ...v, nama: r.nama }));
        setAnswers(r.answers.map((a) => ({ ...a, saved: !!a.status })));
        setConsent(r.consent === true);
        setSavedConsent(r.consent === true);
        setMessage(
          `Jurnal dibuka kembali. ${r.answered} dari 7 kebiasaan sudah tersimpan.`,
        );
      } else {
        resetChild();
        setMessage(
          "Belum ada jurnal hari ini. Isi nama anak, lalu simpan kebiasaan pertamamu.",
        );
      }
    } catch (e) {
      setError(e.message);
    } finally {
      saving.current = false;
      setBusy(null);
    }
  }
  useEffect(() => {
    if (!identity.kelas || !identity.absen) return;
    setMessage(
      "Sudah pernah mengisi hari ini? Tekan Buka jurnal tersimpan untuk melanjutkan dari browser ini.",
    );
  }, [identity.kelas, identity.absen]);
  async function save(indices) {
    if (saving.current) return;
    setError("");
    setMessage("");
    if (!identity.kelas || !identity.absen || identity.nama.trim().length < 2) {
      setError("Lengkapi kelas, absen, dan nama lengkap anak terlebih dahulu.");
      identityRef.current?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    const selected = indices.filter((i) => answers[i].status);
    if (!selected.length) {
      setError("Pilih Sudah atau Belum pada kebiasaan yang ingin disimpan.");
      return;
    }
    for (const i of selected)
      if (
        habits[i].required &&
        answers[i].status === "Sudah" &&
        !answers[i].photo &&
        !answers[i].photoStored
      ) {
        update(
          i,
          "photoError",
          "Tambahkan satu foto kegiatan sebelum menyimpan.",
        );
        return;
      }
    const snapshot = answers.map((a) => ({ ...a }));
    const payloadAnswers = snapshot.map((a, i) =>
      selected.includes(i)
        ? { status: a.status, note: a.note, photo: a.photo }
        : { status: "", note: "", photo: null },
    );
    saving.current = true;
    setBusy(selected.length === 1 ? selected[0] : "all");
    try {
      const r = await api("submitJournal", {
        ...identity,
        consent,
        answers: payloadAnswers,
      });
      setSavedConsent(consent);
      setAnswers((prev) =>
        prev.map((a, i) =>
          selected.includes(i) &&
          a.status === snapshot[i].status &&
          a.note === snapshot[i].note
            ? {
                ...a,
                photo: null,
                photoStored: r.answers[i].photoStored,
                saved: true,
                photoError: "",
              }
            : a,
        ),
      );
      setMessage(
        r.complete
          ? "Ketujuh kebiasaan sudah tersimpan. Terima kasih sudah bercerita dengan jujur!"
          : `Berhasil disimpan ke sekolah. ${r.answered} dari 7 kebiasaan terisi. Kamu bisa melanjutkan nanti.`,
      );
    } catch (e) {
      setError(e.message);
    } finally {
      saving.current = false;
      setBusy(null);
    }
  }
  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">
            <Sparkles size={15} />7 KEBIASAAN ANAK INDONESIA HEBAT
          </span>
          <h1>
            Jurnal 7 KAIH.
            <br />
            <span>
              Satu kebiasaan,
              <br />
              satu langkah baik.
            </span>
          </h1>
          <p>
            Isi sesuai kegiatanmu sepanjang hari. Simpan satu per satu,
            <br className="desktop" /> lalu lanjutkan nanti di HP dan browser
            yang sama.
          </p>
          <button
            className="primary"
            onClick={() =>
              identityRef.current?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Mulai / Lanjutkan Jurnalku <ArrowRight size={18} />
          </button>
        </div>
        <div className="hero-art">
          <Illustration />
        </div>
      </section>
      <section className="journal" ref={identityRef}>
        <div className="section-heading">
          <div>
            <span className="eyebrow">JURNAL HARIANKU</span>
            <h2>Isi sedikit demi sedikit, ya!</h2>
            <p>Tidak perlu menunggu tujuh kebiasaan selesai sekaligus.</p>
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
        <div className="identity panel">
          <div className="panel-title">
            <span className="icon blue">
              <GraduationCap />
            </span>
            <div>
              <h3>Identitas anak</h3>
              <p>Gunakan kelas dan absen yang sama saat melanjutkan.</p>
            </div>
            <button className="secondary switch-child" disabled={busy !== null} onClick={switchChild}>Ganti / Tambah Anak</button>
          </div>
          <div className="identity-fields">
            <label>
              Kelas
              <select
                disabled={busy !== null}
                value={identity.kelas}
                onChange={(e) => changeIdentity("kelas", e.target.value)}
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
                disabled={!identity.kelas || busy !== null}
                value={identity.absen}
                onChange={(e) => changeIdentity("absen", e.target.value)}
              >
                <option value="">Pilih absen</option>
                {Array.from({ length: 38 }, (_, i) => (
                  <option key={i + 1}>{i + 1}</option>
                ))}
              </select>
            </label>
            <label className="name-field">
              Nama lengkap anak
              <input
                disabled={!identity.absen || busy !== null}
                maxLength={100}
                value={identity.nama}
                placeholder="Diketik orang tua saat pertama mengisi"
                onChange={(e) => changeIdentity("nama", e.target.value)}
              />
            </label>
          </div>
          <button
            className="secondary resume-button"
            disabled={!identity.absen || busy !== null}
            onClick={resume}
          >
            <BookOpen size={17} />
            {busy === "resume" ? "Membuka…" : "Buka jurnal tersimpan"}
          </button>
          <p className="small">
            Lanjutkan di HP dan browser yang sama. Jangan hapus data situs
            selama kegiatan berlangsung. Isi yang belum disimpan tidak otomatis
            tersimpan.
          </p>
        </div>
        {identity.kelas && identity.absen && <div className="active-child" role="status"><GraduationCap size={23}/><div><small>SEDANG MENGISI JURNAL</small><strong>{identity.nama.trim() || 'Lengkapi nama anak'}</strong><span>Kelas {identity.kelas} · Absen {identity.absen}</span></div><button className="text-button" disabled={busy !== null} onClick={switchChild}>Ganti anak</button></div>}
        <label className="consent panel consent-top">
          <input
            type="checkbox"
            checked={consent}
            disabled={busy !== null}
            onChange={(e) => setConsent(e.target.checked)}
          />
          Saya dan orang tua mengizinkan foto pilihan digunakan dalam laporan
          internal sekolah. (Opsional)
        </label>
        {error && (
          <p role="alert" className="error">
            {error}
          </p>
        )}
        {message && (
          <p role="status" className="save-message">
            {message}
          </p>
        )}
        <div className="journal-columns">
          <div className="cards">
            <div className="cards-heading">
              <h3>Kebiasaan baikku</h3>
              <span>{savedCount} dari 7 tersimpan</span>
            </div>
            {habits.map((h, i) => (
              <article
                className={`habit-card panel ${h.cover ? "with-cover" : ""} ${answers[i].saved ? "completed" : ""}`}
                key={h.name}
              >
                {h.cover && <div className="habit-cover"><img src={`${import.meta.env.BASE_URL}covers/${h.cover}.webp`} alt={`Ilustrasi ${h.name}`} loading="lazy" decoding="async" width="800" height="1000" /></div>}
                <div className="habit-card-content">
                <div className="habit-top">
                  <span className={`icon ${h.color}`}>
                    <h.icon size={25} />
                  </span>
                  <div>
                    <small>KEBIASAAN {i + 1}</small>
                    <h3>{h.name}</h3>
                  </div>
                  {answers[i].saved && (
                    <span className="saved-badge">
                      <Check size={15} />
                      Tersimpan
                    </span>
                  )}
                </div>
                <p>{h.hint}</p>
                {i === 6 && (
                  <p className="small">
                    Diisi berdasarkan tidur tadi malam, bukan mengaku sudah
                    tidur malam ini.
                  </p>
                )}
                {i === 2 && (
                  <a
                    className="video-link"
                    href="https://www.youtube.com/watch?v=mSXOa-qFvSM"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Play size={15} />
                    Tonton Video Senam
                  </a>
                )}
                <div
                  className="status-options"
                  role="group"
                  aria-label={`Status ${h.name}`}
                >
                  {["Sudah", "Belum"].map((s) => (
                    <button
                      disabled={busy !== null}
                      type="button"
                      key={s}
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
                        if (s === "Belum") {
                          update(i, "photo", null);
                          update(i, "photoError", "");
                        }
                      }}
                    >
                      {s === "Sudah" ? (
                        <Check size={17} />
                      ) : (
                        <span className="option-circle" />
                      )}
                      {s === "Sudah" ? "Sudah dilakukan" : "Belum dilakukan"}
                    </button>
                  ))}
                </div>
                {answers[i].status && (
                  <div className="habit-extra">
                    <label className="sr-only" htmlFor={`note-${i}`}>
                      Keterangan {h.name}
                    </label>
                    <input
                      disabled={busy !== null}
                      id={`note-${i}`}
                      maxLength={500}
                      value={answers[i].note}
                      placeholder={
                        answers[i].status === "Belum"
                          ? "Tidak apa-apa. Ceritakan jika kamu mau."
                          : h.placeholder
                      }
                      onChange={(e) => update(i, "note", e.target.value)}
                    />
                    {h.photo && answers[i].status === "Sudah" && (
                      <>
                        <label className="upload">
                          <Camera size={20} />
                          <span>
                            {answers[i].photo
                              ? "Ganti foto pilihan"
                              : answers[i].photoStored
                                ? "Foto sudah tersimpan · ganti jika perlu"
                                : `Tambahkan foto ${h.required ? "kegiatan" : "(opsional)"}`}
                            <small>JPG, PNG, WebP · Maks. 5 MB</small>
                          </span>
                          <input
                            disabled={busy !== null}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            aria-label={`Foto ${h.name}`}
                            onChange={async (e) => {
                              const input = e.currentTarget,
                                file = input.files[0];
                              if (!file) return;
                              try {
                                update(i, "photoError", "");
                                update(i, "photo", await readPhoto(file));
                              } catch (err) {
                                update(i, "photo", null);
                                update(i, "photoError", err.message);
                                input.value = "";
                              }
                            }}
                          />
                        </label>
                        {answers[i].photo && (
                          <div className="photo-preview">
                            <img
                              src={`data:${answers[i].photo.mime};base64,${answers[i].photo.data}`}
                              alt={`Foto pilihan ${h.name}`}
                            />
                            <p>
                              {answers[i].photo.name}
                              <small>
                                Tekan Simpan kebiasaan ini untuk menyimpan ke
                                sekolah.
                              </small>
                            </p>
                          </div>
                        )}
                      </>
                    )}
                    {answers[i].photoError && (
                      <p className="error" role="alert">
                        {answers[i].photoError}
                      </p>
                    )}
                    <button
                      className="primary save-habit"
                      disabled={busy !== null}
                      onClick={() => save([i])}
                    >
                      {busy === i
                        ? "Menyimpan…"
                        : answers[i].saved
                          ? "Simpan ulang kebiasaan ini"
                          : "Simpan kebiasaan ini"}
                      <Check size={17} />
                    </button>
                  </div>
                )}
                </div>
              </article>
            ))}
          </div>
          <aside>
            <div className="progress-card panel">
              <span className="icon yellow">
                <Sparkles />
              </span>
              <h3>Langkah hebatmu</h3>
              <div className="progress-number">
                {done}
                <span>/ 7</span>
              </div>
              <p>kebiasaan sudah dilakukan</p>
              <div
                className="progress-track"
                role="progressbar"
                aria-label="Kebiasaan tersimpan"
                aria-valuemin={0}
                aria-valuemax={7}
                aria-valuenow={savedCount}
              >
                <span style={{ width: `${(savedCount / 7) * 100}%` }} />
              </div>
              <p>{savedCount} dari 7 kebiasaan tersimpan</p>
              <div className="encouragement">
                <Leaf size={20} />
                <span>
                  Belum diisi berbeda dari Belum dilakukan. Kamu bisa
                  melanjutkan nanti.
                </span>
              </div>
            </div>
            <div className="tip">
              <Heart />
              <h4>Jujur itu hebat!</h4>
              <p>Isi sesuai kegiatanmu. Tidak perlu selesai sekaligus.</p>
            </div>
          </aside>
        </div>
        <div className="submit-panel panel">
          <p>
            Sudah mengisi beberapa kartu? Kamu juga bisa menyimpan semua
            perubahan sekaligus.
          </p>
          <button
            disabled={busy !== null}
            className="primary"
            onClick={() =>
              save(
                answers
                  .map((_, i) => i)
                  .filter((i) => answers[i].status && !answers[i].saved),
              )
            }
          >
            {busy === "all" ? "Menyimpan…" : "Simpan semua perubahan"}
            <ArrowRight size={18} />
          </button>
          <p className="small">
            <ShieldCheck size={14} /> Jurnal dan foto tersimpan privat di
            sekolah setelah muncul konfirmasi berhasil.
          </p>
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          {message && (
            <p className="save-message" role="status">
              {message}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
