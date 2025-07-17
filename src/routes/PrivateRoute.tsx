import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../app/hooks";

export default function PrivateRoute() {
    const status = useAppSelector((state) => state.auth.status);
    const isAuthenticated = status === "authenticated";
    const location = useLocation();

    if(!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <Outlet />
}