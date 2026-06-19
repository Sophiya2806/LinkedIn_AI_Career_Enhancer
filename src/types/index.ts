export interface LinkedInProfile {
  headline?: string;
  summary?: string;
  experience?: Experience[];
  education?: Education[];
  skills?: string[];
  certifications?: string[];
  location?: string;
  connections?: number;
}

export interface Experience {
  title: string;
  company: string;
  duration: string;
  description?: string;
}

export interface Education {
  school: string;
  degree: string;
  field: string;
  year: string;
}

export interface AnalysisResult {
  overallScore: number;
  skillsScore: number;
  experienceScore: number;
  atsScore: number;
  communicationScore: number;
  strengths: string[];
  weaknesses: string[];
  missingSkills: string[];
  improvementSuggestions: string[];
  careerRoadmap: RoadmapStep[];
}

export interface RoadmapStep {
  step: number;
  title: string;
  description: string;
  timeline: string;
}

export interface SavedAnalysis {
  id: string;
  user_id: string;
  profile_data: LinkedInProfile;
  analysis_result: AnalysisResult;
  overall_score: number;
  created_at: string;
  updated_at: string;
}
