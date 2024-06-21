import { useSelector } from "react-redux";

// Use a hook naming convention and define it correctly
export const useAuth = () => {
    const user = localStorage.getItem("user") // Ensure token is stored and accessible in this path
    return { user };
};
