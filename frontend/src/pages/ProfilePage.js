import { useEffect, useState } from "react";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { api } from "../services/api";

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });
}

function getInitials(email) {
  if (!email) return "?";
  return email.slice(0, 2).toUpperCase();
}

export function ProfilePage() {
  const { token } = useAuth();
  const toast = useToast();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadProfile() {
      try {
        const data = await api.getProfile(token);
        if (mounted) setProfile(data?.profile || data);
      } catch (error) {
        if (mounted) toast.error(error.message || "Failed to load profile");
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    loadProfile();
    return () => { mounted = false; };
  }, [token]);

  if (isLoading) return <LoadingSpinner label="Loading profile" />;

  if (!profile) return (
    <p className="mx-auto max-w-4xl px-4 py-8 font-body text-ink/70 md:px-6">
      No profile data available.
    </p>
  );

  const orderCount = Array.isArray(profile.orders) ? profile.orders.length : 0;
  const wishlistCount = Array.isArray(profile.wishlist) ? profile.wishlist.length : 0;
  const cartCount = Array.isArray(profile.cart) ? profile.cart.length : 0;

  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-8 md:px-6">
      <h1 className="mb-6 font-display text-4xl font-bold text-ink">My Profile</h1>

      {/* Identity card */}
      <div className="mb-4 rounded-3xl border border-moss/10 bg-white/75 p-6">
        {/* Avatar + email */}
        <div className="mb-5 flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-aqua/10 font-display text-xl font-bold text-aqua">
            {getInitials(profile.email)}
          </div>
          <div>
            <p className="font-display text-lg font-bold text-ink">{profile.email}</p>
            <span className="mt-1 inline-block rounded-full bg-green-100 px-3 py-0.5 text-xs font-semibold text-green-700">
              Active account
            </span>
          </div>
        </div>

        {/* Fields */}
        <div className="divide-y divide-ink/10 border-t border-ink/10">
          {[
           
            { label: "Email",        value: profile.email },
            { label: "Phone",        value: profile.phone || "—" },
            { label: "Address",      value: profile.address || "Not provided" },
            { label: "Member since", value: formatDate(profile.createdAt) },
            { label: "Last updated", value: formatDate(profile.updatedAt) },
          ].map(({ label, value, mono }) => (
            <div key={label} className="grid grid-cols-12 py-3">
              <p className="col-span-4 text-xs font-semibold uppercase tracking-wide text-ink/50">
                {label}
              </p>
              <p className={`col-span-8 text-sm text-ink ${mono ? "font-mono text-ink/50" : ""}`}>
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Orders",      count: orderCount },
          { label: "Wishlist",    count: wishlistCount },
          { label: "Cart items",  count: cartCount },
        ].map(({ label, count }) => (
          <div key={label} className="rounded-2xl border border-moss/10 bg-white/75 p-4 text-center">
            <p className="font-display text-3xl font-bold text-ink">{count}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-ink/50">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}