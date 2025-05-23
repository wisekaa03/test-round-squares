import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './login';
import { Rounds } from './rounds';
import { Guss } from './guss';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/rounds" element={<Rounds />} />
        <Route path="/guss/:id" element={<Guss />} />
      </Routes>
    </BrowserRouter>
  );
}
