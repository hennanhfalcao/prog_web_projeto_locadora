import { Navigate, Outlet } from "react-router";
import { isAuthenticated } from "../utils/jwt";

function LoginRoute(){
    return isAuthenticated() ? <Navigate to="/veiculos" replace/> : <Outlet />
}

export default LoginRoute;
