import React from 'react'
import { Link } from "react-router";

const NotFound = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="text-6xl font-bold">404</div>
        <div className="text-base-content/70">Page not found.</div>
        <Link to="/" className="btn btn-primary">Go home</Link>
      </div>
    </div>
  )
}

export default NotFound