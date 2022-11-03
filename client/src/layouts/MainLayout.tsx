import React from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from '../components'

const MainLayout = () => {
  return (
    <div className="wrapper">
        <header className="header">
            <Navbar />
            header
        </header>

        <main className="main">
            <Outlet />
        </main>

        <footer className="footer">
          footer
        </footer>
    </div>
  )
}

export default MainLayout