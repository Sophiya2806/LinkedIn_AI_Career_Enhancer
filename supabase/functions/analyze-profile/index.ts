import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface LinkedInProfile {
  headline?: string;
  summary?: string;
  experience?: Array<{
    title: string;
    company: string;
    duration: string;
    description?: string;
  }>;
  education?: Array<{
    school: string;
    degree: string;
    field: string;
    year: string;
  }>;
  skills?: string[];
  certifications?: string[];
  location?: string;
  connections?: number;
}

interface AnalysisResult {
  overallScore: number;
  skillsScore: number;
  experienceScore: number;
  atsScore: number;
  communicationScore: number;
  strengths: string[];
  weaknesses: string[];
  missingSkills: string[];
  improvementSuggestions: string[];
  careerRoadmap: Array<{
    step: number;
    title: string;
    description: string;
    timeline: string;
  }>;
}

function calculateSkillsScore(skills: string[]): { score: number; missingSkills: string[] } {
  const essentialSkills = [
    'leadership', 'communication', 'project management', 'python', 'javascript',
    'data analysis', 'machine learning', 'cloud', 'aws', 'docker', 'kubernetes',
    'agile', 'scrum', 'strategy', 'team management', 'problem solving'
  ];

  const normalizedSkills = skills.map(s => s.toLowerCase());
  const matchedSkills = essentialSkills.filter(skill =>
    normalizedSkills.some(s => s.includes(skill) || skill.includes(s))
  );

  const skillScore = Math.min(100, (matchedSkills.length / essentialSkills.length) * 100 + (skills.length >= 10 ? 20 : skills.length * 2));
  const missingSkills = essentialSkills.filter(skill =>
    !normalizedSkills.some(s => s.includes(skill) || skill.includes(s))
  ).slice(0, 5);

  return { score: Math.round(skillScore), missingSkills };
}

function calculateExperienceScore(experience: Array<{ title: string; company: string; duration: string; description?: string }>): number {
  if (!experience || experience.length === 0) return 20;

  let score = 40;

  // Years of experience estimation
  const totalYears = experience.reduce((acc, exp) => {
    const yearMatch = exp.duration?.match(/(\d+)\s*(?:years?|yrs?)/i);
    return acc + (yearMatch ? parseInt(yearMatch[1]) : 1);
  }, 0);

  score += Math.min(30, totalYears * 3);

  // Progression check
  const titles = experience.map(e => e.title.toLowerCase());
  const hasProgression = titles.some(t => t.includes('senior') || t.includes('lead') || t.includes('manager') || t.includes('director'));
  if (hasProgression) score += 15;

  // Company reputation (big tech check)
  const bigCompanies = ['google', 'meta', 'amazon', 'apple', 'microsoft', 'netflix', 'uber', 'airbnb', 'linkedin'];
  const hasBigTech = experience.some(e => bigCompanies.some(bc => e.company.toLowerCase().includes(bc)));
  if (hasBigTech) score += 15;

  return Math.min(100, Math.round(score));
}

function calculateATSScore(profile: LinkedInProfile): number {
  let score = 50;

  // Headline optimization
  if (profile.headline && profile.headline.length > 10) {
    score += 10;
    if (/[|]/.test(profile.headline)) score += 5;
  }

  // Summary completeness
  if (profile.summary && profile.summary.length > 100) {
    score += 15;
    if (profile.summary.length > 300) score += 5;
  }

  // Skills section
  if (profile.skills && profile.skills.length >= 5) {
    score += 10;
    if (profile.skills.length >= 15) score += 5;
  }

  // Experience descriptions
  if (profile.experience) {
    const hasDescriptions = profile.experience.some(e => e.description && e.description.length > 50);
    if (hasDescriptions) score += 5;
  }

  // Education
  if (profile.education && profile.education.length > 0) {
    score += 5;
  }

  return Math.min(100, Math.round(score));
}

