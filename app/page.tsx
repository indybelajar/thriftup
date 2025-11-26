import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Footer } from "@/components/landing/footer"

export default function Home() {
  return (
    <>
      <main className="space-y-20">
        {/* HERO */}
        <section className="text-center py-20">
          <h1 className="text-4xl font-bold max-w-2xl mx-auto">
            Belanja Thrift Premium Dengan Mudah & Hemat ♻️
          </h1>
          <p className="text-slate-600 mt-3 max-w-xl mx-auto">
            Temukan barang-barang preloved berkualitas, aman, dan terkurasi.
          </p>

          <div className="mt-6 flex justify-center gap-4">
            <Button size="lg" asChild>
              <a href="/products">Lihat Koleksi</a>
            </Button>

            <Button variant="outline" size="lg" asChild>
              <a href="/add-product">Jual Barang</a>
            </Button>
          </div>
        </section>

        {/* PREVIEW 3 PRODUK */}
        <section className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 px-6 max-w-5xl mx-auto">
          <Card className="h-48 bg-slate-200" />
          <Card className="h-48 bg-slate-200" />
          <Card className="h-48 bg-slate-200" />
        </section>

        {/* CTA BAWAH */}
        <section className="text-center py-16 bg-white rounded-2xl shadow-sm border mt-20">
          <h2 className="text-3xl font-semibold">
            Siap mulai thrifting?
          </h2>

          <p className="text-slate-600 mt-2 max-w-md mx-auto">
            Jelajahi ratusan barang preloved yang menunggu pemilik baru.
          </p>

          <Button size="lg" className="mt-6" asChild>
            <a href="/products">Mulai Belanja</a>
          </Button>
        </section>
      </main>

      {/* FOOTER */}
      <Footer />
    </>
  )
}
