
import './App.css';
import Home from './Home';
import Quiz from './Quiz';
import Report from './Report';
import {Routes, Route} from "react-router-dom";
function App() {
  return (
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/quiz' element={<Quiz/>}/>
      <Route path='/report' element={<Report/>}/>
    </Routes>
  );
}

export default App;
