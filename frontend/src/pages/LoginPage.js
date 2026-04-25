// pages/LoginPage.jsx
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { AuthForm } from "../components/AuthForm";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { api } from "../services/api";

export function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const fromPath = location.state?.from?.pathname || "/";

  if (isAuthenticated) {
    return <Navigate to={fromPath} replace />;
  }

  const handleLogin = async ({ email, password }) => {
    try {
      const data = await api.login({ email, password });

      // fixed: backend returns { id, token } after FormateData unwrap in api.js
      // previously checked data?.token but data was still wrapped as { data: { token } }
      if (!data?.token) {
        throw new Error("Login failed. Please try again.");
      }

      login(data.token);
      toast.success("Logged in successfully");
      navigate(fromPath, { replace: true });
    } catch (error) {
      toast.error(error.message || "Login failed");
      throw error; // re-throw so AuthForm can handle loading/error state
    }
  };

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6">
      <AuthForm
        title="Welcome back"
        submitLabel="Login"
        fields={[
          { name: "email", label: "Email", type: "email" },
          { name: "password", label: "Password", type: "password" },
        ]}
        onSubmit={handleLogin}
        footer={
          <p>
            No account yet?{" "}
            <Link className="font-bold text-moss transition hover:text-moss/80" to="/register">
              Register
            </Link>
          </p>
        }
      />
    </section>
  );
}