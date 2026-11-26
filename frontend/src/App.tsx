import { Navigate, Route, Routes } from "react-router";
import PrivateRoute from "./components/PrivateRoute";
import LoginRoute from "./components/LoginRoute";
import Logout from "./components/Logout";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import ListarVeiculos from "./pages/ListarVeiculos";
import CadastrarVeiculo from "./pages/CadastrarVeiculo";
import NovaLocacao from "./pages/NovaLocacao";
import MinhasLocacoes from "./pages/MinhasLocacoes";

const App = () =>{
  return(
    <Routes>
      <Route element={<LoginRoute />}>
        <Route path="/login" element={<Login />}/>
        <Route path="/cadastro" element={<Cadastro />}/>
      </Route>
      <Route path="/logout" element={<Logout/>}/>
      <Route element={<PrivateRoute />}>
        <Route path="/veiculos" element={<ListarVeiculos />}/>
        <Route path="/veiculos/cadastrar" element={<CadastrarVeiculo />}/>
        <Route path="/locacoes" element={<MinhasLocacoes />}/>
        <Route path="/locacoes/nova" element={<NovaLocacao />}/>
      </Route>
      <Route path="*" element={<Navigate to="/veiculos" replace/>}/>
    </Routes>
  );
}

export default App;
