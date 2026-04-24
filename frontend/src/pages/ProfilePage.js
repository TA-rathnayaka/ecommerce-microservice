import { useEffect, useState } from "react";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { api } from "../services/api";

export function ProfilePage() {
  const { token } = useAuth();
  const toast = useToast();

  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      try {
        setIsLoading(true);
        const data = await api.getProfile(token);
        if (mounted) {
          setProfile(data?.profile || data);
        }
      } catch (error) {
        toast.error(error.message || "Failed to load profile");
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadProfile();
    return () => {
      mounted = false;
    };
  }, [token, toast]);

  if (isLoading) {
    return <LoadingSpinner label="Loading profile" />;
  }

  if (!profile) {
    return <p className="mx-auto max-w-6xl px-4 py-8 font-body text-ink/70 md:px-6">No profile data available.</p>;
  }

  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-8 md:px-6">
      <h1 className="mb-5 font-display text-4xl font-bold text-ink">My Profile</h1>
      <div className="rounded-3xl border border-ink/10 bg-white/75 p-6 shadow-soft">
        {Object.entries(profile).map(([key, value]) => (
          <div key={key} className="grid grid-cols-12 border-b border-ink/10 py-2 last:border-none">
            <p className="col-span-4 font-body text-sm font-semibold uppercase tracking-wide text-ink/60">{key}</p>
            <p className="col-span-8 font-body text-sm text-ink">{String(value)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
