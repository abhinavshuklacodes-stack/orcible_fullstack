import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div className="topbar">
      <Logo size={24} />
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button className="btn btn-sm">Upgrade</button>
        {user && (
          <button className="btn btn-sm btn-ghost" onClick={handleLogout}>
            Log out
          </button>
        )}
        <ThemeToggle />
      </div>
    </div>
  );
}
