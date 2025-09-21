import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import Blog from './Pages/Blog'
import Layout from './Pages/admins/Layout'
import Dashboard from './Pages/admins/Dashboard'
import AddBlog from './Pages/admins/AddBlog'
import ListBlog from './Pages/admins/ListBlog'  
import Comments from './Pages/admins/Comments'
import Login from './Components/admin/Login'
import 'quill/dist/quill.snow.css';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/blog/:id' element={<Blog />} />
        <Route path='/admin' element={true ? <Layout /> : <Login />}>
          <Route index element={<Dashboard />} />
          <Route path='addBlog' element={<AddBlog />} />
          <Route path='listBlog' element={<ListBlog />} />
          <Route path='comments' element={<Comments />} />

        </Route>
      </Routes>
    </div>
  )
}

export default App
