'use client';

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

type UserInfo = {
    name: string;
    email: string;
    picture: string;
}

export default function Callback(){
    const searchParams = useSearchParams();
    const code = searchParams.get('code');
    const router = useRouter();

    const [user, setUser] = useState<UserInfo | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        if (!code) {
            setError("No code found in URL. Redirecting...");
            setTimeout(() => {
                router.push("/");
            }, 2000);
            return;
        }

        const fetchUser = async () => {
            try {
                const response = await fetch("/api/exchange", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ code }),
                })

                const data = await response.json();
                console.log('Fetched user info:', data);


                if (data.error) {
                    throw new Error(data.error);
                }

                setUser({
                    name: data.name,
                    email: data.email,
                    picture: data.picture,
                });

            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError("Session expired. Redirecting...");
                } else {
                    console.error(err);
                    setError("Session expired. Redirecting...");
                }

                setTimeout(() => {
                    router.push("/");
                }, 2000);
            }
        };

        fetchUser();
    }, [code, router]);

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-2xl font-bold">{error}</h1>
                <p>Please wait, redirecting to login page...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-2xl font-bold">Loading user information...</h1>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen space-y-4">
            {user.picture && (
                <img
                    src={imgError ? "@/public/profile.png" : user.picture}
                    onError={() => setImgError(true)}
                    alt="Profile"
                    className="w-24 h-24 rounded-full"
                />
            )}
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p>{user.email}</p>
        </div>
    );
}