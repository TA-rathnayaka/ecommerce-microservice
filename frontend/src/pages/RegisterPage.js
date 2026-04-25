import { Link, useNavigate } from "react-router-dom";
import { AuthForm } from "../components/AuthForm";
import { useToast } from "../context/ToastContext";
import { api } from "../services/api";

export function RegisterPage() {
  const navigate = useNavigate();
  const toast = useToast();

  const handleRegister = async ({ email, password, phone }) => {
    try {
      await api.signup({ email, password, phone });
      toast.success("Account created. Please log in.");
      navigate("/login");
    } catch (error) {
      toast.error(error.message || "Registration failed");
      throw error;
    }
  };

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6">
      <AuthForm
        title="Create account"
        submitLabel="Register"
        fields={[
          { name: "email", label: "Email", type: "email" },
          { name: "password", label: "Password", type: "password" },
          { name: "phone", label: "Phone", type: "tel" },
        ]}
        onSubmit={handleRegister}
        footer={
          <p>
            Already registered? <Link className="font-bold text-moss transition hover:text-moss/80" to="/login">Go to login</Link>
          </p>
        }
      />
    </section>
  );
}