function calculateCommunicationScore(profile: LinkedInProfile): number {
  let score = 40;

  // Summary clarity
  if (profile.summary) {
    if (profile.summary.length > 50) score += 15;
    // Check for action words
    const actionWords = ['led', 'developed', 'created', 'implemented', 'achieved', 'increased', 'managed', 'built'];
    const summaryLower = profile.summary.toLowerCase();
    const actionWordCount = actionWords.filter(w => summaryLower.includes(w)).length;
    score += Math.min(15, actionWordCount * 3);
  }

  // Headline clarity
  if (profile.headline) {
    if (profile.headline.length > 20 && profile.headline.length < 120) score += 10;
  }

  // Experience descriptions with metrics
  if (profile.experience) {
    const hasMetrics = profile.experience.some(e =>
      e.description && /\d+%|\$\d+|\d+\s*(users|customers|projects|team)/i.test(e.description)
    );
    if (hasMetrics) score += 20;
  }

  return Math.min(100, Math.round(score));
}

function generateStrengths(profile: LinkedInProfile): string[] {
  const strengths: string[] = [];

  if (profile.experience && profile.experience.length >= 3) {
    strengths.push("Strong professional experience with diverse roles");
  }

  if (profile.skills && profile.skills.length >= 10) {
    strengths.push("Comprehensive skills portfolio demonstrating versatility");
  }

  if (profile.summary && profile.summary.length > 200) {
    strengths.push("Well-crafted professional summary that tells your career story");
  }

  if (profile.certifications && profile.certifications.length > 0) {
    strengths.push("Industry-recognized certifications validate your expertise");
  }

  if (profile.experience?.some(e => /senior|lead|manager|director/i.test(e.title))) {
    strengths.push("Demonstrated career progression into leadership roles");
  }

  if (profile.education?.some(e => /mba|master|phd/i.test(e.degree))) {
    strengths.push("Advanced education credentials strengthen your profile");
  }

  if (strengths.length === 0) {
    strengths.push("Active presence on professional networking platform");
  }

  return strengths;
}

function generateWeaknesses(profile: LinkedInProfile): string[] {
  const weaknesses: string[] = [];

  if (!profile.summary || profile.summary.length < 100) {
    weaknesses.push("Profile lacks a compelling professional summary");
  }

  if (!profile.skills || profile.skills.length < 10) {
    weaknesses.push("Limited skills listed reduces discoverability by recruiters");
  }

  if (!profile.experience || profile.experience.length < 2) {
    weaknesses.push("Insufficient work experience details for career advancement");
  }

  if (profile.experience && !profile.experience.some(e => e.description && e.description.length > 50)) {
    weaknesses.push("Experience entries lack detailed accomplishment descriptions");
  }

  if (!profile.certifications || profile.certifications.length === 0) {
    weaknesses.push("No certifications listed to validate professional credentials");
  }

  if (weaknesses.length === 0) {
    weaknesses.push("Consider adding more industry-specific keywords for better visibility");
  }

  return weaknesses;
}

function generateImprovementSuggestions(profile: LinkedInProfile): string[] {
  const suggestions: string[] = [];

  if (!profile.summary || profile.summary.length < 100) {
    suggestions.push("Write a compelling 300-500 character summary highlighting your unique value proposition");
  }

  if (!profile.skills || profile.skills.length < 15) {
    suggestions.push("Add at least 15-20 relevant skills to improve search visibility");
  }

  suggestions.push("Quantify achievements with metrics (e.g., 'Increased revenue by 25%')");

  if (profile.experience) {
    suggestions.push("Add multimedia content (presentations, articles, projects) to showcase work");
  }

  suggestions.push("Request recommendations from colleagues to build social proof");
  suggestions.push("Engage with industry content regularly to increase visibility");

  if (!profile.certifications || profile.certifications.length === 0) {
    suggestions.push("Pursue relevant certifications to validate your expertise");
  }

  return suggestions;
}

