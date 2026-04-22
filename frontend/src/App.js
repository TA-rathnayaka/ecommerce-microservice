import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login } from "./pages";
import { Home } from "./pages";
import { Header } from "./components";
import { ProductDetails } from "./pages/ProductDetail";
import { ToastProvider } from "./utils/toast";

function App() {
  return (
    <ToastProvider>
      <div className="app-root">
        <BrowserRouter>
          <Header />
          <main className="page-wrapper">
            <Routes>
              <Route path="/details/:id" element={<ProductDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Home />} />
            </Routes>
          </main>
        </BrowserRouter>
      </div>
    </ToastProvider>
  );
}

export default App;
