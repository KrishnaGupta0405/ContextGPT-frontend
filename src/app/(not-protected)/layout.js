import NavigationMenuDemo from "@/components/navbar";
import Footer from "@/components/footer/Footer";
import "./not-protected.css";

export default function NotProtectedLayout({ children }) {
  return (
    <div className="not-protected-layout">
      <NavigationMenuDemo />
      {children}
      <Footer />
    </div>
  );
}
