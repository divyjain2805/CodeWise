import React from 'react'
import { Outlet } from 'react-router'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const MainLayout = () => {
    return (
        <div>

            <Navbar />


            <main className="min-h-screen p-6">
                <Outlet />
            </main>

            <Footer />
        </div>
    )
}

export default MainLayout