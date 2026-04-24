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
      if (!data?.token) {
        throw new Error("Token missing from login response");
      }
      login(data.token);
      toast.success("Logged in successfully");
      navigate(fromPath, { replace: true });
    } catch (error) {
      toast.error(error.message || "Login failed");
      throw error;
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
            No account yet? <Link className="font-semibold text-aqua" to="/register">Register</Link>
          </p>
        }
      />
    </section>
  );
}
