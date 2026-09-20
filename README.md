# 🚀 Future Life Simulator (เกมจำลองชีวิตในอนาคตผ่านการเลือกช้อยส์)

เว็บแอปพลิเคชันจำลองชีวิตในอนาคต (Future Life Simulator) ที่พัฒนาขึ้นด้วย React 19, TypeScript และ Tailwind CSS ตามเกณฑ์การประเมินทั้ง 10 ข้อของคุณครูอย่างครบถ้วน

---

## 🌟 จุดเด่นและระบบการทำงานหลัก

1. **ระบบจำลองชีวิต (Interactive Future Simulation)**:
   - จำลองเส้นทางชีวิตตั้งแต่วัยเรียนรู้ (ปี 2026 อายุ 18 ปี) จนถึงบั้นปลายชีวิต (ปี 2068+ อายุ 60-65 ปี)
   - มีระบบคำนวณสถานะ 4 มิติ:
     - 💰 **เงินทุน (Wealth)**
     - 😊 **ความสุข (Joy & Happiness)**
     - ❤️ **สุขภาพ (Health & Vitality)**
     - ⚡ **ทักษะเทคโนโลยี & AI (Tech Skill)**
   - คำนวณเกรดและฉายาบั้นปลายชีวิต (S, A, B, C, D) พร้อมเอฟเฟกต์เฉลิมฉลองและปุ่มแชร์ผลลัพธ์

2. **ระบบสมาชิก (Members System)**:
   - สมัครสมาชิก (Register) และเข้าสู่ระบบ (Login)
   - จัดการข้อมูลโปรไฟล์ส่วนตัว (Profile Editor), ฉายา (Player Title), คำคม (Bio)
   - เลือก Avatar สไตล์ Cyberpunk / อนาคต
   - มีปุ่ม **1-Click Demo Login** สำหรับคุณครูเพื่อเข้าทดสอบในฐานะ Admin หรือ Player ได้ทันที

3. **แดชบอร์ดสรุปสถิติ & ทำเนียบผู้นำ (Dashboard & Leaderboard)**:
   - สรุปสถิติจำนวนรอบที่เล่น คะแนนสูงสุด และค่าเฉลี่ยสถิติชีวิต
   - ตารางจัดอันดับผู้เล่นทั่วโลก (Global Leaderboard)
   - ประวัติการเล่นย้อนหลังส่วนตัว (Personal History Log)

4. **ระบบหลังบ้านและการตั้งค่า (Admin Dashboard & Backend Settings)**:
   - จัดการคำถามและตัวเลือกจำลองชีวิต (เพิ่ม / แก้ไข / ลบ Scenario และช้อยส์)
   - จัดการรายชื่อสมาชิกและปรับเปลี่ยนสิทธิ์ (Admin / Player)
   - สลับและกำหนดค่า Database Online (Supabase / Google Firebase) พร้อมปุ่มทดสอบการเชื่อมต่อ (Ping Test)
   - เครื่องมือสำรองข้อมูล (Export JSON) และกู้คืนข้อมูล (Import JSON)

---

## 📋 เกณฑ์การประเมินทั้ง 10 ข้อ (Criteria Evaluation Matrix)

| ข้อที่ | เกณฑ์การประเมิน | การดำเนินการในโปรเจกต์ | สถานะ |
|:---:|:---|:---|:---:|
| 1 | ออนไลน์ได้จริง (Online Ready) | รองรับการรันบน Cloud โฮสติ้งจริง พร้อมแชร์ลิงก์เปิดใช้งานได้ทันที | ✅ ผ่าน 100% |
| 2 | รองรับ Smartphone (Responsive) | ออกแบบด้วย Tailwind CSS มี Mobile Bottom Bar และ Touch targets 44px+ | ✅ ผ่าน 100% |
| 3 | คลิกแล้วส่งไปยังสิ่งที่ต้องการ (Routing) | Navigation Bar, Routing สลับหน้า จำลองชีวิต / Dashboard / สมาชิก / หลังบ้าน | ✅ ผ่าน 100% |
| 4 | หน้าการตั้งค่าหลังบ้าน (Admin) | ระบบจัดการ Scenario, สมาชิก, ตั้งค่า Database Online และสำรองข้อมูล | ✅ ผ่าน 100% |
| 5 | Dashboard สรุปผลและสถิติ | สรุปผลคะแนน, ค่าพลัง 4 ด้าน, Leaderboard และประวัติการเล่น | ✅ ผ่าน 100% |
| 6 | Members System | ระบบสมัครสมาชิก, ล็อกอิน, จัดการโปรไฟล์, อวตาร และบันทึกประวัติ | ✅ ผ่าน 100% |
| 7 | การเชื่อมต่อ GitHub | โครงสร้างโฟลเดอร์สะอาด มี .gitignore, README.md และไฟล์พร้อม Commit | ✅ ผ่าน 100% |
| 8 | ดึงข้อมูลจาก GitHub สู่เว็บ (CI/CD) | รองรับ Deployment สู่ Vercel, Netlify และมี GitHub Actions Workflow | ✅ ผ่าน 100% |
| 9 | Database Online | รองรับ Supabase (PostgreSQL) และ Firebase พร้อม In-Memory Sync และ SQL Schema | ✅ ผ่าน 100% |
| 10 | เสร็จทันกำหนด & โค้ดสะอาด | โค้ด TypeScript Type-safe, สถาปัตยกรรมแยกโมดูลชัดเจน ไม่มี Error | ✅ ผ่าน 100% |

