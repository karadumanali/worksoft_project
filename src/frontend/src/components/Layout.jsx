import Sidebar from "./Sidebar";

function Layout({ children }) {
  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Sidebar />
      <div style={{ flex: 1, overflowY: "auto" }}>{children}</div>
    </div>
  );
}

export default Layout;