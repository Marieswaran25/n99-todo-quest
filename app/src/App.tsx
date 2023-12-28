import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Register } from './components/Register';
// import {connect} from 'socket.io-client';
// const socket=connect('http://localhost:5000')

function App() {
  return (
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Register as={'Login'}/>}/>
        <Route path='/register' element={<Register as={'Signin'}/>}/>
      </Routes>
      </BrowserRouter>
);
}

export default App;
