/**
 * Gemini AI integration for skills extraction
 * Returns structured JSON with skills analysis
 */

const axios = require('axios');

async function extractSkillsWithGemini({ text, desiredRole = 'General' }) {
    const apiKey = process.env.GEMINI_API_KEY;

    // If no API key, return demo data with basic keyword detection
    if (!apiKey) {
        console.log('No Gemini API key found, using demo mode');
        return generateDemoAnalysis(text, desiredRole);
    }

    try {
        // Construct prompt for structured output
        const prompt = `
Analyze this CV/resume text for the role: ${desiredRole}

CV Text:
${text}

Please provide a JSON response with this exact structure:
{
  "skills": [
    {
      "name": "skill name",
      "category": "Programming|Databases|AI/ML|Tools|Soft Skills",
      "level": number_0_to_10,
      "required": number_0_to_10,
      "years_experience": number
    }
  ],
  "missing_skills": [
    {
      "name": "skill name",
      "reason": "why this skill is missing or needed"
    }
  ],
  "recommended_courses": [
    {
      "title": "course title",
      "provider": "provider name",
      "url": "course url or relevant link"
    }
  ],
  "roadmap": [
    {
      "month": "Month X-Y",
      "milestone": "what to achieve"
    }
  ]
}

Focus on skills relevant to ${desiredRole}. Be realistic about skill levels based on the CV content.
`;

        // Call Gemini API
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        const generatedText = response.data.candidates[0].content.parts[0].text;

        // Try to extract JSON from the response
        const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const skillsData = JSON.parse(jsonMatch[0]);
            return {
                source: 'gemini',
                ...skillsData
            };
        } else {
            throw new Error('Could not parse JSON from Gemini response');
        }

    } catch (error) {
        console.error('Gemini API error:', error.message);

        // Fallback to demo mode if API fails
        return generateDemoAnalysis(text, desiredRole);
    }
}

function generateDemoAnalysis(text, desiredRole) {
    const lowered = (text || '').toLowerCase();

    // Basic keyword detection
    const skillKeywords = {
        'Python': ['python', 'py', 'django', 'flask', 'pandas', 'numpy'],
        'JavaScript': ['javascript', 'js', 'node', 'react', 'angular', 'vue'],
        'SQL': ['sql', 'mysql', 'postgresql', 'database', 'queries'],
        'Machine Learning': ['machine learning', 'ml', 'tensorflow', 'pytorch', 'scikit'],
        'Data Analysis': ['data analysis', 'analytics', 'excel', 'tableau', 'power bi'],
        'Project Management': ['project management', 'agile', 'scrum', 'jira'],
        'Communication': ['communication', 'presentation', 'leadership', 'team']
    };

    const skills = [];
    Object.entries(skillKeywords).forEach(([skill, keywords]) => {
        const found = keywords.some(keyword => lowered.includes(keyword));
        const level = found ? Math.floor(Math.random() * 4) + 5 : Math.floor(Math.random() * 3) + 1;
        const required = Math.floor(Math.random() * 3) + 7;

        skills.push({
            name: skill,
            category: getCategoryForSkill(skill),
            level: level,
            required: required,
            years_experience: found ? Math.floor(Math.random() * 3) + 1 : 0
        });
    });

    const missing_skills = [
        { name: 'Cloud Computing', reason: 'No AWS/Azure/GCP experience mentioned' },
        { name: 'DevOps', reason: 'Limited CI/CD pipeline experience' }
    ];

    const recommended_courses = [
        { title: 'Complete Python Bootcamp', provider: 'Udemy', url: 'https://www.udemy.com' },
        { title: 'Data Science Specialization', provider: 'Coursera', url: 'https://www.coursera.org' },
        { title: 'AWS Cloud Practitioner', provider: 'AWS', url: 'https://aws.amazon.com/training' }
    ];

    const roadmap = [
        { month: 'Month 1-2', milestone: 'Strengthen core programming skills' },
        { month: 'Month 3-4', milestone: 'Complete relevant certification' },
        { month: 'Month 5-6', milestone: 'Build portfolio projects' }
    ];

    return {
        source: 'demo',
        skills,
        missing_skills,
        recommended_courses,
        roadmap
    };
}

function getCategoryForSkill(skill) {
    const categories = {
        'Python': 'Programming',
        'JavaScript': 'Programming',
        'SQL': 'Databases',
        'Machine Learning': 'AI/ML',
        'Data Analysis': 'Analytics',
        'Project Management': 'Management',
        'Communication': 'Soft Skills'
    };
    return categories[skill] || 'General';
}

module.exports = { extractSkillsWithGemini };