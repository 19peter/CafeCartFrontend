import { useState } from "react";

export const ViewToggler = ({ onChange }: { onChange: (view: string) => void }) => {
  const [active, setActive] = useState("orders");

  const handleToggle = (val: string) => {
    setActive(val);
    onChange(val); // tell parent which view to show
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <button
          onClick={() => handleToggle("orders")}
          style={{
            ...styles.btn,
            ...(active === "orders" ? styles.active : {}),
          }}
        >
          Orders
        </button>

        <button
          onClick={() => handleToggle("inventory")}
          style={{
            ...styles.btn,
            ...(active === "inventory" ? styles.active : {}),
          }}
        >
          Inventory
        </button>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    margin: "20px 0",
  },
  container: {
    display: "flex",
    background: "#eee",
    padding: "4px",
    borderRadius: "40px",
    gap: "4px",
  },
  btn: {
    padding: "10px 20px",
    borderRadius: "30px",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "15px",
    transition: "all 0.25s ease",
  },
  active: {
    background: "#fff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
    transform: "translateY(-2px)",
  },
};
