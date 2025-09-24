import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Checkbox } from './ui/checkbox';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  Calendar, 
  GraduationCap, 
  MapPin, 
  Target, 
  BookOpen, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle,
  User,
  Building
} from 'lucide-react';
import { User as UserType } from '../App';

export interface DetailedProfileData {
  // Timeline Section
  startYear: string;
  expectedGraduationYear: string;
  milestones: string;
  
  // College Details Section
  collegeName: string;
  collegeLocation: string;
  degreeType: string;
  branchSpecialization: string;
  
  // Career Path Section
  intendedCareerDomain: string;
  longTermGoal: string;
  certificationsPlanned: string[];
  
  // Course Preferences Section
  coursesInterestedIn: string[];
  learningMode: string;
}

interface DetailedProfileFormProps {
  user: UserType;
  onComplete: (profileData: DetailedProfileData) => void;
  onSkip: () => void;
}

const degreeTypes = [
  'B.Tech (Bachelor of Technology)',
  'B.Sc (Bachelor of Science)',
  'B.Com (Bachelor of Commerce)',
  'B.A (Bachelor of Arts)',
  'BBA (Bachelor of Business Administration)',
  'B.Arch (Bachelor of Architecture)',
  'BCA (Bachelor of Computer Applications)',
  'B.Pharma (Bachelor of Pharmacy)',
  'B.Ed (Bachelor of Education)',
  'LLB (Bachelor of Laws)',
  'MBBS (Bachelor of Medicine)',
  'BDS (Bachelor of Dental Surgery)'
];

const careerDomains = [
  'Technology & Engineering',
  'Healthcare & Medicine',
  'Business & Finance',
  'Education & Research',
  'Creative Arts & Design',
  'Government & Public Service',
  'Entrepreneurship',
  'Social Work & NGO',
  'Sports & Fitness',
  'Media & Journalism',
  'Law & Legal Services',
  'Agriculture & Environment'
];

const availableCertifications = [
  'AWS Cloud Practitioner',
  'Google Cloud Associate',
  'Microsoft Azure Fundamentals',
  'Cisco CCNA',
  'CompTIA Security+',
  'Project Management (PMP)',
  'Digital Marketing Certification',
  'Data Science with Python',
  'Machine Learning Specialization',
  'Financial Modeling',
  'Chartered Accountancy (CA)',
  'Certified Public Accountant (CPA)',
  'Six Sigma Green Belt',
  'IELTS/TOEFL',
  'GRE/GMAT Preparation'
];

const courseInterests = [
  'Computer Science & Programming',
  'Data Science & Analytics',
  'Artificial Intelligence & ML',
  'Web Development',
  'Mobile App Development',
  'Business Administration',
  'Financial Management',
  'Digital Marketing',
  'Graphic Design',
  'Content Writing',
  'Psychology',
  'Environmental Science',
  'Biotechnology',
  'Mechanical Engineering',
  'Electrical Engineering',
  'Civil Engineering'
];

