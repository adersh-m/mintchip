import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../app/hooks";

export default function PrivateRoute() {
    const status = useAppSelector((state) => state.auth.status);
    const isAuthenticated = status === "authenticated";
    console.log("PrivateRoute isAuthenticated:", isAuthenticated);
    console.log("PrivateRoute status:", status);
    const location = useLocation();

    if(!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <Outlet />
}