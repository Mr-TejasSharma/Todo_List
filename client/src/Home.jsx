import "bootstrap/dist/css/bootstrap.min.css";
import "./Signup.css";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function Home() {
  const location = useLocation();
  const name = location.state?.name;
  const email = location.state?.email; // Ensure email is passed during login
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  // Fetch tasks when the component mounts
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch("http://localhost:3001/get-tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (res.status === 200) {
          setTasks(data.tasks); // Load tasks into state
        } else {
          console.error("Failed to fetch tasks:", data.message);
        }
      } catch (err) {
        console.error("Error loading tasks:", err);
      }
    };

    if (email) fetchTasks(); // Only fetch tasks if email is available
  }, [email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!task.trim()) {
      setTask(""); // Clear input if task is empty
      return;
    }
    console.log("Submitting task:", task);
    try {
      const res = await fetch("http://localhost:3001/add-task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          tasks: { text: task, completed: false },
        }),
      });

      const data = await res.json();
      if (res.status === 200) {
        setTasks(data.tasks); // Update tasks with the response
        setTask(""); // Clear input
      } else {
        console.error(data.message);
      }
    } catch (err) {
      console.error("Error submitting task:", err);
    }
  };

  const handleDelete = async (index) => {
    try {
      const res = await fetch("http://localhost:3001/delete-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, index }),
      });
      const data = await res.json();
      if (res.ok) {
        setTasks(data.tasks);
        navigator.vibrate(100); 
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const toggleComplete = async (index) => {
    try {
      const res = await fetch("http://localhost:3001/toggle-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, index }),
      });
      const data = await res.json();
      if (res.ok) {
        setTasks(data.tasks);
      }
    } catch (err) {
      console.error("Toggle error:", err);
    }
  };

  return (
    <section className="vh-100 gradient-custom-3" style={{ backgroundColor: "#e2d5de" }}>
      <div className="container py-5 h-110">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col col-xl-10">
            <div className="card py-3" style={{ borderRadius: "15px", alignItems: "center" }}>
              <div className="card-body " style={{borderRadius: "15px"}}>
                <h1>Welcome, {name}!</h1>

                <form
                  onSubmit={handleSubmit}
                  className="d-flex justify-content-center align-items-center mb-4"
                >
                  <div className="d-flex w-100">
                    <input
                      type="text"
                      id="form3"
                      className="form-control form-control-lg"
                      value={task}
                      onChange={(e) => setTask(e.target.value)}
                      placeholder="Enter your task"
                    />
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg ms-2"
                    >
                      Add
                    </button>
                  </div>
                </form>
              </div>
                <div className="card-body p-4 gradient-custom-4" style={{ maxHeight: "400px", overflowY: "auto" , backgroundColor: "#347AC0FF" , borderRadius: "15px", font:"bolder", scrollbarWidth: "none", width: "95%"}}>         
                <ul
                  className="list-group mb-0 "
                  style={{
                    maxHeight: "400px",
                    overflowY: "auto",
                    scrollbarWidth: "none",
                  }}
                >
                  {[...tasks].reverse().map((t, index) => (
                    <li
                      key={index}
                      className="list-group-item d-flex justify-content-between align-items-center mb-2"
                        style={{
                          backgroundColor: "#F7F0F5FF",
                        }}
                    >
                      <div className="d-flex align-items-center">
                        <input
                          className="form-check-input me-2"
                          type="checkbox"
                          checked={t.completed}
                          onChange={() =>
                            toggleComplete(tasks.length - 1 - index)
                          }
                        />
                        <span
                          style={{
                            textDecoration: t.completed
                              ? "line-through"
                              : "none",
                          }}
                        >
                          {t.text}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDelete(tasks.length - 1 - index)}
                        className="btn btn-sm custom-delete-btn"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Home;
