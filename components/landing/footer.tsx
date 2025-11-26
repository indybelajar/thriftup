export function Footer() {
  return (
    <footer className="mt-20 py-8 border-t text-center text-sm text-slate-500">
      <p className="font-medium text-slate-700">ThriftUp</p>

      <div className="flex justify-center gap-4 mt-2 text-slate-600">
        <a href="/products" className="hover:underline">Koleksi</a>
        <a href="/add-product" className="hover:underline">Jual Barang</a>
        <a href="/checkout" className="hover:underline">Checkout</a>
      </div>

      <p className="mt-4">© 2025 ThriftUp. All rights reserved.</p>
    </footer>
  )
}