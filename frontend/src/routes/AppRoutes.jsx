import { Routes, Route } from 'react-router-dom';
import PublicLayout from '../components/navigation/PublicLayout';
import AppLayout from '../components/navigation/AppLayout';
import Landing from '../pages/Landing/Landing';
import Departments from '../pages/Departments/Departments';
import DepartmentDetail from '../pages/Departments/DepartmentDetail';
import Dashboard from '../pages/Dashboard/Dashboard';
import CategoryModules from '../pages/Learning/CategoryModules';
import ModuleDetail from '../pages/Learning/ModuleDetail';
import Practice from '../pages/Practice/Practice';
import ProblemDetail from '../pages/Problem/ProblemDetail';
import Compiler from '../pages/Compiler/Compiler';
import Progress from '../pages/Progress/Progress';
import Achievements from '../pages/Achievements/Achievements';
import Profile from '../pages/Profile/Profile';
import Settings from '../pages/Settings/Settings';
import About from '../pages/About/About';
import Features from '../pages/Features/Features';
import LearningPaths from '../pages/LearningPaths/LearningPaths';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import MyLearning from '../pages/MyLearning/MyLearning';
import NotFound from '../pages/NotFound/NotFound';
import Search from '../pages/Search/Search';
import ProtectedRoute from '../components/navigation/ProtectedRoute';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/departments" element={<Departments />} />
        <Route path="/departments/:departmentId" element={<DepartmentDetail />} />
        <Route
          path="/departments/:departmentId/:categoryId"
          element={<CategoryModules />}
        />
        <Route
          path="/departments/:departmentId/:categoryId/:moduleId"
          element={<ModuleDetail />}
        />
        <Route path="/features" element={<Features />} />
        <Route path="/learning-paths" element={<LearningPaths />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/search" element={<Search />} />
      </Route>

      {/* Authenticated */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/my-learning" element={<MyLearning />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/problem/:problemId" element={<ProblemDetail />} />
        <Route path="/compiler" element={<Compiler />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
