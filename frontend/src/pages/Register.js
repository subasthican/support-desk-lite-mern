import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/api";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer"
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!formData.name || formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }
    if (!formData.email) {
      newErrors.email = "Email is required";
    }
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const res = await api.post("/auth/register", formData);
      if (res.data.success) {
        alert("Registration successful! Please login.");
        navigate("/login");
      }
    } catch (err) {
      setServerError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.title}>Support Desk Lite</h2>
        <p style={styles.subtitle}>Create your account</p>

        {serverError && (
          <p style={styles.serverError}>{serverError}</p>
        )}

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={styles.input}
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p style={styles.error}>{errors.name}</p>
            )}
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p style={styles.error}>{errors.email}</p>
            )}
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
              placeholder="Minimum 6 characters"
            />
            {errors.password && (
              <p style={styles.error}>{errors.password}</p>
            )}
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Account Type</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="customer">Customer</option>
              <option value="agent">Agent</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            style={styles.button}
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p style={styles.link}>
          Already have an account?{" "}
          <Link to="/login" style={styles.linkText}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "lightgray"
  },
  box: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "8px",
    width: "350px",
    boxShadow: "0 2px 8px gray"
  },
  title: {
    textAlign: "center",
    marginBottom: "5px"
  },
  subtitle: {
    textAlign: "center",
    color: "gray",
    marginBottom: "20px"
  },
  field: {
    marginBottom: "15px"
  },
  label: {
    display: "block",
    marginBottom: "5px",
    fontWeight: "bold"
  },
  input: {
    width: "100%",
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid gray",
    boxSizing: "border-box"
  },
  select: {
    width: "100%",
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid gray",
    boxSizing: "border-box"
  },
  error: {
    color: "red",
    fontSize: "12px",
    marginTop: "4px"
  },
  serverError: {
    color: "red",
    textAlign: "center",
    marginBottom: "10px"
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "steelblue",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px"
  },
  link: {
    textAlign: "center",
    marginTop: "20px",
    fontSize: "14px"
  },
  linkText: {
    color: "steelblue",
    textDecoration: "none"
  }
};

export default Register;
