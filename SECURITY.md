# Güvenlik Politikası (Security Policy)

## Desteklenen Sürümler

| Sürüm | Güvenlik Desteği |
|-------|-----------------|
| main (latest) | Aktif |
| Eski sürümler | Desteklenmez |

## Güvenlik Açığı Bildirme

Bir güvenlik açığı tespit ettiyseniz lütfen aşağıdaki adımları izleyin:

1. Açığı **public issue** olarak açmayın.
2. Doğrudan proje sorumlusuna e-posta gönderin.
3. E-postanızda şunları belirtin:
   - Açığın türü (örn. SQL injection, JWT manipülasyonu)
   - Açığı tetiklemek için adım adım yeniden üretme talimatları
   - Etkilenen endpoint veya bileşen
   - Olası etkisi

## Beklentiler

- Bildiriminiz 48 saat içinde onaylanır.
- Kritik açıklar 7 gün içinde düzeltilmeyi hedefler.
- Bildiren kişi, düzeltme yayınlanmadan önce bilgilendirilir.

---

## Projede Uygulanan Güvenlik Önlemleri

Bu bölüm, uygulamada shift-left yaklaşımıyla tasarım aşamasından itibaren alınan güvenlik kararlarını belgeler.

### Kimlik Doğrulama (Authentication)

- JWT Bearer token kullanılır; token'lar HTTP-only cookie veya Authorization header üzerinden iletilir.
- Şifreler **bcrypt** (cost factor ≥ 12) ile hash'lenerek saklanır, düz metin hiçbir zaman tutulmaz.
- İlk girişteki geçici şifre kullanıcı tarafından değiştirilmek zorundadır.
- Başarılı ve başarısız giriş denemeleri audit log'a yazılır.
- Brute-force koruması: art arda 5 başarısız denemede hesap geçici olarak kilitlenir.

### Yetkilendirme (Authorization)

- Rol bazlı erişim kontrolü (RBAC): Admin, Yönetici, Personel.
- Her API isteği, token'daki role göre sunucu tarafında doğrulanır.
- Personel, yalnızca `/api/tasks/my` ve `/api/tasks/{id}/status` endpoint'lerini kullanabilir.
- Middleware katmanında global authorization policy uygulanır.

### Veri Güvenliği

- Tüm veritabanı sorguları **parametrized query** veya ORM (EF Core) kullanır; SQL injection'a karşı koruma sağlanır.
- CORS policy production'da yalnızca izin verilen origin'lere açıktır.
- HTTPS zorunludur (production); HTTP → HTTPS yönlendirmesi aktif tutulur.
- Hassas yanıt alanları (örn. `passwordHash`) hiçbir API response'unda döndürülmez.

### Secret Yönetimi

- Gerçek değer içeren `.env` dosyası **asla** Git'e commit edilmez.
- `.env.example` şablon olarak commit edilir, içinde gerçek değer bulunmaz.
- Docker Compose ortamında secret'lar environment variable üzerinden enjekte edilir.
- Kaynak kod içinde hard-coded hiçbir şifre, API key veya bağlantı dizesi bulunmaz.

### Loglama

- Tüm authentication ve authorization olayları log'a yazılır.
- Log'lar şifre, token veya kişisel veri içermez.
- Exception handler global seviyede tanımlıdır; kullanıcıya yalnızca genel hata mesajı döner, stack trace döndürülmez.

### Bağımlılık Güvenliği

- NuGet ve npm paketleri güncel tutulur.
- Production build'inde `npm audit` çalıştırılır, yüksek/kritik açıklar giderilmeden deploy yapılmaz.