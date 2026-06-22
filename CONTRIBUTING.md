# Katkı Rehberi (Contributing Guide)

## Branch Stratejisi

```
main          ← production-ready, korumalı
└── dev       ← aktif geliştirme, buradan PR açılır
    ├── feature/auth
    ├── feature/tasks
    ├── feature/announcements
    ├── feature/dashboard
    ├── feature/users
    ├── fix/login-redirect
    └── chore/docker-compose-setup
```

### Kurallar

- `main` branch'ine direkt push yapılmaz. Sadece `dev`'den merge alır.
- Her yeni özellik için `dev`'den branch açılır.
- Branch isimleri: `feature/`, `fix/`, `chore/`, `docs/`, `refactor/` prefixlerinden biriyle başlar.
- Branch adlarında küçük harf ve tire (`-`) kullanılır, boşluk kullanılmaz.

## Commit Mesajı Formatı

[Conventional Commits](https://www.conventionalcommits.org/) standardı kullanılır:

```
<type>(<scope>): <kısa açıklama>

[opsiyonel gövde]

[opsiyonel footer]
```

### Tip Listesi

| Tip | Kullanım |
|-----|----------|
| `feat` | Yeni özellik |
| `fix` | Hata düzeltme |
| `docs` | Sadece dokümantasyon |
| `style` | Format, boşluk (işlevsel değişiklik yok) |
| `refactor` | Yeniden yapılandırma (özellik eklemez, hata düzeltmez) |
| `test` | Test ekleme veya düzeltme |
| `chore` | Build süreci, bağımlılık güncellemesi |
| `ci` | CI/CD konfigürasyon değişiklikleri |

### Örnekler

```
feat(auth): JWT login endpoint'i ekle
fix(tasks): görev silme sonrası liste güncellenmiyordu
docs(readme): docker kurulum adımları güncellendi
chore(docker): redis volume ayarı eklendi
refactor(users): repository katmanı ayrıldı
```

## Pull Request Kuralları

1. Her PR tek bir konuya odaklanır.
2. PR açmadan önce `dev` branch'ini kendi branch'inle merge et.
3. PR açıklamasına ne değiştiğini ve neden değiştiğini yaz.
4. Eğer bir issue'ya atıfta bulunuyorsa `Closes #42` formatında belirt.

## Kod Standartları

### Backend (C#)

- Method ve property isimleri: `PascalCase`
- Local değişkenler: `camelCase`
- Private field'lar: `_camelCase`
- Her public method için XML doc comment (`///`) yazılır.
- Controller'lar ince tutulur, iş mantığı `Service` katmanına taşınır.

### Frontend (React / TypeScript)

- Component isimleri: `PascalCase`
- Dosya isimleri: `PascalCase.tsx` (componentler), `camelCase.ts` (yardımcı)
- API çağrıları `services/` klasöründe toplanır, component içinde `fetch`/`axios` çağrısı yapılmaz.
- Her component kendi klasöründe: `ComponentName/index.tsx`

## Yerel Kurulum

Geliştirme ortamı kurulumu için [README.md](README.md) dosyasına bakınız.