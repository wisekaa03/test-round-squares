import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './login';
import { Round } from './round';
import { Guss } from './guss';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/round" element={<Round />} />
        <Route path="/guss" element={<Guss />} />
      </Routes>
    </BrowserRouter>
  );
}
