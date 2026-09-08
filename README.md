# 🚗 ParkPing — Smart Vehicle QR Scanner & Privacy Masked Contact System

> **The Smart Windshield Tag Every Car Owner Needs** — Protect your car from towing, scratches, and parking disputes. Allow anyone to call or message you via WhatsApp privately without ever revealing your personal phone number.

---

## 🌟 Key Features

### 1. 🛡️ 100% Privacy Protection & Number Masking
- **Zero Number Leak**: Real 10-digit mobile numbers are never displayed to anyone scanning the car tag.
- **Masked Phone Call Relay**: Initiates a private telecom bridge connecting the caller and owner.
- **1-Click WhatsApp Emergency Alerts**: Pre-set instant alerts with pre-filled messages (*"Car Blocking Way"*, *"Lights Left ON"*, *"Window Open"*, *"Alarm Ringing"*, *"Towing Alert"*).

### 2. 🚘 Multi-Car Garage Support
- Generate tags for **1, 2, 3, or more vehicles in a single batch** under one account.
- Supports distinct vehicle registration plates (e.g. `DL 01 AB 1234`, `MH 02 CD 5678`) with either shared family numbers or designated driver numbers.

### 3. 🔄 Dynamic Cloud Updates (Never Reprint)
- If you change your phone number or sell your car, simply update the phone number in your dashboard — **no need to reprint the physical QR sticker!**

### 4. 🖨️ High-Resolution Printable Sticker Badges
- **4 Automotive Themes**: *Amber Neon, Dark Carbon, Cyber Cyan, Clean White*.
- 1-Click **PNG Sticker Download** or **Batch A4 Print Sheet**.
- Automotive grade specs: Waterproof, UV-resistant, and scratch-resistant.

### 5. 🔍 Interactive Windshield & Phone Simulator
- Built-in visual simulator showing how the sticker looks on SUV, Sedan, and EV windshields.
- Interactive smartphone mockup to test what passersby see when scanning your tag.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom glassmorphism & automotive dark theme
- **QR Engine**: `qrcode` canvas & SVG rendering
- **Icons**: Lucide React

---

## 🚀 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/Maanish07/ParkPing.git
cd ParkPing
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 3. Build for Production
```bash
npm run build
npm start
```

---

## 📱 Routes & Architecture

- `/` — Main Landing Page, Generator Studio, Windshield Simulator, and Car Owner Garage
- `/p/:tagId` — Public Passerby Scan Page (Mobile-optimized, masked calling & WhatsApp dispatch)
- `/api/tags` — REST API to list and create tags (single or bulk)
- `/api/tags/:tagId` — REST API to fetch (masked for public), update phone, or delete
- `/api/tags/:tagId/ping` — REST API to dispatch masked calls/messages and log activity
- `/api/logs` — Real-time audit log of scans and pings

---

## 📄 License
MIT License. Built for car owners with ❤️
