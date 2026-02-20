import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.brand}>
        <Link to="/" style={styles.brandLink}>Support Desk Lite</Link>
      </div>
      <div style={styles.links}>
        {user && (
          <>
            <span style={styles.welcome}>Hello, {user.name}</span>
            <Link to="/" style={styles.link}>Tickets</Link>
            {user.role !== "customer" && (
              <span style={styles.role}>[{user.role}]</span>
            )}
            <button onClick={handleLogout} style={styles.button}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "darkslategray",
    color: "white"
  },
  brand: {
    fontSize: "20px",
    fontWeight: "bold"
  },
  brandLink: {
    color: "white",
    textDecoration: "none"
  },
  links: {
    display: "flex",
    alignItems: "center",
    gap: "15px"
  },
  welcome: {
    color: "lightgray"
  },
  link: {
    color: "white",
    textDecoration: "none"
  },
  role: {
    color: "orange",
    fontSize: "12px"
  },
  button: {
    padding: "6px 12px",
    backgroundColor: "red",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer"
  }
};

export default Navbar;