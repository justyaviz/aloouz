import Image from "next/image";

export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,rgba(53,137,255,0.26),transparent_28%),linear-gradient(135deg,#051a34_0%,#0a57b9_52%,#1690f5_100%)] px-6">
      <div className="reveal-up flex w-full max-w-md flex-col items-center rounded-[34px] border border-white/12 bg-white/8 px-8 py-10 text-center text-white backdrop-blur-md loader-glow">
        <div className="loader-glow flex h-24 w-24 items-center justify-center rounded-[30px] bg-white/10">
          <Image
            src="/brand/aloo-mark-light.png"
            alt="aloo"
            width={52}
            height={52}
            priority
            unoptimized
          />
        </div>
        <Image
          src="/brand/aloo-logotype-light.png"
          alt="aloo"
          width={160}
          height={44}
          className="mt-6"
          priority
          unoptimized
        />
        <p className="mt-4 text-sm leading-7 text-white/76">
          mahsulotlar va bannerlar yuklanmoqda
        </p>
        <div className="loader-track mt-6 h-2 w-full overflow-hidden rounded-full bg-white/14">
          <div className="h-full w-1/2 rounded-full bg-white/90" />
        </div>
      </div>
    </main>
  );
}
