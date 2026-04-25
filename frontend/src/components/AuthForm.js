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
      className="mx-auto w-full max-w-md animate-rise rounded-3xl border border-ink/10 bg-white/80 p-8 shadow-soft backdrop-blur"
    >
      <h1 className="mb-6 font-display text-3xl font-bold text-ink">{title}</h1>
      {Array.isArray(fields) && fields.length === 0 && (
        <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          Form configuration is missing. Please refresh the page.
        </p>
      )}
      <div className="space-y-4">
        {Array.isArray(fields) && fields.map((field) => (
          <label key={field.name} className="block">
            <span className="mb-1 block font-body text-sm font-semibold text-ink/80">{field.label}</span>
            <input
              type={field.type}
              name={field.name}
              value={formValues[field.name]}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-ink/15 bg-clay/60 px-4 py-2 font-body text-sm text-ink outline-none transition focus:border-aqua"
            />
          </label>
        ))}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 w-full rounded-xl bg-ink py-2.5 font-display text-base font-semibold text-clay transition hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Please wait..." : submitLabel}
      </button>
      {footer && <div className="mt-4 font-body text-sm text-ink/80">{footer}</div>}
    </form>
  );
}
