import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="page" style={{ textAlign: "center" }}>
      <h1 style={{ fontSize: 22, marginBottom: 8 }}>Page not found</h1>
      <Link to="/" className="btn btn-sm" style={{ display: "inline-flex", marginTop: 12 }}>
        Go home
      </Link>
    </div>
  );
}
