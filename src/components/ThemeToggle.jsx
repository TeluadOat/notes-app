import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import "./ThemeToggle.css"

export default function () {
   const { theme, toggleTheme } = useContext(ThemeContext);


   return (
      <div className="flex justify-between items-center mb-3">
         <span className="text-xl font-semibold">
            Dark Mode
         </span>
         <label className="toggle">
            <input
               id="switch-btn"
               type="checkbox"
               checked={theme === "dark"}
               onChange={toggleTheme}
            />
            <span className="slider"></span>
         </label >
      </div>
   )
}