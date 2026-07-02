# Worksoft Task Tracker

Worksoft şirketi bünyesinde staj kapsamında geliştirilen şirket içi görev ve duyuru yönetim sistemi.

## Teknolojiler

**Backend:** ASP.NET Core 8, Entity Framework Core, MSSQL, Redis  
**Frontend:** React 18, Vite, Material UI  
**Altyapı:** Docker, Docker Compose, Kubernetes  

## Kullanıcı Rolleri

| Rol | Yetkiler |
|-----|----------|
| Admin | Tüm işlemler — kullanıcı, görev, duyuru yönetimi, dashboard |
| Yönetici | Görev oluşturma/düzenleme, duyuru görüntüleme, dashboard |
| Personel | Sadece kendi görevlerini görme ve durum güncelleme |

## Kurulum

### Gereksinimler

- Docker Desktop
- .NET 8 SDK (migration için)
- Node.js 20+ (frontend geliştirme için)

### 1. Repoyu klonla

```bash
git clone <repo-url>
cd worksoft_project
```

### 2. Sistemi ayağa kaldır

```bash
docker-compose up --build
```

### 3. Migration çalıştır (ilk kurulumda)

```bash
cd src/backend
dotnet ef database update --project WorksoftTaskTracker.Infrastructure --startup-project WorksoftTaskTracker.API
```

> Not: Migration öncesi `appsettings.json`'da connection string'i geçici olarak `Server=localhost,1433` olarak değiştir, migration sonrası `Server=mssql,1433`'e geri al.

### 4. Admin kullanıcısını oluştur

`src/backend/seed.sql` dosyasını çalıştır:

```bash
docker cp src/backend/seed.sql worksoft_project-mssql-1:/seed.sql
docker exec -it worksoft_project-mssql-1 /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "<SA_PASSWORD>" -No -i /seed.sql
```

### 5. Uygulamaya eriş

| Servis | Adres |
|--------|-------|
| Frontend | http://localhost:3000 |
| API | http://localhost:5000 |
| Swagger | http://localhost:5000/swagger |

### Varsayılan Admin Hesabı

E-posta : admin@worksoft.com
Şifre   : password

## Proje Yapısı

worksoft_project/
├── src/
│   ├── backend/
│   │   ├── WorksoftTaskTracker.Domain/       # Entity'ler
│   │   ├── WorksoftTaskTracker.Application/  # Interface'ler ve DTO'lar
│   │   ├── WorksoftTaskTracker.Infrastructure/ # EF Core, Repository, Redis
│   │   └── WorksoftTaskTracker.API/          # Controller'lar, Middleware
│   └── frontend/                             # React + MUI
├── k8s/                                      # Kubernetes manifest'leri
├── docker-compose.yml
└── README.md



## Güvenlik

- Şifreler BCrypt ile hash'lenerek saklanır
- JWT Bearer token ile kimlik doğrulama
- Rol bazlı yetkilendirme (Admin, Yönetici, Personel)
- Global exception handler (stack trace gizleme)
- Server-side input validation
- EF Core parametrize sorgular (SQL injection koruması)
- Generic login hata mesajı (kullanıcı adı enumeration koruması)

## Geliştirme Ortamı

### Backend

```bash
cd src/backend/WorksoftTaskTracker.API
dotnet watch run
```

### Frontend

```bash
cd src/frontend
npm install
npm run dev
```