import React from 'react';
import { Routes, Route } from "react-router";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import NotFound from "../pages/NotFound";
import MainLayout from '../layouts/MainLayout';
import Problems from "../pages/Problems";
import ProblemDetail from "../pages/ProblemDetail";
import Profile from "../pages/Profile";
import MySubmissions from "../pages/MySubmissions";
import SubmissionDetail from "../pages/SubmissionDetail";
import AdminDashboard from "../pages/AdminDashboard";
import AdminCreateProblem from "../pages/AdminCreateProblem";
import AdminManageProblems from "../pages/AdminManageProblems";
import AdminEditProblem from "../pages/AdminEditProblem";
import AdminManageUsers from "../pages/AdminManageUsers";
import ProtectedRoute from "../components/ProtectedRoute";


const AppRoutes = () => {
    return (
        <div>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path='/' element={<Home />} />
                    <Route path="/problems" element={<Problems />} />
                    <Route path="/problems/:slug" element={<ProblemDetail />} />

                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route element={<ProtectedRoute />}>
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/submissions" element={<MySubmissions />} />
                        <Route path="/submissions/:id" element={<SubmissionDetail />} />
                    </Route>

                    <Route element={<ProtectedRoute requiredRole="ADMIN" />}>
                        {/* Admin Routes */}
                        <Route path="/admin/dashboard" element={<AdminDashboard />} />
                        <Route path="/admin/users" element={<AdminManageUsers />} />
                        <Route path="/admin/problems" element={<AdminManageProblems />} />
                        <Route path="/admin/problems/create" element={<AdminCreateProblem />} />
                        <Route path="/admin/problems/:slug/edit" element={<AdminEditProblem />} />
                    </Route>
                </Route>
                <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
    )
}

export default AppRoutes