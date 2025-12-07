import { Route, Routes } from "react-router-dom";
import AdminRoute from "./AdminRoute";
import ProtectedRoute from "./ProtectedRoute";
import AdminLayout from "../layouts/AdminLayout/AdminLayout";
import ClientLayout from "../layouts/ClientLayout/ClientLayout";
import Home from "../pages/client/home";
import Courses from "../pages/client/Courses/Courses";
import CourseDetail from "../pages/client/CourseDetail/CourseDetail";
import MyCourses from "../pages/client/MyCourses/MyCourses";
import Profile from "../pages/client/Profile/Profile";
import Login from "../pages/auth/Login/Login";
import Register from "../pages/auth/Register/Register";
import QuanLyNguoiDung from "../pages/admin/QuanLyNguoiDung/QuanLyNguoiDung";
import QuanLyKhoaHoc from "../pages/admin/QuanLyKhoaHoc/QuanLyKhoaHoc";
import QuanLyGhiDanh from "../pages/admin/QuanLyGhiDanh/QuanLyGhiDanh";
// import NotFound from "../pages/NotFound/NotFound";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<ClientLayout />}>
                <Route index element={<Home />} />
                <Route path="courses" element={<Courses />} />
                <Route path="courses/:maKhoaHoc" element={<CourseDetail />} />
                <Route
                    path="my-courses"
                    element={
                        <ProtectedRoute>
                            <MyCourses />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="profile"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
                path="/admin"
                element={
                    <AdminRoute>
                        <AdminLayout />
                    </AdminRoute>
                }
            >
                <Route path="users" element={<QuanLyNguoiDung />} />
                <Route path="courses" element={<QuanLyKhoaHoc />} />
                <Route path="enrollments" element={<QuanLyGhiDanh />} />
            </Route>
        </Routes>
    )
}


export default AppRoutes;