import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { api } from "../services/api";

export function CreateProductPage() {
  const { token } = useAuth();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    desc: "",
    type: "",
    unit: 1,
    price: "",
    suplier: "",
    banner: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = { ...form, unit: Number(form.unit), price: Number(form.price), available: true };
      await api.createProduct(token, payload);
      toast.success("Product created successfully!");
      setForm({ name: "", desc: "", type: "", unit: 1, price: "", suplier: "", banner: "" });
    } catch (error) {
      toast.error(error.message || "Failed to create product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-8 md:px-6">
      <div className="mb-10 text-center">
        <h1 className="font-display text-4xl font-bold text-ink">Add New Product</h1>
        <p className="mt-2 text-ink/70">Create a new item in the catalog dynamically.</p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-3xl bg-white p-8">
        <div className="grid gap-6 md:grid-cols-2">
          <label className="block">
            <span className="mb-1 block font-display text-sm font-bold text-ink/70">Name</span>
            <input name="name" value={form.name} onChange={handleChange} required className="w-full rounded-xl border border-ink/10 bg-gray-50 px-4 py-3 font-body text-sm text-ink outline-none transition focus:border-moss focus:ring-1 focus:ring-moss" />
          </label>
          <label className="block">
            <span className="mb-1 block font-display text-sm font-bold text-ink/70">Category (Type)</span>
            <input name="type" value={form.type} onChange={handleChange} required className="w-full rounded-xl border border-ink/10 bg-gray-50 px-4 py-3 font-body text-sm text-ink outline-none transition focus:border-moss focus:ring-1 focus:ring-moss" />
          </label>
          <label className="block md:col-span-2">
            <span className="mb-1 block font-display text-sm font-bold text-ink/70">Description</span>
            <textarea name="desc" value={form.desc} onChange={handleChange} required rows={3} className="w-full rounded-xl border border-ink/10 bg-gray-50 px-4 py-3 font-body text-sm text-ink outline-none transition focus:border-moss focus:ring-1 focus:ring-moss" />
          </label>
          <label className="block">
            <span className="mb-1 block font-display text-sm font-bold text-ink/70">Price ($)</span>
            <input type="number" step="0.01" name="price" value={form.price} onChange={handleChange} required className="w-full rounded-xl border border-ink/10 bg-gray-50 px-4 py-3 font-body text-sm text-ink outline-none transition focus:border-moss focus:ring-1 focus:ring-moss" />
          </label>
          <label className="block">
            <span className="mb-1 block font-display text-sm font-bold text-ink/70">Unit</span>
            <input type="number" name="unit" value={form.unit} onChange={handleChange} required className="w-full rounded-xl border border-ink/10 bg-gray-50 px-4 py-3 font-body text-sm text-ink outline-none transition focus:border-moss focus:ring-1 focus:ring-moss" />
          </label>
          <label className="block">
            <span className="mb-1 block font-display text-sm font-bold text-ink/70">Supplier</span>
            <input name="suplier" value={form.suplier} onChange={handleChange} required className="w-full rounded-xl border border-ink/10 bg-gray-50 px-4 py-3 font-body text-sm text-ink outline-none transition focus:border-moss focus:ring-1 focus:ring-moss" />
          </label>
          <label className="block md:col-span-2">
            <span className="mb-1 block font-display text-sm font-bold text-ink/70">Banner Image URL</span>
            <input name="banner" value={form.banner} onChange={handleChange} className="w-full rounded-xl border border-ink/10 bg-gray-50 px-4 py-3 font-body text-sm text-ink outline-none transition focus:border-moss focus:ring-1 focus:ring-moss" />
          </label>
        </div>
        <div className="mt-8">
          <button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-moss py-4 font-display text-lg font-bold text-white shadow-lg shadow-moss/30 transition hover:bg-moss/90 disabled:opacity-70">
            {isSubmitting ? "Creating..." : "Create Product"}
          </button>
        </div>
      </form>
    </section>
  );
}
