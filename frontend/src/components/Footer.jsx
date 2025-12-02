import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function Footer() {
  const { theme } = useContext(ThemeContext);
  const darkMode = theme === "dark";

  return (
    <footer
      className={`p-4 text-center transition-colors ${
        darkMode
          ? "text-gray-300 border-t border-gray-700 bg-gray-900"
          : "text-gray-700 border-t border-gray-300 bg-gray-100"
      }`}
    >
      © 2025 Supermarket Dashboard
    </footer>
  );
}
