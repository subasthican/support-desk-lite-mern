import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const CreateTicket = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [tags, setTags] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!title) {
      newErrors.title = "Title is required";
    } else if (title.length < 5) {
      newErrors.title = "Title must be at least 5 characters";
    }
    if (!description) {
      newErrors.description = "Description is required";
    } else if (description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }
    if (!priority) {
      newErrors.priority = "Priority is required";
    }
    return newErrors;
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
      const tagsArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "");

      await api.post("/tickets", {
        title,
        description,
        priority,
        tags: tagsArray
      });

      navigate("/");
    } catch (err) {
      setServerError("Failed to create ticket. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.title}>Create New Ticket</h2>

        {serverError && (
          <p style={styles.serverError}>{serverError}</p>
        )}

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={styles.input}
              placeholder="Enter ticket title"
            />
            {errors.title && (
              <p style={styles.error}>{errors.title}</p>
            )}
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={styles.textarea}
              placeholder="Describe your issue"
              rows={4}
            />
            {errors.description && (
              <p style={styles.error}>{errors.description}</p>
            )}
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              style={styles.input}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            {errors.priority && (
              <p style={styles.error}>{errors.priority}</p>
            )}
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Tags (comma separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              style={styles.input}
              placeholder="e.g. billing, login, account"
            />
          </div>

          <div style={styles.buttons}>
            <button
              type="button"
              onClick={() => navigate("/")}
              style={styles.cancelButton}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={styles.submitButton}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Ticket"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    padding: "40px 20px",
    backgroundColor: "lightgray",
    minHeight: "100vh"
  },
  box: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "8px",
    width: "500px",
    boxShadow: "0 2px 8px gray",
    height: "fit-content"
  },
  title: {
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
  textarea: {
    width: "100%",
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid gray",
    boxSizing: "border-box",
    resize: "vertical"
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
  buttons: {
    display: "flex",
    gap: "10px",
    justifyContent: "flex-end"
  },
  cancelButton: {
    padding: "8px 16px",
    backgroundColor: "gray",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer"
  },
  submitButton: {
    padding: "8px 16px",
    backgroundColor: "steelblue",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer"
  }
};

export default CreateTicket;