# aloo

`aloo` uchun smartfonlar bozori storefront foundation. Loyiha `Next.js 16`, `TypeScript`, `Tailwind CSS 4` va `Prisma` bilan yig'ilgan. Endi unda storefront bilan birga `/admin` boshqaruv paneli ham bor: mahsulot, yangilik va promo bloklarni shu yerda boshqarish mumkin.

## Nimalar tayyor

- Home page uchun merchandizing bloklari, kategoriya shelf'lari va promo hero
- `/catalog` route'i category va brand filter query'lari bilan
- `/product/[slug]` detail sahifasi
- `/admin` route'i orqali product, article va promo CRUD
- `DATABASE_URL` bo'lsa Prisma orqali persistent data, bo'lmasa fallback demo data
- Prisma schema orqali category, brand, product va order foundation
- GitHub Actions orqali `lint + build` tekshiruvi

## Lokal ishga tushirish

```bash
npm install
npm run dev
```

Browser: [http://localhost:3000](http://localhost:3000)

## Environment

`.env.example` faylini `.env` sifatida ko'paytirib, kamida quyidagilarni to'ldiring:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/aloo?schema=public
ADMIN_USERNAME=admin
ADMIN_PASSWORD=alooadmin123
ADMIN_SESSION_SECRET=change-me-for-production
```

## Prisma buyruqlari

```bash
npm run db:generate
npm run db:push
npm run db:studio
```

## GitHub workflow

1. `git init -b main`
2. `git add .`
3. `git commit -m "feat: add aloo storefront foundation"`
4. GitHub'da yangi repo yarating va `origin` ulang
5. `git push -u origin main`

Repository push qilingandan keyin `.github/workflows/ci.yml` avtomatik ravishda build check ishlatadi.

## Admin panel

`/admin` sahifasida quyidagilar boshqariladi:

- Mahsulot qo'shish, tahrirlash va o'chirish
- Homepage hero, `Yangilik shelf'i` va `Tovarlar kuni` flag'lari
- Promo kartalar va yangilik maqolalari
- `imageUrl` orqali real mahsulot rasmlarini chiqarish

Agar `DATABASE_URL` yo'q bo'lsa, panel fallback ma'lumotni ko'rsatadi, lekin saqlash ishlamaydi. To'liq CRUD uchun Railway PostgreSQL ulanishi kerak.

## Railway deploy

Deploy qadamlari:

1. Railway'da yangi project oching.
2. Repo ichida `Dockerfile` va `railway.json` bor, shu sabab deploy bir xil va barqaror container bilan chiqadi.
3. `Deploy from GitHub repo` ni tanlang yoki CLI orqali `railway up --service aloouz-web` qiling.
4. Web service uchun env'larni kiriting: `DATABASE_URL`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`.
5. `NEXT_PUBLIC_SITE_URL` ni production domeningizga teng qo'ying.
6. Alohida PostgreSQL service yarating va uning `DATABASE_URL` qiymatini web service'ga ulang.
7. `npm run db:push` ni Railway shell yoki local CLI orqali bir marta ishga tushiring.
8. Deploy tugagach service ichida `Settings -> Networking -> Public Networking` bo'limiga o'ting.
9. `Generate Domain` bosib vaqtinchalik Railway domain oling.

Asosiy buyruqlar:

```bash
npm run build
npm run start
railway up --service aloouz-web
```

Railway manifest ichida quyidagilar yoqilgan:

- `builder`: `DOCKERFILE`
- `healthcheckPath`: `/api/health`
- `sleepApplication`: `false`
- `overlapSeconds`: `30`

## Custom domain ulash

Railway hujjatlariga ko'ra custom domain ulash uchun:

- `Settings -> Networking -> Public Networking -> + Custom Domain`
- Railway bergan `*.up.railway.app` target qiymatini oling
- DNS provider ichida shu qiymatga CNAME yoki provider qo'llaydigan apex-alias yozuvi qo'ying
- Railway tasdiqlashini kuting, SSL avtomatik beriladi

Manbalar:

- Domains guide: [docs.railway.com/networking/domains/working-with-domains](https://docs.railway.com/networking/domains/working-with-domains)
- Public networking guide: [docs.railway.com/guides/public-networking](https://docs.railway.com/guides/public-networking)

Cloudflare ishlatilsa, Railway domen hujjatida ko'rsatilganidek proxied domenlar uchun SSL/TLS rejimini `Full` qilish kerak.

## Keyingi iteratsiya uchun tavsiya

1. Admin panelga fayl upload yoki media kutubxona qo'shish
2. Checkout, savat va order status oqimini yozish
3. Payment provider va installment API integratsiyasi
4. Search autocomplete va smart filterlarni kuchaytirish
5. Filiallar bo'yicha stock va buyurtma statusi modullarini ulash
