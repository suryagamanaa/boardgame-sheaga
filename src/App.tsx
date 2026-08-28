import { useState, useEffect, useRef, useCallback } from "react"

// ── Tile images (Tile n → Board Game A3 (n+3).png) ───────────────────────────
import img3 from "@/imports/Board Game A3 (3).png"
import img4 from "@/imports/Board Game A3 (4).png"
import img5 from "@/imports/Board Game A3 (5).png"
import img6 from "@/imports/Board Game A3 (6).png"
import img7 from "@/imports/Board Game A3 (7).png"
import img8 from "@/imports/Board Game A3 (8).png"
import img9 from "@/imports/Board Game A3 (9).png"
import img10 from "@/imports/Board Game A3 (10).png"
import img11 from "@/imports/Board Game A3 (11).png"
import img12 from "@/imports/Board Game A3 (12).png"
import img13 from "@/imports/Board Game A3 (13).png"
import img14 from "@/imports/Board Game A3 (14).png"
import img15 from "@/imports/Board Game A3 (15).png"
import img16 from "@/imports/Board Game A3 (16).png"
import img17 from "@/imports/Board Game A3 (17).png"
import img18 from "@/imports/Board Game A3 (18).png"
import img19 from "@/imports/Board Game A3 (19).png"
import img20 from "@/imports/Board Game A3 (20).png"
import img21 from "@/imports/Board Game A3 (21).png"
import img22 from "@/imports/Board Game A3 (22).png"
import img23 from "@/imports/Board Game A3 (23).png"
import img24 from "@/imports/Board Game A3 (24).png"
import img25 from "@/imports/Board Game A3 (25).png"

// ── Card images ───────────────────────────────────────────────────────────────
import img26a from "@/imports/Board_Game_A3_(26a).png"
import img26b from "@/imports/Board_Game_A3_(26b).png"
import img27 from "@/imports/Board Game A3 (27).png"
import img28 from "@/imports/Board Game A3 (28).png"
import img29 from "@/imports/Board Game A3 (29).png"
import img30 from "@/imports/Board Game A3 (30).png"
import img31 from "@/imports/Board Game A3 (31).png"
import img32 from "@/imports/Board Game A3 (32).png"
import img33 from "@/imports/Board Game A3 (33).png"
import img34 from "@/imports/Board Game A3 (34).png"
import img35 from "@/imports/Board Game A3 (35).png"
import img36 from "@/imports/Board Game A3 (36).png"

// Insurance card: id → image
const INSURANCE_CARD_IMAGES: Record<string, string> = {
  "26a": img26a,
  "26b": img26b,
}

// Challenge card: id → image (CHALLENGE_CARDS[i].id → gambar)
const CHALLENGE_CARD_IMAGES: Record<number, string> = {
  27: img27,
  28: img28,
  29: img29,
  30: img30,
  31: img31,
  32: img32,
  33: img33,
  34: img34,
  35: img35,
  36: img36,
}

// Tile n → TILE_IMAGES[n] (rumus: file = n + 3, tersedia 0–22)
const TILE_IMAGES: (string | null)[] = [
  img3, // tile 0  → (3)  MULAI
  img4, // tile 1  → (4)  Pemasukan Tambahan
  img5, // tile 2  → (5)  Motor Rusak
  img25,
  img6, // tile 3  → (6)  Challenge YUK! ← BARU
  img7, // tile 4  → (7)  Perlindungan!
  img8, // tile 5  → (8)  Bisnis Sukses!
  img9, // tile 6  → (9)  Cek Risiko
  img10, // tile 7  → (10) Keluarga Sakit
  img11, // tile 8  → (11) Challenge YUK!
  img12, // tile 9  → (12) Terjerat Pinjol
  img13, // tile 10 → (13) Perlindungan!
  img14, // tile 11 → (14) Dapat Gaji
  img15, // tile 12 → (15) Jangan Lupa Donasi
  img16, // tile 13 → (16) Challenge YUK!
  img17, // tile 14 → (17) Impulsive Buying
  img18, // tile 15 → (18) Challenge YUK!
  img19, // tile 16 → (19) Perlindungan!
  img20, // tile 17 → (20) Uang Kaget
  img21, // tile 18 → (21) BANKRUPT!
  img22, // tile 19 → (22) Hadiah Lebaran
  img23, // tile 20 → (23) Challenge YUK!
  img24, // tile 21 → (24) Kemalingan HP
  img25, // tile 22 → (25) Challenge YUK!
  null, // tile 23 → (26) tidak ada file → fallback ikon
]

// ── Palette ──────────────────────────────────────────────────────────────────
const C = {
  pink: "#EC4899",
  pinkDark: "#BE185D",
  pinkLight: "#FDF2F8",
  navy: "#1E3A8A",
  blue: "#2563EB",
  blueLight: "#EFF6FF",
  cream: "#FFF7F2",
  ink: "#1F1147",
  green: "#22C55E",
  red: "#EF4444",
  gold: "#F59E0B",
  orange: "#F97316",
  purple: "#8B5CF6",
}

const PLAYER_COLORS = [
  "#EC4899", // Pemain 1 - Pink
  "#2563EB", // Pemain 2 - Blue
  "#F59E0B", // Pemain 3 - Gold
  "#10B981", // Pemain 4 - Green
  "#8B5CF6", // Pemain 5 - Purple
  "#F97316", // Pemain 6 - Orange
  "#EF4444", // Pemain 7 - Red
]

const PLAYER_BG = [
  "#FDF2F8", // Pink light
  "#EFF6FF", // Blue light
  "#FFFBEB", // Gold light
  "#F0FDF4", // Green light
  "#F5F3FF", // Purple light
  "#FFF7ED", // Orange light
  "#FEF2F2", // Red light
]

// ── Tile data ─────────────────────────────────────────────────────────────────
type TileType = "start" | "pos" | "neg" | "challenge" | "insurance" | "bankrupt" | "donation" | "info"

interface Tile {
  name: string
  sub: string
  type: TileType
  amount: number
  icon: string
}

