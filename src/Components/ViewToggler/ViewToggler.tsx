import { useState, type ReactNode } from "react";
import type { CSSProperties } from "react";

export interface TogglerOption {
  id: string;
  label: string;
  icon?: ReactNode;
}

interface ViewTogglerProps {
  onChange: (id: string) => void;
  options: TogglerOption[] | string[];
  activeOption?: string;
}

export const ViewToggler = ({ onChange, options, activeOption }: ViewTogglerProps) => {
  const [internalActive, setInternalActive] = useState(
    typeof options[0] === 'string' ? options[0] : (options[0] as TogglerOption).id
  );

  const active = activeOption || internalActive;

  const handleToggle = (val: string) => {
    setInternalActive(val);
    onChange(val);
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        {options.map((option) => {
          const id = typeof option === 'string' ? option : option.id;
          const label = typeof option === 'string' ? option : option.label;
          const icon = typeof option === 'string' ? null : option.icon;

          return (
            <button
              key={id}
              onClick={() => handleToggle(id)}
              style={{
                ...styles.btn,
                ...(active === id ? styles.active : {}),
              }}
            >
              <div style={styles.btnContent}>
                {icon && <span style={styles.icon}>{icon}</span>}
                {label}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const styles: { [key: string]: CSSProperties } = {
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
  btnContent: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  icon: {
    display: "flex",
    alignItems: "center",
  },
  active: {
    background: "#fff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
    transform: "translateY(-2px)",
  },
};
