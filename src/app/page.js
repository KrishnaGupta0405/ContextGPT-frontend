// This is the root page of the app "/"
import NavigationMenuDemo from "@/components/navbar";
import Landing from "./(not-protected)/landing/page";
export default function Home() {
  return (
    <>
      <NavigationMenuDemo /> <Landing />
    </>
  );
}
