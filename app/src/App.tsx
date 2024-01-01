import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Register } from './components/Register';
import { Chat } from './components/Chat';


function App() {
  return (
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Register as={'Login'}/>}/>
        <Route path='/register' element={<Register as={'Signin'}/>}/>
        <Route path="/chat" element={<Chat/>}/>
      </Routes>
      </BrowserRouter>
);
}

export default App;
