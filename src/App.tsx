import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Login } from './components/Login';
import { LandingPage } from './components/LandingPage';
import { DetailedProfileForm, DetailedProfileData } from './components/DetailedProfileForm';
import { AptitudeQuiz } from './components/AptitudeQuiz';
import { Dashboard } from './components/Dashboard';
import { CourseRecommendations } from './components/CourseRecommendations';
import { CareerPathMapping } from './components/CareerPathMapping';
import { CollegeFinder } from './components/CollegeFinder';
import { TimelineTracker } from './components/TimelineTracker';
import { Navigation } from './components/Navigation';
import { FloatingElements } from './components/FloatingElements';
import { Footer } from './components/Footer';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface UserProfile {
  name: string;
  class: string;
  location: string;
  stream: string;
  interests: string[];
  aptitudeScores: Record<string, number>;
  // Extended profile data
  startYear?: string;
  expectedGraduationYear?: string;
  milestones?: string;
  collegeName?: string;
  collegeLocation?: string;
  degreeType?: string;
  branchSpecialization?: string;
  intendedCareerDomain?: string;
  longTermGoal?: string;
  certificationsPlanned?: string[];
  coursesInterestedIn?: string[];
  learningMode?: string;
  // Profile completion status
  isProfileIncomplete?: boolean;
}

export interface QuizResult {
  scores: Record<string, number>;
  recommendations: string[];
}

type Page = 'login' | 'landing' | 'profile-form' | 'quiz' | 'dashboard' | 'courses' | 'career-path' | 'colleges' | 'timeline';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check for saved theme preference or default to system preference
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      if (saved !== null) {
        return JSON.parse(saved);
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Apply dark mode class and save preference
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
    setCurrentPage('profile-form');
  };

  const handleLogout = () => {
    setUser(null);
    setUserProfile(null);
    setQuizResult(null);
    setCurrentPage('login');
  };

  const handleDetailedProfileComplete = (profileData: DetailedProfileData) => {
    // Create initial profile with detailed data
    const detailedProfile: UserProfile = {
      name: user?.name || '',
      class: profileData.startYear || '',
      location: profileData.collegeLocation || '',
      stream: profileData.branchSpecialization || '',
      interests: profileData.coursesInterestedIn || [],
      aptitudeScores: userProfile?.aptitudeScores || {}, // Preserve existing quiz results
      ...profileData,
      isProfileIncomplete: false // Mark profile as complete
    };
    setUserProfile(detailedProfile);
    setCurrentPage('dashboard');
  };

  const handleProfileSkip = () => {
    // Create minimal profile when user skips detailed form
    const minimalProfile: UserProfile = {
      name: user?.name || '',
      class: '',
      location: '',
      stream: '',
      interests: [],
      aptitudeScores: {},
      // Mark as incomplete profile
      isProfileIncomplete: true
    };
    setUserProfile(minimalProfile);
    setCurrentPage('dashboard');
  };

  const handleQuizComplete = (result: QuizResult, profile: UserProfile) => {
    setQuizResult(result);
    // Merge quiz profile with existing detailed profile
    if (userProfile) {
      setUserProfile({ ...userProfile, ...profile, aptitudeScores: result.scores });
    } else {
      setUserProfile(profile);
    }
    setCurrentPage('dashboard');
  };

  const handleNavigation = (page: Page) => {
    setCurrentPage(page);
  };

  const showNavigation = currentPage !== 'login' && currentPage !== 'landing' && currentPage !== 'profile-form' && currentPage !== 'quiz' && user;

  // Page transition variants
  const pageVariants = {
    initial: { 
      opacity: 0, 
      x: 20,
      scale: 0.95
    },
    in: { 
      opacity: 1, 
      x: 0,
      scale: 1
    },
    out: { 
      opacity: 0, 
      x: -20,
      scale: 0.95
    }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.4
  };

  return (
    <div className="min-h-screen bg-background relative flex flex-col">
      <FloatingElements />
      
      <AnimatePresence mode="wait">
        {showNavigation && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Navigation 
              currentPage={currentPage} 
              onNavigate={handleNavigation}
              userProfile={userProfile}
              user={user}
              onLogout={handleLogout}
              isDarkMode={isDarkMode}
              onToggleDarkMode={toggleDarkMode}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
          {currentPage === 'login' && (
            <Login 
              onLogin={handleLogin}
              onSignUp={() => {}} 
            />
          )}

          {currentPage === 'landing' && (
            <LandingPage onStartQuiz={() => setCurrentPage('dashboard')} />
          )}

          {currentPage === 'profile-form' && user && (
            <DetailedProfileForm 
              user={user}
              onComplete={handleDetailedProfileComplete}
              onSkip={handleProfileSkip}
            />
          )}
          
          {currentPage === 'quiz' && (
            <AptitudeQuiz onComplete={handleQuizComplete} />
          )}
          
          {currentPage === 'dashboard' && (
            <Dashboard 
              userProfile={userProfile}
              quizResult={quizResult}
              onNavigate={(page) => {
                if (page === 'quiz') {
                  setCurrentPage('quiz');
                } else if (page === 'profile-form') {
                  setCurrentPage('profile-form');
                } else {
                  handleNavigation(page);
                }
              }}
            />
          )}
          
          {currentPage === 'courses' && (
            <CourseRecommendations 
              userProfile={userProfile}
              quizResult={quizResult}
            />
          )}
          
          {currentPage === 'career-path' && (
            <CareerPathMapping 
              userProfile={userProfile}
              quizResult={quizResult}
            />
          )}
          
          {currentPage === 'colleges' && (
            <CollegeFinder 
              userProfile={userProfile}
              quizResult={quizResult}
            />
          )}
          
          {currentPage === 'timeline' && (
            <TimelineTracker 
              userProfile={userProfile}
            />
          )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer - only show on certain pages */}
      {(currentPage === 'landing' || currentPage === 'dashboard') && (
        <Footer />
      )}
    </div>
  );
}