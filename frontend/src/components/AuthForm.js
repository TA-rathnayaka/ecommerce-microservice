import { useState } from "react";

export function AuthForm({ title, submitLabel, fields = [], onSubmit, footer }) {
  const [formValues, setFormValues] = useState(
    Array.isArray(fields)
      ? fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {})
      : {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formValues);
    } catch {
 
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-md animate-rise rounded-3xl bg-white p-8"
    >
      <div className="mb-6 text-center">
        <span className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-moss/10 text-2xl">
          🌱
        </span>
        <h1 className="font-display text-3xl font-bold text-ink">{title}</h1>
      </div>
      {Array.isArray(fields) && fields.length === 0 && (
        <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          Form configuration is missing. Please refresh the page.
        </p>
      )}
      <div className="space-y-4">
        {Array.isArray(fields) && fields.map((field) => (
          <label key={field.name} className="block">
            <span className="mb-1 block font-display text-sm font-bold text-ink/70">{field.label}</span>
            <input
              type={field.type}
              name={field.name}
              value={formValues[field.name]}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-ink/10 bg-gray-50 px-4 py-3 font-body text-sm text-ink outline-none transition focus:border-moss focus:ring-1 focus:ring-moss"
            />
          </label>
        ))}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 w-full rounded-xl bg-moss py-3.5 font-display text-lg font-bold text-white shadow-lg shadow-moss/30 transition hover:bg-moss/90 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Please wait..." : submitLabel}
      </button>
      {footer && <div className="mt-6 text-center font-body text-sm text-ink/70">{footer}</div>}
    </form>
  );
}
