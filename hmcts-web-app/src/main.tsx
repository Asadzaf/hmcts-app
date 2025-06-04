import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AllTasks from './pages/AllTasks'
import ViewTask from './pages/ViewTask'
import Home from './pages/Home'
import './assets/govuk-frontend/dist/govuk/govuk-frontend.min.css'
import CreateTask from './pages/CreateTask'
import DeleteTask from './pages/DeleteTask'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />}></Route>
          <Route path='/allTasks' element={<AllTasks />}></Route>
          <Route path='/createTask' element={<CreateTask/>}></Route>
          <Route path='/viewTask' element={<ViewTask/>}></Route>
          <Route path='/deleteTask' element={<DeleteTask/>}></Route>
        </Routes>
    </BrowserRouter>
  </StrictMode>,
)
