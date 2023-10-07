import { Routes,Route,BrowserRouter } from "react-router-dom"
import Clientes from "./components/Clientes"

const App = () => {
  return (
    <div>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Clientes/>} />
    
            </Routes>
        </BrowserRouter>
    </div>
  )
}

export default App
