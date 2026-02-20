import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

const TicketDetail = () => {
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [commentBody, setCommentBody] = useState("");
  const [commentType, setCommentType] = useState("public");
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState("");

  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchTicket = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/tickets/${id}/comments`);
      setTicket(res.data.data.ticket);
      setComments(res.data.data.comments);
    } catch (err) {
      setError("Failed to load ticket");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    setCommentError("");

    if (!commentBody) {
      setCommentError("Comment cannot be empty");
      return;
    }

    setCommentLoading(true);
    try {
      await api.post(`/tickets/${id}/comments`, {
        body: commentBody,
        type: commentType
      });
      setCommentBody("");
      setCommentType("public");
      fetchTicket();
    } catch (err) {
      setCommentError("Failed to add comment");
    } finally {
      setCommentLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await api.patch(`/tickets/${id}/status`, { status: newStatus });
      fetchTicket();
    } catch (err) {
      alert("Invalid status transition");
    }
  };

  if (loading) return <p style={styles.loading}>Loading ticket...</p>;
  if (error) return <p style={styles.error}>{error}</p>;
  if (!ticket) return null;

  return (
    <div style={styles.container}>
      <button
        onClick={() => navigate("/")}
        style={styles.backButton}
      >
        Back to Tickets
      </button>

      <div style={styles.ticketBox}>
        <div style={styles.ticketHeader}>
          <h2 style={styles.ticketTitle}>{ticket.title}</h2>
          <span style={styles.priority}>{ticket.priority}</span>
        </div>

        <p style={styles.description}>{ticket.description}</p>

        <div style={styles.ticketInfo}>
          <span>Status: <strong>{ticket.status}</strong></span>
          <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
        </div>

        {ticket.tags && ticket.tags.length > 0 && (
          <div style={styles.tags}>
            {ticket.tags.map((tag, index) => (
              <span key={index} style={styles.tag}>{tag}</span>
            ))}
          </div>
        )}

        {(user.role === "agent" || user.role === "admin") && (
          <div style={styles.statusChange}>
            <label style={styles.label}>Change Status:</label>
            <select
              value={ticket.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              style={styles.select}
            >
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        )}
      </div>

      <div style={styles.commentsBox}>
        <h3>Comments</h3>

        {comments.length === 0 && (
          <p style={styles.noComments}>No comments yet</p>
        )}

        {comments.map((comment) => (
          <div
            key={comment._id}
            style={
              comment.type === "internal"
                ? styles.internalComment
                : styles.publicComment
            }
          >
            {comment.type === "internal" && (
              <span style={styles.internalBadge}>Internal Note</span>
            )}
            <p style={styles.commentBody}>{comment.body}</p>
            <p style={styles.commentDate}>
              {new Date(comment.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}

        <form onSubmit={handleAddComment} style={styles.commentForm}>
          <h4>Add Comment</h4>

          {commentError && (
            <p style={styles.error}>{commentError}</p>
          )}

          <textarea
            value={commentBody}
            onChange={(e) => setCommentBody(e.target.value)}
            style={styles.textarea}
            placeholder="Write your comment here"
            rows={3}
          />

          {(user.role === "agent" || user.role === "admin") && (
            <div style={styles.commentTypeField}>
              <label style={styles.label}>Comment Type:</label>
              <select
                value={commentType}
                onChange={(e) => setCommentType(e.target.value)}
                style={styles.select}
              >
                <option value="public">Public Comment</option>
                <option value="internal">Internal Note</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            style={styles.submitButton}
            disabled={commentLoading}
          >
            {commentLoading ? "Adding..." : "Add Comment"}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    maxWidth: "800px",
    margin: "0 auto"
  },
  backButton: {
    padding: "6px 12px",
    backgroundColor: "gray",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginBottom: "20px"
  },
  ticketBox: {
    backgroundColor: "white",
    border: "1px solid lightgray",
    borderRadius: "6px",
    padding: "20px",
    marginBottom: "20px"
  },
  ticketHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px"
  },
  ticketTitle: {
    margin: "0"
  },
  priority: {
    padding: "3px 8px",
    backgroundColor: "lightgray",
    borderRadius: "4px",
    fontSize: "12px"
  },
  description: {
    color: "gray",
    marginBottom: "15px"
  },
  ticketInfo: {
    display: "flex",
    gap: "20px",
    fontSize: "14px",
    marginBottom: "10px"
  },
  tags: {
    display: "flex",
    gap: "5px",
    flexWrap: "wrap",
    marginBottom: "15px"
  },
  tag: {
    padding: "2px 8px",
    backgroundColor: "lightblue",
    borderRadius: "4px",
    fontSize: "12px"
  },
  statusChange: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginTop: "15px"
  },
  label: {
    fontWeight: "bold"
  },
  select: {
    padding: "6px",
    border: "1px solid gray",
    borderRadius: "4px"
  },
  commentsBox: {
    backgroundColor: "white",
    border: "1px solid lightgray",
    borderRadius: "6px",
    padding: "20px"
  },
  noComments: {
    color: "gray"
  },
  publicComment: {
    border: "1px solid lightgray",
    borderRadius: "4px",
    padding: "10px",
    marginBottom: "10px",
    backgroundColor: "white"
  },
  internalComment: {
    border: "1px solid orange",
    borderRadius: "4px",
    padding: "10px",
    marginBottom: "10px",
    backgroundColor: "lightyellow"
  },
  internalBadge: {
    backgroundColor: "orange",
    color: "white",
    padding: "2px 6px",
    borderRadius: "4px",
    fontSize: "11px"
  },
  commentBody: {
    margin: "8px 0"
  },
  commentDate: {
    color: "gray",
    fontSize: "12px",
    margin: "0"
  },
  commentForm: {
    marginTop: "20px"
  },
  textarea: {
    width: "100%",
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid gray",
    boxSizing: "border-box",
    resize: "vertical"
  },
  commentTypeField: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    margin: "10px 0"
  },
  submitButton: {
    padding: "8px 16px",
    backgroundColor: "steelblue",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginTop: "10px"
  },
  loading: {
    textAlign: "center",
    marginTop: "40px"
  },
  error: {
    color: "red"
  }
};

export default TicketDetail;