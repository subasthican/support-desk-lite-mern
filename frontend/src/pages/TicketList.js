import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (status) params.status = status;
      if (priority) params.priority = priority;

      const res = await api.get("/tickets", { params });
      setTickets(res.data.data.tickets);
      setTotalPages(res.data.data.pages);
    } catch (err) {
      setError("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [page, status, priority]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchTickets();
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Tickets</h2>
        {user.role === "customer" && (
          <button
            style={styles.createButton}
            onClick={() => navigate("/create")}
          >
            Create Ticket
          </button>
        )}
      </div>

      <div style={styles.filters}>
        <form onSubmit={handleSearch} style={styles.searchForm}>
          <input
            type="text"
            placeholder="Search tickets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
          <button type="submit" style={styles.searchButton}>
            Search
          </button>
        </form>

        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          style={styles.select}
        >
          <option value="">All Status</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>

        <select
          value={priority}
          onChange={(e) => { setPriority(e.target.value); setPage(1); }}
          style={styles.select}
        >
          <option value="">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {loading && <p>Loading tickets...</p>}
      {error && <p style={styles.error}>{error}</p>}

      {!loading && tickets.length === 0 && (
        <p style={styles.empty}>No tickets found</p>
      )}

      {!loading && tickets.map((ticket) => (
        <div
          key={ticket._id}
          style={styles.ticketCard}
          onClick={() => navigate(`/tickets/${ticket._id}`)}
        >
          <div style={styles.ticketHeader}>
            <h3 style={styles.ticketTitle}>{ticket.title}</h3>
            <span style={styles.priority}>{ticket.priority}</span>
          </div>
          <div style={styles.ticketFooter}>
            <span style={styles.status}>{ticket.status}</span>
            <span style={styles.date}>
              {new Date(ticket.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      ))}

      <div style={styles.pagination}>
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          style={styles.pageButton}
        >
          Previous
        </button>
        <span style={styles.pageInfo}>Page {page} of {totalPages}</span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
          style={styles.pageButton}
        >
          Next
        </button>
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
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px"
  },
  createButton: {
    padding: "8px 16px",
    backgroundColor: "steelblue",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer"
  },
  filters: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    flexWrap: "wrap"
  },
  searchForm: {
    display: "flex",
    gap: "5px"
  },
  searchInput: {
    padding: "6px",
    border: "1px solid gray",
    borderRadius: "4px",
    width: "200px"
  },
  searchButton: {
    padding: "6px 12px",
    backgroundColor: "steelblue",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer"
  },
  select: {
    padding: "6px",
    border: "1px solid gray",
    borderRadius: "4px"
  },
  ticketCard: {
    border: "1px solid lightgray",
    borderRadius: "6px",
    padding: "15px",
    marginBottom: "10px",
    cursor: "pointer",
    backgroundColor: "white"
  },
  ticketHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  ticketTitle: {
    margin: "0",
    fontSize: "16px"
  },
  priority: {
    padding: "3px 8px",
    backgroundColor: "lightgray",
    borderRadius: "4px",
    fontSize: "12px"
  },
  ticketFooter: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px"
  },
  status: {
    color: "steelblue",
    fontSize: "13px"
  },
  date: {
    color: "gray",
    fontSize: "13px"
  },
  error: {
    color: "red"
  },
  empty: {
    color: "gray",
    textAlign: "center",
    marginTop: "40px"
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "15px",
    marginTop: "20px"
  },
  pageButton: {
    padding: "6px 12px",
    border: "1px solid gray",
    borderRadius: "4px",
    cursor: "pointer",
    backgroundColor: "white"
  },
  pageInfo: {
    color: "gray"
  }
};

export default TicketList;