// used in tab-accept.tsx and tab-pay.tsx
function Login() {
  return (
    <div className="login">
      <p>Sign in to manage your tab.</p>
      <a className="login__button login__button--discord" href="/api/auth/discord">
        Sign in with Discord
      </a>
      <a className="login__button login__button--microsoft" href="/api/auth/microsoft">
        Sign in with Microsoft (@myumanitoba.ca)
      </a>
    </div>
  );
}

export default Login;
