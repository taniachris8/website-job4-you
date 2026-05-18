import { createBrowserRouter } from "react-router-dom";
import { RequireAuth } from "./components/auth/RequireAuth";
import { RequireNonAdmin } from "./components/auth/RequireNonAdmin";
import App from "./App";

import { NotFoundPage } from "./pages/not-found-page/NotFoundPage";
import HomePage from "./pages/home-page/HomePage";
import { JobsPage } from "./pages/jobs-page/JobsPage";
import { JobPage } from "./pages/job-page/JobPage";
import { TermsOfUsePage } from "./pages/terms-of-use-page/TermsOfUsePage";
import { AboutCompanyPage } from "./pages/about-company-page/AboutCompanyPage";
import { Article1Page } from "./pages/articles-pages/Article1Page";
import { Article2Page } from "./pages/articles-pages/Article2Page";
import { Article3Page } from "./pages/articles-pages/Article3Page";
import { Article4Page } from "./pages/articles-pages/Article4Page";
import { SignUpPage } from "./pages/signup-page/SignUpPage";
import { LoginPage } from "./pages/login-page/LoginPage";
import { PasswordRecoveryPage } from "./pages/password-recovery-page/PasswordRecoveryPage";
import { EmployeesRightsPage } from "./pages/employees-rights-page/EmployeesRightsPage";
import { TipsPage } from "./pages/tips-page/TipsPage";
import { UserCVPage } from "./pages/user-cv-page/UserCVPage";
import { UserSavedJobsPage } from "./pages/user-saved-jobs-page/UserSavedJobsPage";
import { UserSettingsPage } from "./pages/user-settings-page/UserSettingsPage";

export const router = createBrowserRouter([
  {
    element: <App />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/jobs",
        element: <JobsPage />,
      },
      {
        path: "/terms-of-use",
        element: <TermsOfUsePage />,
      },
      {
        path: "/about-company",
        element: <AboutCompanyPage />,
      },
      {
        path: "/article_1",
        element: <Article1Page />,
      },
      {
        path: "/article_2",
        element: <Article2Page />,
      },
      {
        path: "/article_3",
        element: <Article3Page />,
      },
      {
        path: "/article_4",
        element: <Article4Page />,
      },
      {
        path: "/jobs/:id",
        element: <JobPage />,
      },
      {
        path: "/registration",
        element: <SignUpPage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/users-settings",
        element: (
          <RequireNonAdmin>
            <UserSettingsPage />
          </RequireNonAdmin>
        ),
      },
      {
        path: "/users-savedJobs",
        element: (
          <RequireAuth>
            <UserSavedJobsPage />
          </RequireAuth>
        ),
      },
      {
        path: "/users-CV",
        element: (
          <RequireAuth>
            <UserCVPage />
          </RequireAuth>
        ),
      },
      {
        path: "/tips",
        element: <TipsPage />,
      },
      {
        path: "/rights",
        element: <EmployeesRightsPage />,
      },
      {
        path: "/password-recovery",
        element: <PasswordRecoveryPage />,
      },
    ],
  },
]);
