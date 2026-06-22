# Worksoft Mini Task Tracker

Şirket içi görev ve duyuru yönetimi için geliştirilmiş full-stack web uygulaması.

## Teknoloji Stack

| Katman | Teknoloji |
|--------|-----------|
| Backend API | ASP.NET Core 8 Web API |
| Frontend | React 18 + Vite |
| Veritabanı | Microsoft SQL Server 2022 |
| Cache | Redis 7 |
| Container | Docker + Docker Compose |
| Orkestrasyon | Kubernetes (opsiyonel) |
| Auth | JWT Bearer Token |

## Kullanıcı Rolleri

- **Admin** — Kullanıcı oluşturur, rol tanımlar, duyuru yayınlar
- **Yönetici** — Görev oluşturur, atar ve takip eder
- **Personel** — Kendisine atanmış görevleri görür ve durumlarını günceller

## Ön Gereksinimler

Aşağıdaki araçların kurulu olması gerekir:

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (v24+)
- [Docker Compose](https://docs.docker.com/compose/) (v2.20+)
- Git

> Geliştirme ortamı için ek olarak:
> - [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
> - [Node.js](https://nodejs.org/) (v20 LTS)

## Kurulum ve Çalıştırma

### 1. Repoyu klonla

```bash
git clone https://github.com/YOUR_USERNAME/worksoft-task-tracker.git
cd worksoft-task-tracker
```

### 2. Environment dosyasını oluştur

```bash
cp .env.example .env
```

`.env` dosyasını açıp şu alanları mutlaka doldur:

```
MSSQL_SA_PASSWORD=   # En az 8 karakter, büyük/küçük/rakam/özel içermeli
JWT_SECRET_KEY=      # En az 32 karakter rastgele string
```

### 3. Docker Compose ile başlat

```bash
docker compose up --build -d
```

Tüm servisler ayağa kalktıktan sonra:

| Servis | URL |
|--------|-----|
| React Frontend | http://localhost:3000 |
| ASP.NET Core API | http://localhost:8080 |
| Swagger UI | http://localhost:8080/swagger |
| Redis (iç ağ) | redis:6379 |
| MSSQL (iç ağ) | mssql:1433 |

### 4. Veritabanı migration'larını çalıştır

İlk kurulumda:

```bash
docker compose exec api dotnet ef database update
```

### 5. Logları izle

```bash
docker compose logs -f
```

### 6. Durdur

```bash
docker compose down
```

Verileri de sıfırlamak için:

```bash
docker compose down -v
```

## Proje Yapısı

```
worksoft-task-tracker/
├── src/
│   ├── backend/                 # ASP.NET Core Web API
│   │   ├── WorksoftTaskTracker.API/
│   │   ├── WorksoftTaskTracker.Application/
│   │   ├── WorksoftTaskTracker.Domain/
│   │   └── WorksoftTaskTracker.Infrastructure/
│   └── frontend/                # React + Vite
│       ├── src/
│       │   ├── components/
│       │   ├── pages/
│       │   ├── services/
│       │   └── context/
│       └── public/
├── docs/                        # Tasarım dokümanları, ERD, API sözleşmesi
├── k8s/                         # Kubernetes manifest dosyaları (opsiyonel)
├── docker-compose.yml
├── .env.example
├── .gitignore
├── CONTRIBUTING.md
├── SECURITY.md
└── README.md
```

## API Dokümantasyonu

Uygulama ayaktayken Swagger UI üzerinden tüm endpoint'lere erişilebilir:

```
http://localhost:8080/swagger
```

API sözleşmesinin detaylı açıklaması için `docs/API_Dokumani.md` dosyasına bakınız.

## Geliştirme Ortamında Çalıştırma

### Backend (hot reload ile)

```bash
cd src/backend/WorksoftTaskTracker.API
dotnet watch run
```

### Frontend (hot reload ile)

```bash
cd src/frontend
npm install
npm run dev
```

> Not: Geliştirme ortamında MSSQL ve Redis için Docker Compose kullanmaya devam edebilirsin:
> ```bash
> docker compose up mssql redis -d
> ```

## Varsayılan Admin Hesabı

İlk kurulumda seed data ile oluşturulan admin hesabı:

```
E-posta : admin@worksoft.com
Şifre   : Admin1234*  (ilk girişte değiştirmeniz zorunludur)
```

## Kubernetes Kurulumu (Opsiyonel)

```bash
kubectl apply -f k8s/
```

Detaylar için `k8s/README.md` dosyasına bakınız.

## Lisans

Bu proje Worksoft Yazılım staj kapsamında geliştirilmiştir.