import { Card } from "@/components/ui/card"

export default function UserProductCard({ product }: any) {
  return (
    <Card className="p-4 space-y-3">
      <img
        src={product.image}
        className="w-full h-40 object-cover rounded-lg"
        alt={product.name}
      />

      <h3 className="text-lg font-semibold">{product.name}</h3>
      <p className="text-sm text-muted-foreground">Rp {product.price}</p>

      <p className="text-sm">{product.description}</p>
    </Card>
  )
}
