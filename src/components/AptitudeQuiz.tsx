import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { UserProfile, QuizResult } from '../App';

interface AptitudeQuizProps {
  onComplete: (result: QuizResult, profile: UserProfile) => void;
}

const quizQuestions = [
  {
    id: 1,
    question: "I enjoy solving mathematical problems and working with numbers",
    category: "analytical"
  },
  {
    id: 2,
    question: "I like creating art, writing, or designing things",
    category: "creative"
  },
  {
    id: 3,
    question: "I'm interested in how machines, computers, and technology work",
    category: "technical"
  },
  {
    id: 4,
    question: "I enjoy helping others and working in teams",
    category: "social"
  },
  {
    id: 5,
    question: "I prefer hands-on activities and building things",
    category: "practical"
  },
  {
    id: 6,
    question: "I like analyzing data and finding patterns",
    category: "analytical"
  }
];

export function AptitudeQuiz({ onComplete }: AptitudeQuizProps) {
  const [step, setStep] = useState<'profile' | 'quiz' | 'results'>('profile');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [profile, setProfile] = useState({
    name: '',
    class: '',
    location: '',
    stream: ''
  });

  const handleProfileSubmit = () => {
    if (profile.name && profile.class && profile.location) {
      setStep('quiz');
    }
  };

  const handleAnswer = (questionId: number, value: number) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResults();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateResults = () => {
    const scores = {
      analytical: 0,
      creative: 0,
      technical: 0,
      social: 0,
      practical: 0
    };

    quizQuestions.forEach(question => {
      const answer = answers[question.id] || 0;
      scores[question.category as keyof typeof scores] += answer;
    });

    // Calculate category frequencies and normalize scores to percentage
    const categoryCount = { analytical: 2, creative: 1, technical: 1, social: 1, practical: 1 };
    Object.keys(scores).forEach(key => {
      const maxPossibleScore = categoryCount[key as keyof typeof categoryCount] * 5; // 5 is max score per question
      scores[key as keyof typeof scores] = Math.round((scores[key as keyof typeof scores] / maxPossibleScore) * 100);
    });

    // Generate recommendations based on highest scores
    const recommendations = [];
    const sortedScores = Object.entries(scores).sort(([,a], [,b]) => b - a);
    
    if (sortedScores[0][0] === 'analytical') {
      recommendations.push('Mathematics', 'Physics', 'Economics', 'Statistics');
    }
    if (sortedScores[0][0] === 'creative') {
      recommendations.push('Fine Arts', 'Literature', 'Media Studies', 'Design');
    }
    if (sortedScores[0][0] === 'technical') {
      recommendations.push('Computer Science', 'Engineering', 'Information Technology');
    }
    if (sortedScores[0][0] === 'social') {
      recommendations.push('Psychology', 'Sociology', 'Social Work', 'Education');
    }
    if (sortedScores[0][0] === 'practical') {
      recommendations.push('Agriculture', 'Applied Sciences', 'Vocational Training');
    }

    const result: QuizResult = {
      scores,
      recommendations: recommendations.slice(0, 4)
    };

    const userProfile: UserProfile = {
      ...profile,
      interests: recommendations.slice(0, 3),
      aptitudeScores: scores
    };

    onComplete(result, userProfile);
  };

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
  const currentQ = quizQuestions[currentQuestion];

  if (step === 'profile') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full max-w-md p-6">
            <motion.h1 
              className="text-2xl mb-6 text-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Let's Get to Know You
            </motion.h1>
            
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="Enter your full name"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Label htmlFor="class">Current Class</Label>
                <Select onValueChange={(value) => setProfile({ ...profile, class: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">Class 10</SelectItem>
                    <SelectItem value="11">Class 11</SelectItem>
                    <SelectItem value="12">Class 12</SelectItem>
                    <SelectItem value="graduate">Graduate</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <Label htmlFor="location">Location (City/State)</Label>
                <Input
                  id="location"
                  value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  placeholder="e.g., Mumbai, Maharashtra"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <Label htmlFor="stream">Preferred Stream (Optional)</Label>
                <Select onValueChange={(value) => setProfile({ ...profile, stream: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select if you have a preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="science">Science</SelectItem>
                    <SelectItem value="commerce">Commerce</SelectItem>
                    <SelectItem value="arts">Arts/Humanities</SelectItem>
                    <SelectItem value="undecided">Undecided</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button onClick={handleProfileSubmit} className="w-full" disabled={!profile.name || !profile.class || !profile.location}>
                  Start Aptitude Assessment
                </Button>
              </motion.div>
            </motion.div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-2xl p-6">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <motion.h1 
                className="text-2xl"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                Aptitude Assessment
              </motion.h1>
              <motion.span 
                className="text-sm text-muted-foreground"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                {currentQuestion + 1} of {quizQuestions.length}
              </motion.span>
            </div>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.3 }}
            >
              <Progress value={progress} className="w-full" />
            </motion.div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div 
              key={currentQuestion}
              className="mb-8"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl mb-6">{currentQ.question}</h2>
              
              <RadioGroup
                value={answers[currentQ.id]?.toString() || ''}
                onValueChange={(value) => handleAnswer(currentQ.id, parseInt(value))}
              >
                <motion.div 
                  className="flex items-center space-x-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <RadioGroupItem value="1" id="strongly-disagree" />
                  <Label htmlFor="strongly-disagree">Strongly Disagree</Label>
                </motion.div>
                <motion.div 
                  className="flex items-center space-x-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.15 }}
                >
                  <RadioGroupItem value="2" id="disagree" />
                  <Label htmlFor="disagree">Disagree</Label>
                </motion.div>
                <motion.div 
                  className="flex items-center space-x-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <RadioGroupItem value="3" id="neutral" />
                  <Label htmlFor="neutral">Neutral</Label>
                </motion.div>
                <motion.div 
                  className="flex items-center space-x-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.25 }}
                >
                  <RadioGroupItem value="4" id="agree" />
                  <Label htmlFor="agree">Agree</Label>
                </motion.div>
                <motion.div 
                  className="flex items-center space-x-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <RadioGroupItem value="5" id="strongly-agree" />
                  <Label htmlFor="strongly-agree">Strongly Agree</Label>
                </motion.div>
              </RadioGroup>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                variant="outline" 
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                onClick={handleNext}
                disabled={!answers[currentQ.id]}
              >
                {currentQuestion === quizQuestions.length - 1 ? 'Complete Assessment' : 'Next'}
              </Button>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}