const TILES: Tile[] = [
  // Baris atas (indeks 0-6)
  {
    name: "MULAI!",
    sub: "Mulai Perjalanan",
    type: "start",
    amount: 0,
    icon: "🚀",
  },
  {
    name: "Pemasukan Tambahan",
    sub: "+Rp 500.000",
    type: "pos",
    amount: 500000,
    icon: "💰",
  },
  {
    name: "Motor Rusak",
    sub: "-Rp 300.000",
    type: "neg",
    amount: -300000,
    icon: "🛵",
  },
  {
    name: "Challenge YUK!",
    sub: "Ambil Challenge",
    type: "challenge",
    amount: 0,
    icon: "🎯",
  }, // ← TAMBAHKAN INI
  {
    name: "Perlindungan!",
    sub: "-Rp 50 ribu",
    type: "insurance",
    amount: -50000,
    icon: "🛡️",
  },
  {
    name: "Bisnis Sukses!",
    sub: "+Rp 1.000.000",
    type: "pos",
    amount: 1000000,
    icon: "📈",
  },
  {
    name: "Cek Risiko Finansialmu!",
    sub: "Scan RiSHEko",
    type: "info",
    amount: 0,
    icon: "🔍",
  },

  // Kolom kanan (indeks 7-11)
  {
    name: "Keluarga Sakit",
    sub: "-Rp 500.000",
    type: "neg",
    amount: -500000,
    icon: "🏥",
  },
  {
    name: "Challenge YUK!",
    sub: "Ambil Challenge",
    type: "challenge",
    amount: 0,
    icon: "🎯",
  },
  {
    name: "Terjerat Pinjol",
    sub: "-Rp 2.000.000",
    type: "neg",
    amount: -2000000,
    icon: "💸",
  },
  {
    name: "Perlindungan!",
    sub: "-Rp 50 ribu",
    type: "insurance",
    amount: -50000,
    icon: "🛡️",
  },
  {
    name: "Dapat Gaji",
    sub: "+Rp 3.000.000",
    type: "pos",
    amount: 3000000,
    icon: "💵",
  },

  // Baris bawah (indeks 12-17)
  {
    name: "Jangan Lupa Donasi",
    sub: "Semua +Rp 500rb",
    type: "donation",
    amount: 500000,
    icon: "🤝",
  },
  {
    name: "Challenge YUK!",
    sub: "Ambil Challenge",
    type: "challenge",
    amount: 0,
    icon: "🎯",
  },
  {
    name: "Impulsive Buying",
    sub: "-Rp 1.000.000",
    type: "neg",
    amount: -1000000,
    icon: "🛍️",
  },
  {
    name: "Challenge YUK!",
    sub: "Ambil Challenge",
    type: "challenge",
    amount: 0,
    icon: "🎯",
  },
  {
    name: "Perlindungan!",
    sub: "-Rp 50 ribu",
    type: "insurance",
    amount: -50000,
    icon: "🛡️",
  },
  {
    name: "Uang Kaget",
    sub: "+Rp 500.000",
    type: "pos",
    amount: 500000,
    icon: "🎉",
  },

  // Kolom kiri (indeks 18-23)
  {
    name: "BANKRUPT!",
    sub: "Modal Jadi Rp50 Ribu",
    type: "bankrupt",
    amount: 0,
    icon: "💀",
  },
  {
    name: "Hadiah Lebaran",
    sub: "+Rp 1.000.000",
    type: "pos",
    amount: 1000000,
    icon: "🎁",
  },
  {
    name: "Challenge YUK!",
    sub: "Ambil Challenge",
    type: "challenge",
    amount: 0,
    icon: "🎯",
  },
  {
    name: "Kemalingan HP",
    sub: "-Rp 3.000.000",
    type: "neg",
    amount: -3000000,
    icon: "📱",
  },
  {
    name: "Challenge YUK!",
    sub: "Ambil Challenge",
    type: "challenge",
    amount: 0,
    icon: "🎯",
  },
  {
    name: "Dapat Gaji",
    sub: "+Rp 3.000.000",
    type: "pos",
    amount: 3000000,
    icon: "💵",
  },
]

// ── Challenge & Insurance card types ─────────────────────────────────────────
interface ChallengeOption {
  t: string
  bijak: boolean
}

// ── Kartu Asuransi (26a dan 26b) ─────────────────────────────────────────────
interface InsuranceCard {
  id: string
  title: string
  desc: string
  premium: number
  benefit: string
  icon: string
}

const INSURANCE_CARDS: InsuranceCard[] = [
  {
    id: "26a",
    title: "Asuransi Kesehatan",
    desc: "Perlindungan untuk biaya rawat inap dan pengobatan.",
    premium: 50000,
    benefit: "Klaim hingga Rp10.000.000 per tahun",
    icon: "🏥",
  },
  {
    id: "26b",
    title: "Asuransi Jiwa",
    desc: "Perlindungan finansial untuk keluarga Anda.",
    premium: 50000,
    benefit: "Santunan Rp50.000.000 untuk ahli waris",
    icon: "🛡️",
  },
]

// ── Challenge cards (id = nomor file gambar: 27-36) ───────────────────────────
interface ChallengeCard {
  id: number
  title: string
  desc: string
  options: ChallengeOption[]
}