function generateCareerRoadmap(profile: LinkedInProfile): Array<{ step: number; title: string; description: string; timeline: string }> {
  const roadmap: Array<{ step: number; title: string; description: string; timeline: string }> = [];

  const currentLevel = profile.experience?.some(e => /director|vp|c-level/i.test(e.title)) ? 'executive' :
    profile.experience?.some(e => /senior|lead|manager/i.test(e.title)) ? 'senior' : 'mid';

  if (currentLevel === 'mid') {
    roadmap.push({
      step: 1,
      title: "Skill Enhancement Phase",
      description: "Complete 2-3 advanced certifications and expand technical expertise. Focus on leadership fundamentals.",
      timeline: "0-6 months"
    });
    roadmap.push({
      step: 2,
      title: "Leadership Development",
      description: "Take on team lead responsibilities, mentor junior members, and contribute to strategic discussions.",
      timeline: "6-12 months"
    });
    roadmap.push({
      step: 3,
      title: "Network Expansion",
      description: "Build relationships with industry leaders, attend conferences, and publish thought leadership content.",
      timeline: "12-18 months"
    });
    roadmap.push({
      step: 4,
      title: "Senior Role Transition",
      description: "Target senior or lead positions with increased scope. Demonstrate measurable business impact.",
      timeline: "18-24 months"
    });
  } else if (currentLevel === 'senior') {
    roadmap.push({
      step: 1,
      title: "Executive Presence Building",
      description: "Develop strategic thinking capabilities and executive communication skills.",
      timeline: "0-6 months"
    });
    roadmap.push({
      step: 2,
      title: "Cross-functional Leadership",
      description: "Lead organization-wide initiatives and build influence across departments.",
      timeline: "6-12 months"
    });
    roadmap.push({
      step: 3,
      title: "Business Impact Delivery",
      description: "Drive measurable revenue impact and operational excellence initiatives.",
      timeline: "12-18 months"
    });
    roadmap.push({
      step: 4,
      title: "Director/VP Transition",
      description: "Position for executive roles through demonstrated strategic value creation.",
      timeline: "18-24 months"
    });
  } else {
    roadmap.push({
      step: 1,
      title: "Board Position Readiness",
      description: "Build governance experience through advisory roles and board participation.",
      timeline: "0-12 months"
    });
    roadmap.push({
      step: 2,
      title: "Industry Influence Expansion",
      description: "Establish thought leadership through speaking engagements and publications.",
      timeline: "12-24 months"
    });
    roadmap.push({
      step: 3,
      title: "C-Level or Board Role",
      description: "Target C-suite positions or board memberships aligned with expertise.",
      timeline: "24-36 months"
    });
  }

  return roadmap;
}

function analyzeProfile(profile: LinkedInProfile): AnalysisResult {
  const { score: skillsScore, missingSkills } = calculateSkillsScore(profile.skills || []);
  const experienceScore = calculateExperienceScore(profile.experience || []);
  const atsScore = calculateATSScore(profile);
  const communicationScore = calculateCommunicationScore(profile);

  const overallScore = Math.round(
    (skillsScore * 0.25) +
    (experienceScore * 0.30) +
    (atsScore * 0.25) +
    (communicationScore * 0.20)
  );

  return {
    overallScore,
    skillsScore,
    experienceScore,
    atsScore,
    communicationScore,
    strengths: generateStrengths(profile),
    weaknesses: generateWeaknesses(profile),
    missingSkills,
    improvementSuggestions: generateImprovementSuggestions(profile),
    careerRoadmap: generateCareerRoadmap(profile)
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const body = await req.json();
    const { profile } = body as { profile: LinkedInProfile };

    if (!profile) {
      return new Response(JSON.stringify({ error: "Profile data is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const analysisResult = analyzeProfile(profile);

    // Ensure profile exists (upsert ignores if already there)
    await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        email: user.email,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });

    const { data: savedProfile, error: saveError } = await supabase
      .from("linkedin_profiles")
      .insert({
        user_id: user.id,
        profile_data: profile,
        analysis_result: analysisResult,
        overall_score: analysisResult.overallScore
      })
      .select()
      .single();

    if (saveError) {
      console.error("Save error:", saveError);
      return new Response(JSON.stringify({ error: "Failed to save analysis" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      analysis: analysisResult,
      profileId: savedProfile.id
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
