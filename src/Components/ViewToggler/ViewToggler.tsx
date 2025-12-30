import { useState } from "react";

export const ViewToggler = ({ onChange, options }: { onChange: (view: string) => void, options: string[] }) => {
  const [active, setActive] = useState(options[0]);

  const handleToggle = (val: string) => {
    setActive(val);
    onChange(val); // tell parent which view to show
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        {options.map((option) => (
          <button
            key={option}
            onClick={() => handleToggle(option)}
            style={{
              ...styles.btn,
              ...(active === option ? styles.active : {}),
            }}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

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
