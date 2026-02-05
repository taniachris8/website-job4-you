import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import { NotFoundPage } from "./pages/NotFoundPage";
import HomePage from "./pages/HomePage";
import { JobsPage } from "./pages/Jobs/JobsPage";
import { JobPage } from "./pages/Jobs/JobPage";
import { TermsOfUsePage } from "./pages/TermsOfUsePage";
import { AboutCompanyPage } from "./pages/AboutCompanyPage";
import { Article1Page } from "./pages/Articles/Article1Page";
import { Article2Page } from "./pages/Articles/Article2Page";
import { Article3Page } from "./pages/Articles/Article3Page";
import { Article4Page } from "./pages/Articles/Article4Page";
import { SignUpPage } from "./pages/SignUpPage";
import { LoginPage } from "./pages/LoginPage";
import { PasswordRecoveryPage } from "./pages/PasswordRecoveryPage";
import { EmployeesRightsPage } from "./pages/EmployeesRightsPage";
import { TipsPage } from "./components/tips/TipsPage";
import { UserCVPage } from "./components/user/UserCVPage";
import { UserSavedJobsPage } from "./components/user/UserSavedJobsPage";
import { UserSettingsPage } from "./components/user/UserSettingsPage";

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
        element: <UserSettingsPage />,
      },
      {
        path: "/users-savedJobs",
        element: <UserSavedJobsPage />,
      },
      {
        path: "/users-CV",
        element: <UserCVPage />,
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
