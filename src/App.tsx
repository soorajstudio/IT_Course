import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { CourseDetailPage } from './pages/CourseDetailPage';
import { LessonPage } from './pages/LessonPage';
import { QuizPage } from './pages/QuizPage';
import { ExamPage } from './pages/ExamPage';
import { ProjectPage } from './pages/ProjectPage';
import { PracticePage } from './pages/PracticePage';
import { DashboardPage } from './pages/DashboardPage';
import { CertificatesPage } from './pages/CertificatesPage';
import { VerifyCertificatePage } from './pages/VerifyCertificatePage';
import { AuthPage } from './pages/AuthPage';
import { AboutPage } from './pages/AboutPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/courses" element={<CatalogPage />} />
              <Route path="/courses/:slug" element={<CourseDetailPage />} />
              <Route path="/courses/:slug/lesson/:lessonId" element={<LessonPage />} />
              <Route path="/courses/:slug/quiz/:sectionId" element={<QuizPage />} />
              <Route path="/courses/:slug/exam" element={<ExamPage />} />
              <Route path="/courses/:slug/project" element={<ProjectPage />} />
              <Route path="/practice" element={<PracticePage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/certificates" element={<CertificatesPage />} />
              <Route path="/verify/:certId" element={<VerifyCertificatePage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </AppProvider>
    </ErrorBoundary>
  );
}