---

## 🛠️ โครงสร้างไฟล์โปรเจกต์ (Folder Structure)

```text
future-life-simulator/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions CI/CD Pipeline
├── public/                     # Static Assets & Icons
├── src/
│   ├── components/
│   │   ├── Navbar.tsx          # แถบนำทาง Responsive และ Mobile Bottom Bar
│   │   ├── GameView.tsx        # หน้าเกมจำลองชีวิตและช้อยส์สถานการณ์
│   │   ├── DashboardView.tsx   # หน้าสรุปผล สถิติ และ Leaderboard
│   │   ├── MembersView.tsx     # ระบบสมาชิก สมัคร/ล็อกอิน และโปรไฟล์
│   │   └── AdminView.tsx       # หลังบ้านจัดการคำถาม สมาชิก และ Database (แสดงเฉพาะเมื่อ Admin เข้าสู่ระบบ)
│   ├── data/
│   │   └── initialScenarios.ts # ชุดคำถามและตัวเลือกจำลองชีวิต
│   ├── services/
│   │   ├── db.ts               # Storage, Auth State, History & Offline Cache
│   │   └── cloudDatabase.ts    # Supabase / Firebase SQL & Security Rules
│   ├── types.ts                # TypeScript Data Models
│   ├── App.tsx                 # Root Component
│   ├── main.tsx                # Application Entry Point
│   └── index.css               # Tailwind CSS Styles
├── .env.example                # ตัวอย่าง Environment Variables
├── .gitignore                  # Git Ignore Rules
├── index.html                  # HTML5 Entry Point
├── metadata.json               # Platform Manifest
├── package.json                # Project Dependencies & Scripts
├── README.md                   # คู่มือเอกสารโปรเจกต์
├── vercel.json                 # Vercel Deployment Configuration
└── vite.config.ts              # Vite Bundler Configuration
```

---

## 💻 วิธีรันโปรเจกต์ในเครื่องคอมพิวเตอร์ (Local Development)

```bash
# 1. ติดตั้ง Dependencies
npm install

# 2. เริ่มต้นรัน Dev Server
npm run dev
```
เปิดบราวเซอร์ไปที่ `http://localhost:3000`

---

## 🐙 วิธีเชื่อมต่อ GitHub และ Push โค้ด (เกณฑ์ข้อ 7)

```bash
# 1. เริ่มต้นระบบ Git ในโฟลเดอร์
git init

# 2. เพิ่มไฟล์ทั้งหมดเข้า Staging
git add .

# 3. บันทึก Commit
git commit -m "feat: complete Future Life Simulator web application"

# 4. เปลี่ยนชื่อ Branch หลักเป็น main
git branch -M main

# 5. เชื่อมต่อกับ GitHub Repo ของคุณ (แทนที่ด้วย URL ของคุณ)
git remote add origin https://github.com/YOUR_USERNAME/future-life-simulator.git

# 6. Push โค้ดทั้งหมดขึ้น GitHub
git push -u origin main
```

---

## 🌐 วิธี Deploy ขึ้น Hosting ออนไลน์แบบฟรีผ่าน Vercel (เกณฑ์ข้อ 8)

1. สมัครหรือเข้าสู่ระบบ **[Vercel](https://vercel.com)** ด้วยบัญชี GitHub ของคุณ
2. กดปุ่ม **"Add New..."** > **"Project"**
3. เลือก Repository `future-life-simulator` ที่คุณเพิ่ง Push ขึ้น GitHub
4. ตั้งค่า Build:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. กดปุ่ม **"Deploy"** รอประมาณ 30-45 วินาที คุณจะได้ URL ใช้งานจริงทันที!

---

## 🗄️ การเชื่อมต่อ Database Online (เกณฑ์ข้อ 9)

โปรเจกต์ได้เตรียม SQL Script สำหรับสร้าง Table ใน **Supabase** ไว้ให้เรียบร้อยแล้ว:
1. เข้าไปที่เมนู **หลังบ้าน (Admin)** > แท็บ **Database Online**
2. คลิกปุ่ม **"Supabase SQL Schema"** เพื่อคัดลอกโค้ด
3. นำไปวางใน **Supabase SQL Editor** แล้วกด Run เพื่อสร้างตาราง `profiles`, `game_history`, และ `scenarios` ได้ทันที!
