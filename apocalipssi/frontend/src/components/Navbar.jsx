import { Link, useLocation } from "react-router-dom"
import { LogIn } from "lucide-react"

const Navbar = () => {
  // Simulation d'état d'authentification – à remplacer par votre vraie logique
  const isAuthenticated = false
  const location = useLocation()

  const navStyle = {
    position: "sticky",
    top: 0,
    zIndex: 1000,
    background: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
    padding: "1rem 2rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 8px 20px -10px rgba(0, 0, 0, 0.1)"
  }

  const logoStyle = {
    fontSize: "1.75rem",
    fontWeight: "bold",
    background: "linear-gradient(90deg, #4f46e5, #7c3aed)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textDecoration: "none",
    letterSpacing: "0.05em"
  }

  const navMenuStyle = {
    display: "flex",
    alignItems: "center",
    gap: "1.5rem"
  }

  const linkStyle = (path) => ({
    color: location.pathname === path ? "#4f46e5" : "#1f2937",
    fontWeight: location.pathname === path ? "700" : "500",
    textDecoration: "none",
    fontSize: "1rem",
    transition: "all 0.3s ease",
    padding: "0.5rem 1rem",
    borderRadius: "0.75rem",
    background: location.pathname === path
      ? "rgba(99, 102, 241, 0.1)"
      : "transparent",
  })

  const loginButtonStyle = {
    display: "flex",
    alignItems: "center",
    background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
    color: "white",
    fontWeight: 600,
    padding: "0.5rem 1.25rem",
    borderRadius: "0.75rem",
    textDecoration: "none",
    fontSize: "1rem",
    boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.3)",
    transition: "all 0.3s ease"
  }

  return (
    <nav style={navStyle}>
      <Link to="/" style={logoStyle}>
        APOCALIPSSI
      </Link>

      <div style={navMenuStyle}>
        <Link to="/" style={linkStyle("/")}>
          Accueil
        </Link>
        <Link to="/upload" style={linkStyle("/upload")}>
          Formulaire
        </Link>
        <Link to="/documents" style={linkStyle("/documents")}>
          Documents
        </Link>

        {!isAuthenticated && (
          <Link to="/auth" style={loginButtonStyle}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)'
              e.target.style.boxShadow = '0 15px 30px -5px rgba(99, 102, 241, 0.4)'
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0px)'
              e.target.style.boxShadow = '0 10px 25px -5px rgba(99, 102, 241, 0.3)'
            }}
          >
            <LogIn size={18} style={{ marginRight: "0.5rem" }} />
            Connexion
          </Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar
