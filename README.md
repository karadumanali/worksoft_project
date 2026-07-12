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

Kurulum için aşağıdaki araçların bilgisayarında kurulu olması gerekir.

### Git

**Windows:** https://git-scm.com/download/win adresinden indir ve kur.  
**macOS:** `brew install git` veya https://git-scm.com/download/mac  
**Linux:** 
```bash
sudo dpkg --configure -a    # Gerekiyorsa çalıştır
sudo apt update
sudo apt install git
```

### Docker

**Windows / macOS:** https://www.docker.com/products/docker-desktop adresinden Docker Desktop indir ve kur. Kurulum sonrası Docker Desktop'ı başlat ve çalıştığını doğrula.

**Linux:**
```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
newgrp docker
```

> Linux'ta kurulum sonrası terminali yeniden başlat veya `newgrp docker` komutunu çalıştır.


### .NET 8 SDK (migration için)

**Windows / macOS:** https://dotnet.microsoft.com/download/dotnet/8.0 adresinden işletim sistemine uygun paketi indir ve kur.

**Linux (Debian/Ubuntu):**
```bash
sudo dpkg --configure -a    # Gerekiyorsa çalıştır
sudo apt-get update
sudo apt-get install -y dotnet-sdk-8.0
```

Kurulumu doğrula:
```bash
dotnet --version
```

`8.x.x` çıktısı görmelisin.

### dotnet-ef (migration için)

.NET 8 SDK kurulduktan sonra şu komutu çalıştır:

```bash
dotnet tool install --global dotnet-ef --version 8.0.8
export PATH="$PATH:/root/.dotnet/tools"
```

> `export PATH` satırını her terminal açılışında tekrar çalıştırmamak için `~/.bashrc` veya `~/.bash_profile` dosyasına ekle:
> ```bash
> echo 'export PATH="$PATH:/root/.dotnet/tools"' >> ~/.bashrc
> source ~/.bashrc
> ```

Kurulumu doğrula:
```bash
dotnet ef --version
```

`8.0.8` çıktısı görmelisin.

### 1. Repoyu klonla

```bash
git clone https://github.com/karadumanali/worksoft_project.git
cd worksoft_project
```


### 2. Ortam değişkenlerini ayarla

`.env.example` dosyasını kopyala:

**Windows (PowerShell):**
```powershell
copy .env.example .env
```

**macOS / Linux:**
```bash
cp .env.example .env
```

`.env` dosyasını aç ve şu alanları doldur:

```env
MSSQL_SA_PASSWORD=    # Güçlü bir parola belirle (min 8 karakter, büyük/küçük harf, rakam, özel karakter içermeli)
JWT_SECRET_KEY=       # En az 32 karakterlik rastgele bir string
```

### 3. Sistemi ayağa kaldır

```bash
docker compose up --build    # Linux/macOS
docker-compose up --build    # Windows
```


> API servisi MSSQL henüz hazır olmadan başlarsa çökebilir. Bu durumda şunu çalıştır:
> ```bash
> docker compose restart api
> ```

> İlk çalıştırmada Docker image'ları indirilir, bu 5-10 dakika sürebilir. Sonraki başlatmalarda çok daha hızlı olacak.

> MSSQL başlamadan API bağlantı hatası verebilir — bu normaldir, birkaç saniye içinde düzelir.

Tüm servislerin ayağa kalktığını yeni bir terminal açarak şu komutla teyit et :

```bash
docker-compose ps   #windows
docker compose ps   #linux
```

Dört servisin de `Up` durumunda olduğunu görmelisin: `api`, `frontend`, `mssql`, `redis`.

### 4. Veritabanını oluştur (ilk kurulumda)

MSSQL container'ı tamamen ayağa kalktıktan sonra (yaklaşık 30 saniye bekle) yeni bir terminal aç ve şunu çalıştır:

**macOS / Linux:**
```bash
cd src/backend
export PATH="$PATH:$HOME/.dotnet/tools"
export MSSQL_SA_PASSWORD=$(grep MSSQL_SA_PASSWORD ../../.env | cut -d '=' -f2 | tr -d ' ')
export ConnectionStrings__DefaultConnection="Server=localhost,1433;Database=WorksoftTaskTracker;User Id=sa;Password=${MSSQL_SA_PASSWORD};TrustServerCertificate=True;"
dotnet ef database update --project WorksoftTaskTracker.Infrastructure --startup-project WorksoftTaskTracker.API
```

**Windows (PowerShell):**
```powershell
cd src/backend
$MSSQL_SA_PASSWORD = (Get-Content ../.env | Where-Object { $_ -match "^MSSQL_SA_PASSWORD=" }) -replace "^MSSQL_SA_PASSWORD=", ""
$env:ConnectionStrings__DefaultConnection="Server=localhost,1433;Database=WorksoftTaskTracker;User Id=sa;Password=$MSSQL_SA_PASSWORD;TrustServerCertificate=True;"
dotnet ef database update --project WorksoftTaskTracker.Infrastructure --startup-project WorksoftTaskTracker.API
```

> Bu komutlar şifreyi `.env` dosyasından otomatik okur, elle yazmanı gerekmez.

### 5. Admin kullanıcısını oluştur

Migration tamamlandıktan sonra seed data'yı yükle:

**Windows (PowerShell):**
```powershell
docker cp src\backend\seed.sql worksoft_project-mssql-1:/seed.sql
docker exec -it worksoft_project-mssql-1 /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "<.env dosyasındaki MSSQL_SA_PASSWORD>" -No -i /seed.sql
```

**macOS / Linux:**
```bash
docker cp src/backend/seed.sql worksoft_project-mssql-1:/seed.sql
docker exec -it worksoft_project-mssql-1 /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "<.env dosyasındaki MSSQL_SA_PASSWORD>" -No -i /seed.sql
```

> `<.env dosyasındaki MSSQL_SA_PASSWORD>` kısmını `.env` dosyasında belirlediğin şifreyle değiştir.

Başarılı çıktı şöyle görünmeli:

```
(1 rows affected)
(1 rows affected)
```

### 6. Uygulamaya eriş

Tüm adımlar tamamlandıktan sonra aşağıdaki adreslere tarayıcıdan eriş:

| Servis | Adres |
|--------|-------|
| Frontend | http://localhost:3000 |
| API | http://localhost:8080 |
| Swagger | http://localhost:8080/swagger |

### Varsayılan Admin Hesabı

E-posta : admin@worksoft.com
Parola   : password

> İlk girişte parolanızı değiştirmeniz önerilir.

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

Geliştirme yaparken Docker'da sadece MSSQL ve Redis'i çalıştırıp backend ve frontend'i lokalde başlatabilirsin.

### 1. Sadece veritabanı servislerini başlat

```bash
docker-compose up mssql redis -d  #windows
docker compose up mssql redis -d  #linux
```

### 2. Backend'i başlat (hot reload ile)

```bash
cd src/backend/WorksoftTaskTracker.API
dotnet watch run
```

API `http://localhost:8080` adresinde çalışacak.

### 3. Frontend'i başlat (hot reload ile)

Yeni terminal aç:

```bash
cd src/frontend
npm install
npm run dev
```

Frontend `http://localhost:5173` adresinde çalışacak.

> Geliştirme ortamında `appsettings.json`'daki connection string'in `Server=localhost,1433` olduğundan emin ol.