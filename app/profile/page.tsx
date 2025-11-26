"use client"

import { useState } from "react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

import {
  Dialog,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog"

export default function ProfilePage() {
  const [name, setName] = useState("Sya")
  const [email, setEmail] = useState("user@example.com")
  const [bio, setBio] = useState("Aku user ThriftUp!")

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 space-y-10">

      <section className="flex items-center gap-6">
        <Avatar className="w-20 h-20">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>SY</AvatarFallback>
        </Avatar>

        <div>
          <h1 className="text-2xl font-bold">{name}</h1>
          <p className="text-slate-600">{email}</p>
        </div>
      </section>

      <Separator />

      <Card className="p-6 bg-white space-y-4">
        <h2 className="text-xl font-semibold">Profile Information</h2>

        <p><strong>Name:</strong> {name}</p>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Bio:</strong> {bio}</p>

        <Dialog>
          <DialogTrigger asChild>
            <Button>Edit Profile</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
              <DialogDescription>Update your profile details.</DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
              <div>
                <Label>Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              <div>
                <Label>Email</Label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>

              <div>
                <Label>Bio</Label>
                <Textarea value={bio} onChange={(e) => setBio(e.target.value)} />
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>

      <Separator />

      <section>
        <h2 className="text-xl font-semibold mb-4">Add New Product</h2>

        <Card className="p-6 bg-white space-y-5">
          <div>
            <Label>Product Name</Label>
            <Input placeholder="Contoh: Hoodie Uniqlo" />
          </div>

          <div>
            <Label>Price</Label>
            <Input type="number" placeholder="Contoh: 120000" />
          </div>

          <div>
            <Label>Description</Label>
            <Textarea placeholder="Deskripsi produk..." />
          </div>

          <Button className="w-full">Upload Product</Button>
        </Card>
      </section>
    </div>
  )
}
