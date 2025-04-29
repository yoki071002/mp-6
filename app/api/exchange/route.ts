export async function POST(request: Request) {
  const { code } = await request.json();

  if (!code) {
    return Response.json({ error: "No code found" }, { status: 200 });
  }

  try {
    // Fetch 1: retrieve access token using authorization code from OAuth provider
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI!,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error("Google Token Error:", errorData);
      return Response.json({ error: "Failed to obtain access token" }, { status: 200 });
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      return Response.json({ error: "No access token received" }, { status: 200 });
    }

    // Fetch 2: exchange access token for user profile data between server and OAuth provider
    const userResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!userResponse.ok) {
      const userErrorData = await userResponse.json();
      console.error("Google Userinfo Error:", userErrorData);
      return Response.json({ error: "Failed to fetch user profile" }, { status: 200 });
    }

    const userData = await userResponse.json();
    console.log("Google UserData:", userData);

    return Response.json({
      name: userData.name,
      email: userData.email,
      picture: userData.picture,
    });

  } catch (error) {
    console.error("OAuth error:", error);
    return Response.json({ error: "OAuth flow failed" }, { status: 200 });
  }
}