const CHALLENGE_CARDS: ChallengeCard[] = [
  {
    id: 27,
    title: "Anak Sakit",
    desc: "Anak Anda demam tinggi dan harus ke dokter. Biaya pengobatan mencapai Rp2.000.000.",
    options: [
      { t: "Pakai tabungan", bijak: true },
      { t: "Pinjam ke teman/keluarga", bijak: false },
      { t: "Pinjam online (pinjol)", bijak: false },
      { t: "Tunda dulu", bijak: false },
    ],
  },
  {
    id: 28,
    title: "Warung Ramai",
    desc: "Hari ini warung Anda ramai sekali! Pendapatan bertambah Rp1.500.000.",
    options: [
      { t: "Belanja kebutuhan keluarga", bijak: false },
      { t: "Tambah stok barang", bijak: true },
      { t: "Nabung / dana darurat", bijak: true },
      { t: "Bagi ke arisan", bijak: false },
    ],
  },
  {
    id: 29,
    title: "Flash Sale!",
    desc: "Ada diskon besar 70% untuk barang yang Anda inginkan seharga Rp800.000.",
    options: [
      { t: "Beli sekarang", bijak: false },
      { t: "Pakai paylater", bijak: false },
      { t: "Tunda, pikirkan lagi", bijak: true },
      { t: "Tidak beli, fokus kebutuhan", bijak: true },
    ],
  },
  {
    id: 30,
    title: "Pelatihan UMKM",
    desc: "Ada pelatihan gratis tentang pencatatan keuangan dan pemasaran digital untuk UMKM.",
    options: [
      { t: "Tidak sempat, nanti saja", bijak: false },
      { t: "Ikut jika ada waktu luang", bijak: false },
      { t: "Prioritaskan ikut pelatihan", bijak: true },
      { t: "Kirim teman saja", bijak: false },
    ],
  },
  {
    id: 31,
    title: "E-Course / Bootcamp",
    desc: "Ada e-course/bootcamp seharga Rp750.000 untuk skill baru yang bisa meningkatkan penghasilan.",
    options: [
      { t: "Terlalu mahal, tidak perlu", bijak: false },
      { t: "Pinjam dulu, nanti bayar", bijak: false },
      { t: "Nabung dulu sampai cukup", bijak: true },
      { t: "Beli sekarang, investasi diri", bijak: true },
    ],
  },
  {
    id: 32,
    title: "Belanja Emosional",
    desc: "Stres kerjaan, langsung belanja online buat 'reward diri'. Paket datang, senang sebentar, tapi akhir bulan menyesal.",
    options: [
      { t: "Cooling down 24 jam sebelum belanja", bijak: true },
      { t: "Hapus aplikasi belanja", bijak: true },
      { t: "Tetap belanja, nanti dihemat", bijak: false },
      { t: "Cari cara lain kelola stres", bijak: true },
    ],
  },
  {
    id: 33,
    title: "Ketagihan Paylater",
    desc: "Awalnya cuma 'bayar nanti', lama-lama jadi kebiasaan. Tiap bulan tagihan datang beruntun.",
    options: [
      { t: "Stop paylater & lunasi utang", bijak: true },
      { t: "Catat semua tagihan & buat prioritas", bijak: true },
      { t: "Tetap pakai paylater", bijak: false },
      { t: "Pindah ke platform lain", bijak: false },
    ],
  },
  {
    id: 34,
    title: "Usaha & Keuangan Campur",
    desc: "Usaha jalan tapi bingung keuntungannya ke mana. Uang usaha dipakai buat belanja harian.",
    options: [
      { t: "Pisahkan rekening pribadi & usaha", bijak: true },
      { t: "Catat pemasukan & pengeluaran", bijak: true },
      { t: "Ambil uang usaha sesuka hati", bijak: false },
      { t: "Nanti dulu, yang penting usaha jalan", bijak: false },
    ],
  },
  {
    id: 35,
    title: "Sakit Mendadak",
    desc: "Sakit mendadak atau rawat inap membuat biaya membengkak. Tabungan habis, pinjam ke keluarga.",
    options: [
      { t: "Siapkan dana darurat kesehatan", bijak: true },
      { t: "Cari asuransi kesehatan", bijak: true },
      { t: "Pakai kartu kredit dicicil", bijak: false },
      { t: "Berharap nggak sakit lagi", bijak: false },
    ],
  },
  {
    id: 36,
    title: "Investasi FOMO",
    desc: "Lihat teman dapat cuan dari investasi viral, langsung ikut-ikutan tanpa mengerti risikonya.",
    options: [
      { t: "Pelajari risiko & profil diri", bijak: true },
      { t: "Investasi kecil, coba-coba", bijak: false },
      { t: "Ikut teman biar nggak ketinggalan", bijak: false },
      { t: "Tarik uang saat harga turun", bijak: false },
    ],
  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmt(n: number) {
  const s = n < 0 ? "-" : "+"
  return s + "Rp" + Math.abs(n).toLocaleString("id-ID")
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function fmtTime(s: number) {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${sec.toString().padStart(2, "0")}`
}

// tile position in 7×7 grid (perimeter walk)
// index 0 = pojok kiri-atas (MULAI), lalu searah jarum jam:
// atas (col0→col6) → kanan (row1→row6) → bawah (col5→col0) → kiri (row5→row1)

function tilePos(i: number): { row: number; col: number } {
  // Indeks 0-6: baris atas (row 0, col 0-6)
  if (i <= 6) return { row: 0, col: i }
  // Indeks 7-12: kolom kanan (row 1-6, col 6)
  if (i <= 12) return { row: i - 6, col: 6 }
  // Indeks 13-18: baris bawah (row 6, col 5-0)
  if (i <= 18) return { row: 6, col: 18 - i }
  // Indeks 19-23: kolom kiri (row 5-0, col 0)
  return { row: 24 - i, col: 0 }
}

// ── Tile style ────────────────────────────────────────────────────────────────
// Meniru gaya kartu di PDF: badan petak putih/cream, label warna di atas.
// "labelBg" = warna pill judul (sesuai kode warna PDF), "labelText" = warna teks label,
// "cardBg" = warna dasar badan petak (mayoritas putih, beberapa tetap solid seperti BANKRUPT).
const TILE_STYLES: Record<TileType, {
  labelBg: string
  labelText: string
  cardBg: string
  cardText: string
  border: string
}> = {
  start: {
    labelBg: "#EC4899",
    labelText: "#fff",
    cardBg: "#FFFFFF",
    cardText: "#1F1147",
    border: "#EC4899",
  },
  pos: {
    labelBg: "#FFFFFF",
    labelText: "#16A34A",
    cardBg: "#FFFFFF",
    cardText: "#1F1147",
    border: "#E5E7EB",
  },
  neg: {
    labelBg: "#DC2626",
    labelText: "#fff",
    cardBg: "#FFFFFF",
    cardText: "#1F1147",
    border: "#FCA5A5",
  },
  challenge: {
    labelBg: "#EC4899",
    labelText: "#fff",
    cardBg: "#FFFFFF",
    cardText: "#1F1147",
    border: "#F9A8D4",
  },
  insurance: {
    labelBg: "#2563EB",
    labelText: "#fff",
    cardBg: "#FFFFFF",
    cardText: "#1F1147",
    border: "#93C5FD",
  },
  bankrupt: {
    labelBg: "#DC2626",
    labelText: "#fff",
    cardBg: "#111827",
    cardText: "#fff",
    border: "#DC2626",
  },
  donation: {
    labelBg: "#F59E0B",
    labelText: "#fff",
    cardBg: "#FFFFFF",
    cardText: "#1F1147",
    border: "#FDE68A",
  },
  info: {
    labelBg: "#1E3A8A",
    labelText: "#fff",
    cardBg: "#FFFFFF",
    cardText: "#1F1147",
    border: "#93C5FD",
  },
}

// ── Types ─────────────────────────────────────────────────────────────────────
interface Player {
  name: string
  color: string
  bg: string
  position: number
  laps: number
}

type Phase = "setup" | "playing" | "ended"

interface ModalState {
  type: "insurance" | "insurance-result" | "challenge" | "challenge-result"
  card?: ChallengeCard
  chosen?: ChallengeOption
  insuranceCard?: InsuranceCard
}

interface LogEntry {
  player: string
  text: string
  note?: string
}

// ── Dice dots layout ──────────────────────────────────────────────────────────
const DICE_DOTS: Record<number, number[][]> = {
  1: [[50, 50]],
  2: [
    [25, 25],
    [75, 75],
  ],
  3: [
    [25, 25],
    [50, 50],
    [75, 75],
  ],
  4: [
    [25, 25],
    [75, 25],
    [25, 75],
    [75, 75],
  ],
  5: [
    [25, 25],
    [75, 25],
    [50, 50],
    [25, 75],
    [75, 75],
  ],
  6: [
    [25, 20],
    [75, 20],
    [25, 50],
    [75, 50],
    [25, 80],
    [75, 80],
  ],
}

// ── Dice component ────────────────────────────────────────────────────────────
function Dice({ value, rolling }: { value: number; rolling: boolean }) {
  const dots = DICE_DOTS[value] || DICE_DOTS[1]
  return (
    <div
      style={{
        width: 72,
        height: 72,
        borderRadius: 14,
        background: "white",
        border: `3px solid ${C.navy}`,
        position: "relative",
        boxShadow:
          "0 6px 20px rgba(30,58,138,0.25), inset 0 2px 4px rgba(255,255,255,0.8)",
        animation: rolling
          ? "diceRoll 0.7s cubic-bezier(.36,.07,.19,.97) infinite"
          : undefined,
        transition: "transform 0.3s",
        flexShrink: 0,
      }}
    >
      {dots.map(([x, y], idx) => (
        <div
          key={idx}
          style={{
            position: "absolute",
            width: 11,
            height: 11,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${C.navy}, ${C.blue})`,
            left: `calc(${x}% - 5.5px)`,
            top: `calc(${y}% - 5.5px)`,
            boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
          }}
        />
      ))}
    </div>
  )
}

// ── Pawn SVG ─────────────────────────────────────────────────────────────────
function PawnIcon({
  color,
  name,
  active,
}: {
  color: string
  name: string
  active: boolean
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
        filter: active ? `drop-shadow(0 0 6px ${color})` : undefined,
        animation: active ? "pawnBob 1s ease-in-out infinite" : undefined,
      }}
    >
      {/* pawn body */}
      <svg width="26" height="34" viewBox="0 0 26 34" fill="none">
        <ellipse cx="13" cy="31" rx="9" ry="3" fill={color} opacity="0.35" />
        <rect x="8" y="18" width="10" height="10" rx="2" fill={color} />
        <ellipse cx="13" cy="13" rx="7" ry="7" fill={color} />
        <ellipse cx="13" cy="13" rx="4.5" ry="4.5" fill="white" opacity="0.3" />
        <rect
          x="11"
          y="25"
          width="4"
          height="4"
          rx="1"
          fill={color}
          opacity="0.8"
        />
        {/* name label */}
      </svg>
      <div
        style={{
          background: color,
          color: "white",
          fontSize: 8,
          fontWeight: 900,
          padding: "1px 5px",
          borderRadius: 99,
          whiteSpace: "nowrap",
          maxWidth: 48,
          overflow: "hidden",
          textOverflow: "ellipsis",
          boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
          fontFamily: "'Nunito', sans-serif",
          lineHeight: 1.4,
        }}
      >
        {name.length > 6 ? name.slice(0, 5) + "…" : name}
      </div>
    </div>
  )
}

