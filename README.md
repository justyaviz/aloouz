# aloo

`aloo` uchun smartfonlar bozori storefront foundation. Loyiha `Next.js 16`, `TypeScript`, `Tailwind CSS 4` va `Prisma` bilan yig'ilgan. Hozircha demo data bilan ishlaydi, lekin structure real katalog va Railway PostgreSQL ulash uchun tayyor.

## Nimalar tayyor

- Home page uchun merchandizing bloklari, kategoriya shelf'lari va promo hero
- `/catalog` route'i category va brand filter query'lari bilan
- `/product/[slug]` detail sahifasi
- Railway uchun `standalone` build konfiguratsiyasi
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

## Railway deploy

Railway'ning rasmiy `Deploy a Next.js App` qo'llanmasiga ko'ra, GitHub repo orqali deploy qilishda `output: "standalone"` va standalone serverni ishga tushiradigan `start` script kerak bo'ladi. Shu ikkisi loyihada allaqachon yoqilgan:

- Railway Next.js guide: [docs.railway.com/guides/nextjs](https://docs.railway.com/guides/nextjs)
- GitHub autodeploy guide: [docs.railway.com/deployments/github-autodeploys](https://docs.railway.com/deployments/github-autodeploys)

Deploy qadamlari:

1. Railway'da yangi project oching.
2. `Deploy from GitHub repo` ni tanlang.
3. Shu repository'ni ulang.
4. Deploy tugagach service ichida `Settings -> Networking -> Public Networking` bo'limiga o'ting.
5. `Generate Domain` bosib vaqtinchalik Railway domain oling.
6. Xohlasangiz `Wait for CI` ni yoqing, shunda Railway GitHub Actions muvaffaqiyatli tugashini kutadi.

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

1. Real product CRUD uchun admin panel qo'shish
2. Railway PostgreSQL service ochib `DATABASE_URL` ni ulash
3. Prisma orqali demo datani seed qilish
4. Checkout, savat va order status oqimini yozish
5. Payment provider va installment API integratsiyasi
