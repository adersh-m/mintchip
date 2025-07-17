import { useAppDispatch } from "../../app/hooks";
import { setAuthenticated } from "../../features/auth/authSlice";
import { useNavigate, useLocation } from "react-router-dom";

export default function LoginPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const handleTestLogin = () => {
        dispatch(setAuthenticated());
        
        // Redirect to the original page they tried to access, or dashboard
        const from = location.state?.from?.pathname || "/";
        navigate(from, { replace: true });
    };

    return (
        <div className="fixed inset-0 bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Login</h1>
                <p className="text-gray-600 text-center mb-8">Please log in to continue.</p>
                
                {/* Temporary test login button */}
                <button
                    onClick={handleTestLogin}
                    className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Test Login (Development Only)
                </button>
            </div>
        </div>
    );
}