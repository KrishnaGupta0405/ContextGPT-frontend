import Navbar from "@/components/navbar";

export default function NotProtectedLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
