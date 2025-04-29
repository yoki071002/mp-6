'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter()

  // called this function when the "Sign in with Google" is clicked
  const login = () => {
    const baseUrl = "https://accounts.google.com/o/oauth2/v2/auth";

    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI!,
      response_type: "code",
      scope: "openid email profile",
      access_type: "offline",
      prompt: "consent",
    });

    router.push(`${baseUrl}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen space-y-4">
      <h1 className="text-4xl font-bold">CS391: OAuth App</h1>
      <button
        onClick={login}
        className="px-6 py-3 bg-teal-100 text-while rounded-lg hover:bg-teal-200"
      >
        Sign in with Google
      </button>
    </div>
  );
}