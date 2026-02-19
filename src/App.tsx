import { BrowserRouter, Routes, Route } from 'react-router-dom';
import EducationPage from './pages/EducationPage/EducationPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EducationPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;