'use client'; // Ensure this is the first line in the file

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation"; // Import from next/navigation instead of next/router
import { useEffect, useState } from "react";
import Login from "./Login";
import { app } from "./config";

export default function Home() {
  const router = useRouter();
  const auth = getAuth(app);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !router.isReady) return;

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/dashboard");
      }
    });

    return () => unsubscribe();
  }, [auth, isClient, router.isReady]);

  if (!isClient) {
    return null;
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-12">
      <h1 className="text-4xl font-bold mb-10">Firebase Otp Sign-in</h1>
      <Login />
    </main>
  );
}
