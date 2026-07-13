import { Toaster } from "react-hot-toast";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

import AppRoutes from "./AppRoutes";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: "Inter, sans-serif",
            fontSize: "14px",
          },
        }}
      />

      <Navbar />

      <main className="flex-1">
        <AppRoutes />
      </main>

      <Footer />
    </div>
  );
}