import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from "./pages/Login"
import { Home } from "./pages/home"
import { GestaoEstoque } from "./pages/GestaoEstoque"
import { CadastroProduto } from "./pages/CadastroProduto"

const PrivateRoute = ({ children }) => {
  const user = localStorage.getItem('usuario_saep');
  return user ? children : <Navigate to="/" />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route 
          path="/home" 
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          } 
        />

        <Route 
          path="/produtos" 
          element={
            <PrivateRoute>
              <CadastroProduto />
            </PrivateRoute>
          } 
        />

        <Route 
          path="/estoque" 
          element={
            <PrivateRoute>
              <GestaoEstoque />
            </PrivateRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  )
}