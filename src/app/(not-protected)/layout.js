import NavigationMenuDemo from "@/components/navbar";

export default function NotProtectedLayout({ children }) {
  return (
    <>
      <NavigationMenuDemo />
      {children}
    </>
  );
}