// ── Board tile ────────────────────────────────────────────────────────────────
function BoardTile({
  tile,
  index,
  players,
  highlight,
  currentIdx,
}: {
  tile: Tile
  index: number
  players: Player[]
  highlight: boolean
  currentIdx: number
}) {
  const style = TILE_STYLES[tile.type]
  const pos = tilePos(index)
  const playersHere = players.filter((p) => p.position === index)
  const imgSrc = TILE_IMAGES[index]

  return (
    <div
      data-tile={index}
      style={{
        gridRow: pos.row + 1,
        gridColumn: pos.col + 1,
        background: style.cardBg,
        borderRadius: 8,
        padding: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        justifyContent: "flex-start",
        textAlign: "center",
        color: style.cardText,
        position: "relative",
        border: highlight ? `2.5px solid #fff` : `1.5px solid ${style.border}`,
        boxShadow: highlight
          ? `0 0 18px rgba(236,72,153,0.85), 0 0 6px rgba(236,72,153,0.4)`
          : "0 2px 6px rgba(0,0,0,0.12)",
        transform: highlight ? "scale(1.08)" : "scale(1)",
        transition: "all 0.3s cubic-bezier(.34,1.56,.64,1)",
        zIndex: highlight ? 5 : 1,
        overflow: "hidden",
        minHeight: 0,
      }}
    >
      {imgSrc ? (
        /* ── Gambar mengisi seluruh petak ── */
        <img
          src={imgSrc}
          alt={tile.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "top",
            display: "block",
          }}
        />
      ) : (
        /* ── Fallback (tile 23): label + ikon ── */
        <>
          <div
            style={{
              background: style.labelBg,
              color: style.labelText,
              fontSize: "clamp(4.5px,0.55vw,7px)",
              fontWeight: 800,
              lineHeight: 1.2,
              fontFamily: "'Nunito', sans-serif",
              padding: "1.5px 2px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {tile.name}
          </div>
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "2px 1px",
            }}
          >
            <div style={{ fontSize: "clamp(10px,1.6vw,18px)", lineHeight: 1 }}>
              {tile.icon}
            </div>
            {tile.amount !== 0 && (
              <div
                style={{
                  fontSize: "clamp(5px,0.6vw,7px)",
                  fontWeight: 800,
                  marginTop: 1,
                  color: tile.amount > 0 ? "#16A34A" : "#DC2626",
                }}
              >
                {fmt(tile.amount)}
              </div>
            )}
          </div>
        </>
      )}

      {/* pawns on this tile */}
      {playersHere.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: -20,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 2,
            zIndex: 20,
            pointerEvents: "none",
          }}
        >
          {playersHere.map((p) => (
            <div
              key={p.name}
              style={{
                animation: "pawnMove 0.4s cubic-bezier(.34,1.56,.64,1)",
              }}
            >
              <PawnIcon
                color={p.color}
                name={p.name}
                active={players.indexOf(p) === currentIdx}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Setup screen ──────────────────────────────────────────────────────────────
function SetupScreen({
  numPlayers,
  names,
  setNumPlayers,
  setName,
  onStart,
}: {
  numPlayers: number
  names: string[]
  setNumPlayers: (n: number) => void
  setName: (i: number, v: string) => void
  onStart: () => void
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, #FDE9F1 0%, #EAF1FF 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: 28,
          padding: "40px 36px",
          maxWidth: 460,
          width: "100%",
          boxShadow: "0 20px 60px rgba(190,24,93,0.15)",
          textAlign: "center",
        }}
      >
        {/* logo */}
        <div
          style={{
            display: "inline-block",
            background: `linear-gradient(135deg, ${C.pink}, ${C.pinkDark})`,
            color: "white",
            padding: "5px 18px",
            borderRadius: 99,
            fontSize: 11,
            letterSpacing: 2,
            fontWeight: 900,
            marginBottom: 12,
          }}
        >
          JOURNEY TO FINANCIAL RESILIENCE
        </div>

        <div style={{ fontSize: 56, lineHeight: 1 }}>
          <span
            style={{
              color: C.pinkDark,
              fontFamily: "'Fredoka One', sans-serif",
            }}
          >
            SHE
          </span>
          <span
            style={{ color: C.navy, fontFamily: "'Fredoka One', sans-serif" }}
          >
            -aga
          </span>
        </div>
        <div
          style={{
            color: "#6b6480",
            fontSize: 13,
            fontWeight: 700,
            marginTop: 4,
            letterSpacing: 0.5,
          }}
        >
          Board Game Literasi Keuangan Digital
        </div>

        {/* sparkles decoration */}
        <div style={{ fontSize: 24, margin: "12px 0", opacity: 0.6 }}>
          ✦ ✧ ✦
        </div>

        {/* player count */}
        <div style={{ textAlign: "left", marginTop: 8 }}>
          <label
            style={{
              fontSize: 12,
              fontWeight: 900,
              color: C.navy,
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            Jumlah Pemain
          </label>
          <div
            style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}
          >
            {[4, 5, 6, 7].map((n) => (
              <button
                key={n}
                onClick={() => setNumPlayers(n)}
                style={{
                  flex: 1,
                  minWidth: "60px",
                  padding: "10px 0",
                  borderRadius: 12,
                  border: `2.5px solid ${
                    numPlayers === n ? C.navy : "#E9E3F5"
                  }`,
                  background: numPlayers === n ? C.navy : "white",
                  color: numPlayers === n ? "white" : C.navy,
                  fontWeight: 800,
                  fontSize: 14,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  fontFamily: "'Nunito', sans-serif",
                }}
              >
                {n} Pemain
              </button>
            ))}
          </div>
        </div>

        {/* name inputs */}
        <div style={{ textAlign: "left", marginTop: 18 }}>
          <label
            style={{
              fontSize: 12,
              fontWeight: 900,
              color: C.navy,
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            Nama Pemain
          </label>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              marginTop: 8,
            }}
          >
            {Array.from({ length: numPlayers }).map((_, i) => (
              <div
                key={i}
                style={{ display: "flex", alignItems: "center", gap: 8 }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: PLAYER_COLORS[i],
                    flexShrink: 0,
                  }}
                />
                <input
                  type="text"
                  placeholder={`Pemain ${i + 1}`}
                  value={names[i] || ""}
                  onChange={(e) => setName(i, e.target.value)}
                  style={{
                    flex: 1,
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: `2px solid #E9E3F5`,
                    fontSize: 14,
                    fontFamily: "'Nunito', sans-serif",
                    fontWeight: 700,
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = C.pink)}
                  onBlur={(e) => (e.target.style.borderColor = "#E9E3F5")}
                />
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onStart}
          style={{
            marginTop: 24,
            width: "100%",
            padding: "15px",
            border: "none",
            borderRadius: 14,
            background: `linear-gradient(135deg, ${C.pink}, ${C.pinkDark})`,
            color: "white",
            fontWeight: 900,
            fontSize: 17,
            cursor: "pointer",
            letterSpacing: 0.5,
            boxShadow: `0 8px 24px rgba(190,24,93,0.4)`,
            fontFamily: "'Nunito', sans-serif",
            transition: "transform 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "translateY(-2px)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.transform = "translateY(0)")
          }
        >
          🎲 Mulai Permainan
        </button>

        <p
          style={{
            fontSize: 11.5,
            color: "#a89fc2",
            marginTop: 14,
            lineHeight: 1.6,
          }}
        >
          📝 Modal awal & transaksi dicatat manual di kertas &bull; ⏱ Durasi 20
          menit
        </p>
      </div>
    </div>
  )
}

// ── Modal ─────────────────────────────────────────────────────────────────────
function Modal({
  modal,
  player,
  onInsurance,
  onChallenge,
  onCloseResult,
  onCloseInsurance,
}: {
  modal: ModalState
  player: Player
  onInsurance: (accept: boolean) => void
  onChallenge: (idx: number) => void
  onCloseResult: () => void
  onCloseInsurance: () => void
}) {
  const btnBase: React.CSSProperties = {
    display: "block",
    width: "100%",
    textAlign: "left",
    padding: "11px 16px",
    marginBottom: 7,
    borderRadius: 12,
    border: `2px solid #E9E3F5`,
    background: "#FAF8FC",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 700,
    color: C.ink,
    transition: "all 0.2s",
    fontFamily: "'Nunito', sans-serif",
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(31,17,71,0.65)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        padding: 16,
        animation: "fadeIn 0.25s ease-out",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: 24,
          maxWidth: 440,
          width: "100%",
          padding: "28px",
          boxShadow: "0 24px 60px rgba(0,0,0,0.3)",
          maxHeight: "90vh",
          overflowY: "auto",
          animation: "slideUp 0.3s cubic-bezier(.34,1.56,.64,1)",
          fontFamily: "'Nunito', sans-serif",
        }}
      >
        {/* ── ASURANSI ── */}
        {modal.type === "insurance" &&
          modal.insuranceCard &&
          (() => {
            const ic = modal.insuranceCard
            const cardImg = INSURANCE_CARD_IMAGES[ic.id]
            return (
              <>
                {cardImg && (
                  <img
                    src={cardImg}
                    alt={ic.title}
                    style={{
                      width: "100%",
                      borderRadius: 12,
                      marginBottom: 14,
                      display: "block",
                    }}
                  />
                )}
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 900,
                    color: C.blue,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                  }}
                >
                  🛡️ {ic.icon} {ic.title}
                </div>
                <h3
                  style={{
                    color: C.navy,
                    fontSize: 20,
                    marginTop: 4,
                    fontWeight: 900,
                  }}
                >
                  Ambil Asuransi?
                </h3>
                <p style={{ fontSize: 13.5, color: "#5c5470", marginTop: 8 }}>
                  {ic.desc}
                </p>
                <div
                  style={{
                    background: "#EFF6FF",
                    borderRadius: 10,
                    padding: "10px 14px",
                    margin: "10px 0",
                    border: "1px solid #93C5FD",
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.navy }}>
                    💰 Premi: Rp{ic.premium.toLocaleString()}
                  </div>
                  <div style={{ fontSize: 12, color: C.blue, marginTop: 2 }}>
                    ✅ {ic.benefit}
                  </div>
                </div>
                <div
                  style={{
                    background: "#FFF7E0",
                    border: `1.5px dashed ${C.gold}`,
                    borderRadius: 10,
                    padding: "10px 14px",
                    fontSize: 12,
                    color: "#8a5a00",
                    fontWeight: 700,
                    margin: "10px 0",
                  }}
                >
                  📝 Kalau "Ya", catat -Rp{ic.premium.toLocaleString()} di
                  kertas.
                </div>
                <button
                  style={{
                    ...btnBase,
                    borderColor: C.blue,
                    background: C.blueLight,
                  }}
                  onClick={() => onInsurance(true)}
                >
                  ✅ Ya, ambil {ic.title}
                </button>
                <button style={btnBase} onClick={() => onInsurance(false)}>
                  🚫 Tidak, lewati
                </button>
              </>
            )
          })()}

        {/* ── CHALLENGE ── */}
        {modal.type === "challenge" &&
          modal.card &&
          (() => {
            const cc = modal.card as ChallengeCard
            const cardImg = CHALLENGE_CARD_IMAGES[cc.id]
            return (
              <>
                {cardImg && (
                  <img
                    src={cardImg}
                    alt={cc.title}
                    style={{
                      width: "100%",
                      borderRadius: 12,
                      marginBottom: 14,
                      display: "block",
                    }}
                  />
                )}
                <div
                  style={{
                    display: "inline-block",
                    background: `linear-gradient(135deg,${C.pink},${C.pinkDark})`,
                    color: "white",
                    padding: "3px 12px",
                    borderRadius: 99,
                    fontSize: 11,
                    fontWeight: 900,
                    marginBottom: 8,
                  }}
                >
                  🎯 Kartu Challenge
                </div>
                <h3
                  style={{ color: C.pinkDark, fontSize: 20, fontWeight: 900 }}
                >
                  {cc.title}
                </h3>
                <p
                  style={{
                    fontSize: 13.5,
                    color: "#5c5470",
                    margin: "8px 0 14px",
                  }}
                >
                  {cc.desc}
                </p>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 900,
                    color: "#8b83a3",
                    letterSpacing: 1,
                    marginBottom: 8,
                  }}
                >
                  APA YANG AKAN ANDA LAKUKAN?
                </div>
                {cc.options.map((o, idx) => (
                  <button
                    key={idx}
                    style={btnBase}
                    onClick={() => onChallenge(idx)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = C.pink
                      e.currentTarget.style.background = "#FFF0F6"
                      e.currentTarget.style.transform = "translateX(4px)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#E9E3F5"
                      e.currentTarget.style.background = "#FAF8FC"
                      e.currentTarget.style.transform = "translateX(0)"
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        background: C.pink,
                        color: "white",
                        fontSize: 11,
                        fontWeight: 900,
                        textAlign: "center",
                        lineHeight: "22px",
                        marginRight: 8,
                        flexShrink: 0,
                      }}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {o.t}
                  </button>
                ))}
              </>
            )
          })()}

        {/* ── CHALLENGE RESULT ── */}
        {modal.type === "challenge-result" && modal.chosen && (
          <>
            <div style={{ textAlign: "center", padding: "10px 0 16px" }}>
              <div style={{ fontSize: 60 }}>
                {modal.chosen.bijak ? "🎉" : "📝"}
              </div>
              <h3
                style={{
                  color: modal.chosen.bijak ? C.green : C.orange,
                  fontSize: 22,
                  fontWeight: 900,
                  marginTop: 8,
                }}
              >
                {modal.chosen.bijak
                  ? "Keputusan Bijak! ✅"
                  : "Semangat Belajar! 💪"}
              </h3>
              <p style={{ fontSize: 14, color: "#5c5470", marginTop: 6 }}>
                Kamu memilih: <b>{modal.chosen.t}</b>
              </p>
            </div>
            <div
              style={{
                background: "#FFF7E0",
                border: `1.5px dashed ${C.gold}`,
                borderRadius: 10,
                padding: "10px 14px",
                fontSize: 12,
                color: "#8a5a00",
                fontWeight: 700,
                marginBottom: 14,
              }}
            >
              📝 Diskusikan dampaknya ke modal virtual, lalu catat sesuai
              kesepakatan.
            </div>
            <button
              onClick={onCloseResult}
              style={{
                width: "100%",
                padding: "13px",
                border: "none",
                borderRadius: 12,
                background: `linear-gradient(135deg,${C.navy},${C.blue})`,
                color: "white",
                fontWeight: 900,
                fontSize: 15,
                cursor: "pointer",
                fontFamily: "'Nunito', sans-serif",
              }}
            >
              Lanjutkan ➜
            </button>
          </>
        )}

        {/* ── INSURANCE RESULT ── */}
        {modal.type === "insurance-result" &&
          modal.insuranceCard &&
          modal.chosen && (
            <>
              <div style={{ textAlign: "center", padding: "10px 0 16px" }}>
                <div style={{ fontSize: 60 }}>
                  {modal.chosen.bijak ? "✅" : "📝"}
                </div>
                <h3
                  style={{
                    color: modal.chosen.bijak ? C.green : C.orange,
                    fontSize: 22,
                    fontWeight: 900,
                    marginTop: 8,
                  }}
                >
                  {modal.chosen.bijak
                    ? "Asuransi Diambil! 🛡️"
                    : "Melewati Asuransi"}
                </h3>
                <p style={{ fontSize: 14, color: "#5c5470", marginTop: 6 }}>
                  Kartu: <b>{modal.insuranceCard.title}</b>
                </p>
                <p style={{ fontSize: 13, color: C.navy, marginTop: 4 }}>
                  {modal.insuranceCard.benefit}
                </p>
              </div>
              <div
                style={{
                  background: "#FFF7E0",
                  border: `1.5px dashed ${C.gold}`,
                  borderRadius: 10,
                  padding: "10px 14px",
                  fontSize: 12,
                  color: "#8a5a00",
                  fontWeight: 700,
                  marginBottom: 14,
                }}
              >
                📝 Catat di kertas pencatatan masing-masing.
              </div>
              <button
                onClick={onCloseInsurance}
                style={{
                  width: "100%",
                  padding: "13px",
                  border: "none",
                  borderRadius: 12,
                  background: `linear-gradient(135deg,${C.navy},${C.blue})`,
                  color: "white",
                  fontWeight: 900,
                  fontSize: 15,
                  cursor: "pointer",
                  fontFamily: "'Nunito', sans-serif",
                }}
              >
                Lanjutkan ➜
              </button>
            </>
          )}
      </div>
    </div>
  )
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [phase, setPhase] = useState<Phase>("setup")
  const [numPlayers, setNumPlayers] = useState(4) // ← default 4 pemain
  const [names, setNames] = useState<string[]>(["", "", "", "", "", "", ""]) // ← 7 slot
  const [players, setPlayers] = useState<Player[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [diceValue, setDiceValue] = useState(1)
  const [diceRolling, setDiceRolling] = useState(false)
  const [moving, setMoving] = useState(false)
  const [timeLeft, setTimeLeft] = useState(20 * 60)
  const [modal, setModal] = useState<ModalState | null>(null)
  const [log, setLog] = useState<LogEntry[]>([])
  const [challengeDeck, setChallengeDeck] = useState<number[]>([])
  const [insuranceDeck, setInsuranceDeck] = useState<string[]>([])
  const [highlightTile, setHighlightTile] = useState<number | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const playersRef = useRef<Player[]>([])
  useEffect(() => {
    playersRef.current = players
  }, [players])

  const addLog = useCallback((player: string, text: string, note?: string) => {
    setLog((prev) => [{ player, text, note }, ...prev].slice(0, 80))
  }, [])

  // ── Timer ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "playing") return
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!)
          setPhase("ended")
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current!)
  }, [phase])

  // ── Start game ─────────────────────────────────────────────────────────────
  function startGame() {
    const ps: Player[] = Array.from({ length: numPlayers }).map((_, i) => ({
      name: names[i]?.trim() || `Pemain ${i + 1}`,
      color: PLAYER_COLORS[i],
      bg: PLAYER_BG[i],
      position: 0,
      laps: 0,
    }))
    setPlayers(ps)
    setChallengeDeck(shuffle(CHALLENGE_CARDS.map((_, i) => i)))
    setInsuranceDeck(shuffle(INSURANCE_CARDS.map((c) => c.id)))
    setCurrentIdx(0)
    setTimeLeft(20 * 60)
    setLog([
      {
        player: "Sistem",
        text: "Permainan dimulai! Siapkan kertas pencatatan modal virtual.",
      },
    ])
    setPhase("playing")
  }

  // ── Roll dice ──────────────────────────────────────────────────────────────
  function rollDice() {
    if (diceRolling || moving || modal || phase !== "playing") return
    setDiceRolling(true)

    let ticks = 0
    const handle = setInterval(() => {
      setDiceValue(1 + Math.floor(Math.random() * 6))
      ticks++
      if (ticks >= 14) {
        clearInterval(handle)
        const final = 1 + Math.floor(Math.random() * 6)
        setDiceValue(final)
        setDiceRolling(false)
        movePlayer(final)
      }
    }, 70)
  }

  function movePlayer(steps: number) {
    setMoving(true)
    const playerIdx = currentIdx
    const startPos = players[playerIdx].position
    const pName = players[playerIdx].name

    // build path
    const path: number[] = []
    let pos = startPos
    let lapsGained = 0
    for (let i = 0; i < steps; i++) {
      pos = (pos + 1) % TILES.length
      path.push(pos)
      if (pos === 0) lapsGained++
    }
    addLog(
      pName,
      `Lempar dadu: ${steps}. Bergerak ke ${TILES[path[path.length - 1]].name}`,
    )

    let stepIdx = 0
    const stepHandle = setInterval(() => {
      const curPos = path[stepIdx]
      setHighlightTile(curPos)
      setPlayers((prev) => {
        const u = [...prev]
        u[playerIdx] = { ...u[playerIdx], position: curPos }
        return u
      })
      stepIdx++
      if (stepIdx >= path.length) {
        clearInterval(stepHandle)
        // apply laps
        if (lapsGained > 0) {
          setPlayers((prev) => {
            const u = [...prev]
            u[playerIdx] = {
              ...u[playerIdx],
              laps: u[playerIdx].laps + lapsGained,
            }
            return u
          })
        }
        setTimeout(() => {
          setHighlightTile(null)
          setMoving(false)
          resolveTile(playerIdx, path[path.length - 1])
        }, 400)
      }
    }, 320)
  }

  function resolveTile(playerIdx: number, tileIdx: number) {
    const tile = TILES[tileIdx]
    const pName =
      playersRef.current[playerIdx]?.name || `Pemain ${playerIdx + 1}`

    switch (tile.type) {
      case "start":
        addLog(pName, "Melewati START!", "Catat: bonus putaran jika ada")
        advanceTurn()
        break
      case "pos":
        addLog(pName, tile.name, `Catat: ${fmt(tile.amount)}`)
        advanceTurn()
        break
      case "neg":
        addLog(pName, tile.name, `Catat: ${fmt(tile.amount)}`)
        advanceTurn()
        break
      case "donation":
        addLog(
          "Semua Pemain",
          tile.name,
          `Setiap pemain catat: ${fmt(tile.amount)}`,
        )
        advanceTurn()
        break
      case "bankrupt":
        addLog(
          pName,
          "💀 BANKRUPT! Kembali ke Start.",
          "Catat: modal jadi Rp50.000",
        )
        setPlayers((prev) => {
          const u = [...prev]
          u[playerIdx] = { ...u[playerIdx], position: 0 }
          return u
        })
        advanceTurn()
        break
      case "info":
        addLog(
          pName,
          "Cek Risiko Finansialmu!",
          "Scan QR di papan untuk cek profil risiko",
        )
        advanceTurn()
        break
      case "insurance": {
        let deck = [...insuranceDeck]
        if (deck.length === 0) deck = shuffle(INSURANCE_CARDS.map((c) => c.id))
        const cardId = deck[deck.length - 1]
        setInsuranceDeck(deck.slice(0, -1))
        const card = INSURANCE_CARDS.find((c) => c.id === cardId)!
        setModal({ type: "insurance", insuranceCard: card })
        break
      }
      case "challenge": {
        let deck = [...challengeDeck]
        if (deck.length === 0) deck = shuffle(CHALLENGE_CARDS.map((_, i) => i))
        const cardIdx = deck[deck.length - 1]
        setChallengeDeck(deck.slice(0, -1))
        setModal({ type: "challenge", card: CHALLENGE_CARDS[cardIdx] })
        break
      }
    }
  }

  function advanceTurn() {
    setCurrentIdx((prev) => (prev + 1) % players.length)
  }

  function handleInsurance(accept: boolean) {
    const p = players[currentIdx]
    const card = modal?.insuranceCard
    if (accept && card) {
      addLog(
        p.name,
        `🛡️ Mengambil ${card.title}`,
        `Catat: -Rp${card.premium.toLocaleString()} premi. Manfaat: ${card.benefit}`,
      )
      setModal({
        type: "insurance-result",
        insuranceCard: card,
        chosen: { t: "Ya, ambil", bijak: true },
      })
    } else if (card) {
      addLog(p.name, `Memilih tidak membeli ${card.title}.`)
      setModal({
        type: "insurance-result",
        insuranceCard: card,
        chosen: { t: "Tidak ambil", bijak: false },
      })
    } else {
      setModal(null)
      advanceTurn()
    }
  }

  function handleChallenge(optIdx: number) {
    const card = modal!.card!
    const chosen = card.options[optIdx]
    const p = players[currentIdx]
    addLog(
      p.name,
      `🎯 "${card.title}" → "${chosen.t}" (${
        chosen.bijak ? "Bijak ✅" : "Kurang Bijak"
      })`,
    )
    setModal({ type: "challenge-result", card, chosen })
  }

  function handleCloseResult() {
    setModal(null)
    advanceTurn()
  }

  function handleCloseInsuranceResult() {
    // ← TAMBAHKAN INI
    setModal(null)
    advanceTurn()
  }

  // ── Render: setup ──────────────────────────────────────────────────────────
  if (phase === "setup") {
    return (
      <>
        <style>{GLOBAL_CSS}</style>
        <SetupScreen
          numPlayers={numPlayers}
          names={names}
          setNumPlayers={(n) => setNumPlayers(n)}
          setName={(i, v) =>
            setNames((prev) => {
              const n = [...prev]
              n[i] = v
              return n
            })
          }
          onStart={startGame}
        />
      </>
    )
  }

  // ── Render: ended ──────────────────────────────────────────────────────────
  if (phase === "ended") {
    const sorted = [...players].sort((a, b) => b.laps - a.laps)
    return (
      <>
        <style>{GLOBAL_CSS}</style>
        <div
          style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg,#FDE9F1 0%,#EAF1FF 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Nunito',sans-serif",
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: 28,
              padding: "40px 36px",
              maxWidth: 460,
              width: "100%",
              boxShadow: "0 20px 60px rgba(190,24,93,0.15)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 60 }}>🏁</div>
            <h1
              style={{
                color: C.pinkDark,
                fontSize: 32,
                fontWeight: 900,
                marginTop: 8,
                fontFamily: "'Fredoka One',sans-serif",
              }}
            >
              Waktu Habis!
            </h1>
            <p style={{ color: "#8b83a3", fontSize: 14, marginTop: 8 }}>
              Hitung total modal virtual dari kertas pencatatan!
            </p>
            <div style={{ marginTop: 24 }}>
              {sorted.map((p, idx) => (
                <div
                  key={p.name}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 16px",
                    borderRadius: 12,
                    background: idx === 0 ? "#FFF0F6" : "#FAF8FC",
                    border: `2px solid ${idx === 0 ? C.gold : "transparent"}`,
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <div
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        background: p.color,
                      }}
                    />
                    <span style={{ fontWeight: 800 }}>{p.name}</span>
                    {idx === 0 && " 🏆"}
                  </div>
                  <span style={{ fontWeight: 700, color: C.navy }}>
                    🔄 {p.laps} putaran
                  </span>
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                setPhase("setup")
                setNames(["", "", "", "", "", "", ""])
              }}
              style={{
                marginTop: 20,
                width: "100%",
                padding: 14,
                border: "none",
                borderRadius: 14,
                background: `linear-gradient(135deg,${C.pink},${C.pinkDark})`,
                color: "white",
                fontWeight: 900,
                fontSize: 16,
                cursor: "pointer",
                fontFamily: "'Nunito',sans-serif",
              }}
            >
              🔄 Main Lagi
            </button>
          </div>
        </div>
      </>
    )
  }

  // ── Render: playing ────────────────────────────────────────────────────────
  const currentPlayer = players[currentIdx] || players[0]
  const isLow = timeLeft <= 60

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(180deg,#FDE9F1 0%,#EAF1FF 100%)",
          fontFamily: "'Nunito',sans-serif",
          padding: 12,
        }}
      >
        {/* topbar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                fontFamily: "'Fredoka One',sans-serif",
                fontSize: 26,
                color: C.pinkDark,
              }}
            >
              SHE
            </span>
            <span
              style={{
                fontFamily: "'Fredoka One',sans-serif",
                fontSize: 26,
                color: C.navy,
              }}
            >
              -aga
            </span>
            <span style={{ fontSize: 12, color: "#9783b5", fontWeight: 700 }}>
              Journey to Financial Resilience
            </span>
          </div>
          <div
            style={{
              background: isLow ? C.red : C.navy,
              color: "white",
              padding: "7px 20px",
              borderRadius: 99,
              fontWeight: 900,
              fontSize: 16,
              letterSpacing: 1,
              boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
              animation: isLow ? "pulse 1s infinite" : undefined,
            }}
          >
            ⏱ {fmtTime(timeLeft)}
          </div>
        </div>

        {/* main grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 300px",
            gap: 14,
            alignItems: "start",
          }}
        >
          {/* board */}
          <div
            style={{
              background: "white",
              borderRadius: 20,
              padding: 12,
              boxShadow: "0 8px 30px rgba(30,58,138,0.12)",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7,1fr)",
                gridTemplateRows: "repeat(7,1fr)",
                gap: 5,
                aspectRatio: "1/1",
                position: "relative",
              }}
            >
              {TILES.map((tile, i) => (
                <BoardTile
                  key={i}
                  tile={tile}
                  index={i}
                  players={players}
                  highlight={highlightTile === i}
                  currentIdx={currentIdx}
                />
              ))}

              {/* center */}
              <div
                style={{
                  gridRow: "2/7",
                  gridColumn: "2/7",
                  background: "linear-gradient(160deg,#FFF0F6,#EFF3FF)",
                  borderRadius: 14,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  padding: 12,
                  textAlign: "center",
                  border: `2px dashed rgba(236,72,153,0.25)`,
                  position: "relative",
                }}
              >
                {/* SHE-aga brand */}
                <div>
                  <div
                    style={{
                      fontFamily: "'Fredoka One',sans-serif",
                      fontSize: "clamp(20px,3.5vw,36px)",
                      lineHeight: 1,
                    }}
                  >
                    <span style={{ color: C.pinkDark }}>SHE</span>
                    <span style={{ color: C.navy }}>-aga</span>
                  </div>
                  <div
                    style={{
                      fontSize: "clamp(7px,1vw,11px)",
                      color: "#9783b5",
                      fontWeight: 700,
                    }}
                  >
                    Journey to Financial Resilience
                  </div>
                </div>

                {/* sparkles */}
                <div style={{ fontSize: 16, opacity: 0.5 }}>✦ ✧ ✦</div>

                {/* current turn */}
                <div>
                  <div
                    style={{
                      fontSize: "clamp(9px,1.1vw,13px)",
                      fontWeight: 900,
                      color: "#9783b5",
                      letterSpacing: 1,
                    }}
                  >
                    GILIRAN
                  </div>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      background: `${currentPlayer.color}18`,
                      border: `2px solid ${currentPlayer.color}`,
                      color: currentPlayer.color,
                      padding: "4px 14px",
                      borderRadius: 99,
                      fontWeight: 900,
                      fontSize: "clamp(10px,1.3vw,15px)",
                      marginTop: 4,
                    }}
                  >
                    <div
                      style={{
                        width: 9,
                        height: 9,
                        borderRadius: "50%",
                        background: currentPlayer.color,
                        animation: "pawnBob 1s ease-in-out infinite",
                      }}
                    />
                    {currentPlayer.name}
                  </div>
                </div>

                {/* dice + button */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    flexWrap: "wrap",
                    justifyContent: "center",
                  }}
                >
                  <Dice value={diceValue} rolling={diceRolling} />
                  <button
                    onClick={rollDice}
                    disabled={diceRolling || moving || !!modal}
                    style={{
                      padding: "10px 18px",
                      border: "none",
                      borderRadius: 12,
                      background:
                        diceRolling || moving || modal
                          ? "#c4b5d4"
                          : `linear-gradient(135deg,${C.pink},${C.pinkDark})`,
                      color: "white",
                      fontWeight: 900,
                      fontSize: "clamp(11px,1.2vw,14px)",
                      cursor:
                        diceRolling || moving || modal
                          ? "not-allowed"
                          : "pointer",
                      boxShadow:
                        diceRolling || moving || modal
                          ? "none"
                          : `0 6px 16px rgba(190,24,93,0.35)`,
                      transition: "all 0.2s",
                      fontFamily: "'Nunito',sans-serif",
                    }}
                  >
                    {diceRolling
                      ? "🎲 Mengocok..."
                      : moving
                        ? "🚶 Melangkah..."
                        : "🎲 Lempar Dadu"}
                  </button>
                </div>

                <div
                  style={{
                    fontSize: "clamp(8px,1vw,11px)",
                    color: "#8b83a3",
                    fontWeight: 700,
                  }}
                >
                  📍 {TILES[currentPlayer.position].name}
                </div>
                <div
                  style={{
                    fontSize: "clamp(8px,1vw,11px)",
                    color: "#8b83a3",
                    fontWeight: 700,
                  }}
                >
                  🔄 {currentPlayer.laps} putaran
                </div>
              </div>
            </div>
          </div>

          {/* sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* players */}
            <div
              style={{
                background: "white",
                borderRadius: 16,
                padding: "14px 16px",
                boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 900,
                  color: "#9783b5",
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                👥 Pemain
              </div>
              {players.map((p, i) => (
                <div
                  key={p.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 10px",
                    borderRadius: 12,
                    marginBottom: 6,
                    background: i === currentIdx ? `${p.color}14` : "#FAF8FC",
                    border: `2px solid ${
                      i === currentIdx ? p.color : "transparent"
                    }`,
                    transition: "all 0.3s",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    {/* mini pawn */}
                    <div
                      style={{
                        animation:
                          i === currentIdx
                            ? "pawnBob 1s ease-in-out infinite"
                            : undefined,
                      }}
                    >
                      <svg
                        width="18"
                        height="22"
                        viewBox="0 0 26 34"
                        fill="none"
                      >
                        <rect
                          x="8"
                          y="18"
                          width="10"
                          height="10"
                          rx="2"
                          fill={p.color}
                        />
                        <ellipse cx="13" cy="13" rx="7" ry="7" fill={p.color} />
                        <ellipse
                          cx="13"
                          cy="13"
                          rx="4"
                          ry="4"
                          fill="white"
                          opacity="0.25"
                        />
                      </svg>
                    </div>
                    <div>
                      <div
                        style={{ fontWeight: 800, fontSize: 13, color: C.ink }}
                      >
                        {p.name}
                      </div>
                      <div
                        style={{
                          fontSize: 10,
                          color: p.color,
                          fontWeight: 800,
                        }}
                      >
                        {initials(p.name)} · Petak {p.position + 1}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 11,
                        color: C.navy,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {TILES[p.position].icon}{" "}
                      {TILES[p.position].name.slice(0, 12)}
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        color: "#9783b5",
                        fontWeight: 700,
                      }}
                    >
                      🔄 {p.laps}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* log */}
            <div
              style={{
                background: "white",
                borderRadius: 16,
                padding: "14px 16px",
                boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 900,
                  color: "#9783b5",
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                📋 Riwayat
              </div>
              <div style={{ maxHeight: 220, overflowY: "auto" }}>
                {log.slice(0, 40).map((l, i) => (
                  <div
                    key={i}
                    style={{
                      fontSize: 11.5,
                      padding: "5px 0",
                      borderBottom: "1px solid #F1EDF7",
                      lineHeight: 1.4,
                      animation: i === 0 ? "slideIn 0.3s ease-out" : undefined,
                    }}
                  >
                    <b style={{ color: C.pinkDark }}>{l.player}:</b> {l.text}
                    {l.note && (
                      <div
                        style={{
                          color: C.navy,
                          fontWeight: 700,
                          fontSize: 10,
                          marginTop: 2,
                        }}
                      >
                        📝 {l.note}
                      </div>
                    )}
                  </div>
                ))}
                {log.length === 0 && (
                  <div style={{ fontSize: 11.5, color: "#c4b5d4" }}>
                    Belum ada aktivitas.
                  </div>
                )}
              </div>
            </div>

            {/* legend */}
            <div
              style={{
                background: "white",
                borderRadius: 16,
                padding: "14px 16px",
                boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 900,
                  color: "#9783b5",
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                🗺️ Legenda
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 5,
                }}
              >
                {(Object.entries(
                  TILE_STYLES,
                ) as [TileType, typeof TILE_STYLES[TileType]][]).map(
                  ([type, s]) => (
                    <div
                      key={type}
                      style={{ display: "flex", alignItems: "center", gap: 5 }}
                    >
                      <div
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: 3,
                          background: s.labelBg,
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: "#5c5470",
                          textTransform: "capitalize",
                        }}
                      >
                        {type === "pos"
                          ? "Untung"
                          : type === "neg"
                            ? "Rugi"
                            : type}
                      </span>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>

        <p
          style={{
            textAlign: "center",
            color: "#a89fc2",
            fontSize: 10.5,
            marginTop: 12,
          }}
        >
          📝 Board &amp; pion digital — catat semua transaksi di kertas
          pencatatan kalian.
        </p>
      </div>

      {/* modal */}
      {modal && (
        <Modal
          modal={modal}
          player={currentPlayer}
          onInsurance={handleInsurance}
          onChallenge={handleChallenge}
          onCloseResult={handleCloseResult}
          onCloseInsurance={handleCloseInsuranceResult}
        />
      )}
    </>
  )
}

// ── Global CSS (keyframes) ─────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @keyframes diceRoll {
    0%   { transform: rotate(0deg) scale(1); }
    15%  { transform: rotate(-15deg) scale(1.15); }
    30%  { transform: rotate(20deg) scale(0.9); }
    45%  { transform: rotate(-25deg) scale(1.1); }
    60%  { transform: rotate(18deg) scale(0.95); }
    75%  { transform: rotate(-12deg) scale(1.05); }
    90%  { transform: rotate(8deg) scale(0.98); }
    100% { transform: rotate(0deg) scale(1); }
  }

  @keyframes pawnBob {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(-5px); }
  }

  @keyframes pawnMove {
    0%   { transform: translateY(-20px) scale(0.6); opacity: 0; }
    60%  { transform: translateY(4px) scale(1.1); opacity: 1; }
    100% { transform: translateY(0) scale(1); opacity: 1; }
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50%       { transform: scale(1.06); }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  @keyframes slideUp {
    from { opacity: 0; transform: scale(0.9) translateY(24px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }

  @keyframes slideIn {
    from { opacity: 0; transform: translateX(-10px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  * { box-sizing: border-box; }

  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: #F1EDF7; border-radius: 4px; }
  ::-webkit-scrollbar-thumb { background: #EC4899; border-radius: 4px; }

  @media (max-width: 900px) {
    .game-grid { grid-template-columns: 1fr !important; }
  }
`
