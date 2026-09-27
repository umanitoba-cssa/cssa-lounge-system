// used in tab-accept.tsx and tab-pay.tsx
import { useSearchParams } from "react-router-dom";

function Login() {
  const [searchParams] = useSearchParams();
  const error = searchParams.get("error");

  let errorMessage: string | null = null;

  switch (error) {
    case "discord_not_verified":
      errorMessage = "Your Discord account is not verified on our server.";
      break;

    case "invalid_oauth_state":
      errorMessage = "The sign-in request expired. Please try again.";
      break;

    case "discord_sign_in_failed":
      errorMessage = "Discord sign-in failed. Please try again or contact the CSSA about this issue.";
      break;
  }

  return (
    <div className="login">
      <p>Sign in to manage your tab.</p>

      {errorMessage && (
        <div className="login__error">
          {errorMessage}
        </div>
      )}

      <a
        className="login__button login__button--discord"
        href="/api/auth/discord"
      >
        Sign in with Discord
      </a>

      <a
        className="login__button login__button--microsoft"
        href="/api/auth/microsoft"
      >
        Sign in with Microsoft (@myumanitoba.ca)
      </a>
    </div>
  );
}

export default Login;