export function DetailedProfileForm({ user, onComplete, onSkip }: DetailedProfileFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<DetailedProfileData>({
    startYear: '',
    expectedGraduationYear: '',
    milestones: '',
    collegeName: '',
    collegeLocation: '',
    degreeType: '',
    branchSpecialization: '',
    intendedCareerDomain: '',
    longTermGoal: '',
    certificationsPlanned: [],
    coursesInterestedIn: [],
    learningMode: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-fill user info when component mounts or user changes
  useEffect(() => {
    if (user) {
      // Auto-populate milestones with a personalized template
      const welcomeText = `Hi! I'm ${user.name} and I'm excited to plan my academic and career journey with CareerCompass. I want to explore opportunities that align with my interests and help me achieve my professional goals.`;
      
      setFormData(prev => ({
        ...prev,
        milestones: welcomeText
      }));
    }
  }, [user]);

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear + i);

  const handleInputChange = (field: keyof DetailedProfileData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMultiSelectChange = (field: keyof DetailedProfileData, value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...(prev[field] as string[]), value]
        : (prev[field] as string[]).filter(item => item !== value)
    }));
  };

  const handleNext = () => {
    if (validateCurrentStep() && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      setErrors({}); // Clear errors when moving to next step
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    if (validateCurrentStep()) {
      onComplete(formData);
    }
  };

  const validateCurrentStep = () => {
    const newErrors: Record<string, string> = {};
    
    switch (currentStep) {
      case 1:
        if (!formData.startYear) newErrors.startYear = 'Start year is required';
        if (!formData.expectedGraduationYear) newErrors.expectedGraduationYear = 'Expected graduation year is required';
        if (formData.startYear && formData.expectedGraduationYear && 
            parseInt(formData.expectedGraduationYear) <= parseInt(formData.startYear)) {
          newErrors.expectedGraduationYear = 'Graduation year must be after start year';
        }
        break;
      case 2:
        if (!formData.collegeName) newErrors.collegeName = 'College name is required';
        if (!formData.collegeLocation) newErrors.collegeLocation = 'College location is required';
        if (!formData.degreeType) newErrors.degreeType = 'Degree type is required';
        if (!formData.branchSpecialization) newErrors.branchSpecialization = 'Branch/Specialization is required';
        break;
      case 3:
        if (!formData.intendedCareerDomain) newErrors.intendedCareerDomain = 'Career domain is required';
        if (!formData.longTermGoal) newErrors.longTermGoal = 'Long-term goal is required';
        if (formData.longTermGoal && formData.longTermGoal.length < 20) {
          newErrors.longTermGoal = 'Please provide a more detailed description (minimum 20 characters)';
        }
        break;
      case 4:
        if (formData.coursesInterestedIn.length === 0) newErrors.coursesInterestedIn = 'Please select at least one course interest';
        if (!formData.learningMode) newErrors.learningMode = 'Please select a learning mode';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.startYear && formData.expectedGraduationYear;
      case 2:
        return formData.collegeName && formData.collegeLocation && formData.degreeType && formData.branchSpecialization;
      case 3:
        return formData.intendedCareerDomain && formData.longTermGoal;
      case 4:
        return formData.coursesInterestedIn.length > 0 && formData.learningMode;
      default:
        return false;
    }
  };

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <Calendar className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        </motion.div>
        <h2 className="text-2xl mb-2">Academic Timeline</h2>
        <p className="text-muted-foreground">Let's understand your educational journey</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="startYear">Start Year</Label>
          <Select onValueChange={(value) => handleInputChange('startYear', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select your academic start year" />
            </SelectTrigger>
            <SelectContent>
              {years.slice(0, 10).map(year => (
                <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.startYear && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-destructive mt-1"
            >
              {errors.startYear}
            </motion.p>
          )}
        </div>

        <div>
          <Label htmlFor="expectedGraduationYear">Expected Graduation Year</Label>
          <Select onValueChange={(value) => handleInputChange('expectedGraduationYear', value)}>
            <SelectTrigger>
              <SelectValue placeholder="When do you expect to graduate?" />
            </SelectTrigger>
            <SelectContent>
              {years.map(year => (
                <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.expectedGraduationYear && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-destructive mt-1"
            >
              {errors.expectedGraduationYear}
            </motion.p>
          )}
        </div>

        <div>
          <Label htmlFor="milestones">Academic Milestones & Goals</Label>
          <Textarea
            id="milestones"
            placeholder="Describe your key academic milestones, achievements, or goals (e.g., completed projects, internships, competitions, target scores, etc.)"
            value={formData.milestones}
            onChange={(e) => handleInputChange('milestones', e.target.value)}
            rows={4}
          />
        </div>
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <Building className="h-8 w-8 text-green-600 dark:text-green-400" />
        </motion.div>
        <h2 className="text-2xl mb-2">College Details</h2>
        <p className="text-muted-foreground">Tell us about your educational institution</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="collegeName">College/University Name</Label>
          <Input
            id="collegeName"
            placeholder="Enter your college or university name"
            value={formData.collegeName}
            onChange={(e) => handleInputChange('collegeName', e.target.value)}
          />
          {errors.collegeName && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-destructive mt-1"
            >
              {errors.collegeName}
            </motion.p>
          )}
        </div>

        <div>
          <Label htmlFor="collegeLocation">College Location</Label>
          <Input
            id="collegeLocation"
            placeholder="City, State (e.g., Mumbai, Maharashtra)"
            value={formData.collegeLocation}
            onChange={(e) => handleInputChange('collegeLocation', e.target.value)}
          />
          {errors.collegeLocation && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-destructive mt-1"
            >
              {errors.collegeLocation}
            </motion.p>
          )}
        </div>

        <div>
          <Label htmlFor="degreeType">Degree Type</Label>
          <Select onValueChange={(value) => handleInputChange('degreeType', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select your degree type" />
            </SelectTrigger>
            <SelectContent>
              {degreeTypes.map(degree => (
                <SelectItem key={degree} value={degree}>{degree}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.degreeType && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-destructive mt-1"
            >
              {errors.degreeType}
            </motion.p>
          )}
        </div>

        <div>
          <Label htmlFor="branchSpecialization">Branch/Specialization</Label>
          <Input
            id="branchSpecialization"
            placeholder="e.g., Computer Science, Mechanical Engineering, Psychology"
            value={formData.branchSpecialization}
            onChange={(e) => handleInputChange('branchSpecialization', e.target.value)}
          />
          {errors.branchSpecialization && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-destructive mt-1"
            >
              {errors.branchSpecialization}
            </motion.p>
          )}
        </div>
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <Target className="h-8 w-8 text-purple-600 dark:text-purple-400" />
        </motion.div>
        <h2 className="text-2xl mb-2">Career Aspirations</h2>
        <p className="text-muted-foreground">Share your career goals and aspirations</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="intendedCareerDomain">Intended Career Domain</Label>
          <Select onValueChange={(value) => handleInputChange('intendedCareerDomain', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select your preferred career domain" />
            </SelectTrigger>
            <SelectContent>
              {careerDomains.map(domain => (
                <SelectItem key={domain} value={domain}>{domain}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.intendedCareerDomain && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-destructive mt-1"
            >
              {errors.intendedCareerDomain}
            </motion.p>
          )}
        </div>

        <div>
          <Label htmlFor="longTermGoal">Long-Term Career Goal</Label>
          <Textarea
            id="longTermGoal"
            placeholder="Describe your long-term career aspirations, dream job, or professional goals (e.g., become a software architect, start a tech company, work in space research, etc.)"
            value={formData.longTermGoal}
            onChange={(e) => handleInputChange('longTermGoal', e.target.value)}
            rows={4}
          />
          {errors.longTermGoal && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-destructive mt-1"
            >
              {errors.longTermGoal}
            </motion.p>
          )}
        </div>

        <div>
          <Label>Certifications You Plan to Pursue</Label>
          <p className="text-sm text-muted-foreground mb-4">Select certifications that align with your career goals</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto border rounded-md p-4">
            {availableCertifications.map(cert => (
              <div key={cert} className="flex items-center space-x-2">
                <Checkbox
                  id={cert}
                  checked={formData.certificationsPlanned.includes(cert)}
                  onCheckedChange={(checked) => handleMultiSelectChange('certificationsPlanned', cert, checked as boolean)}
                />
                <Label htmlFor={cert} className="text-sm cursor-pointer">{cert}</Label>
              </div>
            ))}
          </div>
          {formData.certificationsPlanned.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {formData.certificationsPlanned.map(cert => (
                <Badge key={cert} variant="secondary" className="text-xs">{cert}</Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  const renderStep4 = () => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <BookOpen className="h-8 w-8 text-orange-600 dark:text-orange-400" />
        </motion.div>
        <h2 className="text-2xl mb-2">Learning Preferences</h2>
        <p className="text-muted-foreground">Tell us about your learning style and interests</p>
      </div>

      <div className="space-y-6">
        <div>
          <Label>Courses You're Interested In</Label>
          <p className="text-sm text-muted-foreground mb-4">Select areas you'd like to explore or learn more about</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto border rounded-md p-4">
            {courseInterests.map(course => (
              <div key={course} className="flex items-center space-x-2">
                <Checkbox
                  id={course}
                  checked={formData.coursesInterestedIn.includes(course)}
                  onCheckedChange={(checked) => handleMultiSelectChange('coursesInterestedIn', course, checked as boolean)}
                />
                <Label htmlFor={course} className="text-sm cursor-pointer">{course}</Label>
              </div>
            ))}
          </div>
          {formData.coursesInterestedIn.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {formData.coursesInterestedIn.map(course => (
                <Badge key={course} variant="secondary" className="text-xs">{course}</Badge>
              ))}
            </div>
          )}
          {errors.coursesInterestedIn && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-destructive mt-1"
            >
              {errors.coursesInterestedIn}
            </motion.p>
          )}
        </div>

        <Separator />

        <div>
          <Label>Preferred Learning Mode</Label>
          <p className="text-sm text-muted-foreground mb-4">How do you prefer to learn?</p>
          <RadioGroup 
            value={formData.learningMode} 
            onValueChange={(value) => handleInputChange('learningMode', value)}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="online" id="online" />
              <Label htmlFor="online" className="cursor-pointer flex-1">
                <div>
                  <div className="font-medium">Online Learning</div>
                  <div className="text-sm text-muted-foreground">Flexible, self-paced digital courses</div>
                </div>
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="offline" id="offline" />
              <Label htmlFor="offline" className="cursor-pointer flex-1">
                <div>
                  <div className="font-medium">Offline/Classroom Learning</div>
                  <div className="text-sm text-muted-foreground">Traditional in-person classes and workshops</div>
                </div>
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="hybrid" id="hybrid" />
              <Label htmlFor="hybrid" className="cursor-pointer flex-1">
                <div>
                  <div className="font-medium">Hybrid Learning</div>
                  <div className="text-sm text-muted-foreground">Combination of online and offline methods</div>
                </div>
              </Label>
            </div>
          </RadioGroup>
          {errors.learningMode && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-destructive mt-1"
            >
              {errors.learningMode}
            </motion.p>
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        <Card className="p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl">Complete Your Profile</h1>
                  <p className="text-muted-foreground">Hi {user.name}, help us personalize your experience</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground mb-1">Step {currentStep} of {totalSteps}</div>
                <Progress value={progress} className="w-32" />
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="min-h-[500px]">
            <AnimatePresence mode="wait">
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
              {currentStep === 4 && renderStep4()}
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Previous</span>
              </Button>
            </motion.div>

            {/* Skip Button - Always visible */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="ghost"
                onClick={onSkip}
                className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
              >
                <span>Complete Later</span>
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {currentStep === totalSteps ? (
                <Button
                  onClick={handleSubmit}
                  disabled={!isStepValid()}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Complete Profile</span>
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className="flex items-center space-x-2"
                >
                  <span>Next</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}