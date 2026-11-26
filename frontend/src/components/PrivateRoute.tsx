import { Navigate, Outlet, useLocation } from "react-router";
import { isAuthenticated } from "../utils/jwt";
import Menu from "./Menu";

function PrivateRoute(){
    const location = useLocation();

    if(!isAuthenticated()){
        return <Navigate to="/login" replace state={{from:location}}/>
    }

    return(
        <>
            <Menu />
            <main className="container">
                <Outlet />
            </main>
        </>
    );
}

export default PrivateRoute;
