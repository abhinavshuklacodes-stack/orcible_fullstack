import { useEffect, useState } from "react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ProjectMemoryPanel from "../components/ProjectMemoryPanel";
import ChatOrcible from "../components/ChatOrcible";
import AIToolGrid from "../components/AIToolGrid";
import Footer from "../components/Footer";

export default function Dashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/projects").then(({ data }) => {
      setProjects(data.projects);
      setLoading(false);
    });
  }, []);

  const active = projects.find((p) => p.isActive) || projects[0];

  async function activate(id) {
    const { data } = await api.post(`/api/projects/${id}/activate`);
    setProjects((prev) => prev.map((p) => (p._id === id ? data.project : { ...p, isActive: false })));
  }

  function handleCreated(project) {
    setProjects((prev) => {
      const next = project.isActive ? prev.map((p) => ({ ...p, isActive: false })) : prev;
      return [project, ...next];
    });
  }

  function handleDeleted(id) {
    setProjects((prev) => prev.filter((p) => p._id !== id));
  }

  function handleProjectUpdate(updated) {
    setProjects((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <div className="app-shell" style={{ flex: 1 }}>
        <Sidebar
          projects={projects}
          activeId={active?._id}
          onActivate={activate}
          onCreated={handleCreated}
          onDeleted={handleDeleted}
          user={user}
        />

        <div style={{ flex: 1, minWidth: 0 }}>
          <Navbar />

          <div className="page">
            {loading ? (
              <p className="muted">Loading your projects…</p>
            ) : !active ? (
              <EmptyState />
            ) : (
              <>
                <h1 style={{ fontSize: 24, marginBottom: 28 }}>
                  Hi {user?.name?.split(" ")[0] || "there"}, you are currently cooking{" "}
                  <span style={{ fontWeight: 400 }}>{active.name}</span>
                </h1>

                <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 24, alignItems: "start" }}>
                  <ProjectMemoryPanel project={active} onUpdate={handleProjectUpdate} />
                  <ChatOrcible projectId={active._id} />
                </div>

                <hr className="hairline" />

                <h2 style={{ fontSize: 16, marginBottom: 14 }}>Choose your next AI tool to work with</h2>
                <AIToolGrid />
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="panel" style={{ textAlign: "center", padding: 48 }}>
      <h2 style={{ fontSize: 18, marginBottom: 8 }}>Start your first project</h2>
      <p className="muted" style={{ marginBottom: 0 }}>
        Use the + next to "My projects" in the sidebar to create one.
      </p>
    </div>
  );
}
