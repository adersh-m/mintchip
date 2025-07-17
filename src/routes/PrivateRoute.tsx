import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../app/hooks";

export default function PrivateRoute() {
    const status = useAppSelector((state) => state.auth.status);
    const isAuthenticated = status === "authenticated";
    const location = useLocation();

    // For testing purposes, allow access to all routes
    // TODO: Re-enable authentication check in production
    const allowTestingAccess = true;

    if(!isAuthenticated && !allowTestingAccess) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <Outlet />
}