import { useEffect, useState } from "react";

interface ToggleButtonProps {
    onToggle?: (value: boolean) => void;
    value?: boolean;
}

export default function ToggleButton({ onToggle, value }: ToggleButtonProps) {
  const [isOn, setIsOn] = useState(value);

  const handleToggle = () => {
    const newValue = !isOn;
    setIsOn(newValue);
    if (onToggle) onToggle(newValue);
  };

  const [background, setBackground] = useState("#ccc");
  const [pos, setPos] = useState("2px");

  useEffect(() => {
    if (value) {
      setBackground("#4ade80");
      setPos("26px");
    } else {
      setBackground("#ccc");
      setPos("2px");
    }
  }, [value]);

  return (
    
    <div
      onClick={handleToggle}
      style={{
        width: "50px",
        height: "26px",
        borderRadius: "20px",
        background: background,
        position: "relative",
        cursor: "pointer",
        transition: "background 0.3s",
      }}
    >
      <div
        style={{
          width: "22px",
          height: "22px",
          borderRadius: "50%",
          background: "white",
          position: "absolute",
          top: "2px",
          left: pos,
          transition: "left 0.25s",
          boxShadow: "0 1px 3px rgba(0,0,0,0.3)"
        }}
      ></div>
    </div>
  );
}
