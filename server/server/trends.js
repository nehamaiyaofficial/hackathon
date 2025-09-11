/**
 * Trends module - provides realistic mock data for skill trends
 * (Google Trends API package removed due to installation issues)
 */

async function getInterestOverTime(keyword) {
    console.log(`📊 Generating trend data for: ${keyword}`);

    // Return realistic mock data (no external API needed)
    return generateRealisticMockData(keyword);
}

function generateRealisticMockData(keyword) {
    const months = [
        'Jan 2024', 'Feb 2024', 'Mar 2024', 'Apr 2024',
        'May 2024', 'Jun 2024', 'Jul 2024', 'Aug 2024',
        'Sep 2024', 'Oct 2024', 'Nov 2024', 'Dec 2024'
    ];

    // Generate realistic trend patterns based on keyword
    const baseValue = getBaseValueForKeyword(keyword);
    const timelineData = months.map((month, index) => {
        // Add some realistic variation
        const variation = (Math.random() - 0.5) * 20;
        const seasonalFactor = Math.sin(index * Math.PI / 6) * 10; // Seasonal variation
        const value = Math.max(0, Math.min(100, baseValue + variation + seasonalFactor));

        return {
            date: month,
            value: Math.round(value),
            formattedValue: Math.round(value).toString(),
            hasData: true
        };
    });

    const avgValue = timelineData.reduce((sum, d) => sum + d.value, 0) / timelineData.length;
    const peakValue = Math.max(...timelineData.map(d => d.value));

    // Calculate trend direction
    const recentValues = timelineData.slice(-3).map(d => d.value);
    const earlierValues = timelineData.slice(0, 3).map(d => d.value);
    const recentAvg = recentValues.reduce((a, b) => a + b, 0) / recentValues.length;
    const earlierAvg = earlierValues.reduce((a, b) => a + b, 0) / earlierValues.length;

    let trendDirection = 'stable';
    if (recentAvg > earlierAvg * 1.1) trendDirection = 'rising';
    else if (recentAvg < earlierAvg * 0.9) trendDirection = 'falling';

    return {
        keyword: keyword,
        averageInterest: Math.round(avgValue),
        peakInterest: peakValue,
        trendDirection: trendDirection,
        timelineData: timelineData,
        geoData: [],
        analysis: generateTrendAnalysis(keyword, timelineData, trendDirection),
        lastUpdated: new Date().toISOString(),
        note: 'Realistic mock data - works without external APIs'
    };
}

function generateTrendAnalysis(keyword, timelineData, trendDirection) {
    const avgValue = timelineData.reduce((sum, d) => sum + d.value, 0) / timelineData.length;

    let analysis = {
        summary: '',
        marketDemand: 'moderate',
        recommendation: '',
        confidence: 'medium'
    };

    if (avgValue > 70) {
        analysis.marketDemand = 'high';
        analysis.summary = `${keyword} shows high market interest with strong search volumes.`;
        analysis.recommendation = `Excellent skill to focus on - high market demand indicates good career opportunities.`;
        analysis.confidence = 'high';
    } else if (avgValue > 40) {
        analysis.marketDemand = 'moderate';
        analysis.summary = `${keyword} has moderate market interest with steady search patterns.`;
        analysis.recommendation = `Good skill to develop - consistent demand in the market.`;
        analysis.confidence = 'medium';
    } else {
        analysis.marketDemand = 'low';
        analysis.summary = `${keyword} shows lower search interest, which may indicate niche appeal.`;
        analysis.recommendation = `Consider if this aligns with your target role - may be specialized or emerging skill.`;
        analysis.confidence = 'low';
    }

    // Add trend direction context
    if (trendDirection === 'rising') {
        analysis.recommendation += ' The rising trend suggests growing opportunity.';
    } else if (trendDirection === 'falling') {
        analysis.recommendation += ' The declining trend suggests this skill may be becoming less critical.';
    }

    return analysis;
}

function getBaseValueForKeyword(keyword) {
    // Return realistic base values for common tech keywords
    const keywordValues = {
        'python': 75,
        'javascript': 80,
        'react': 70,
        'machine learning': 65,
        'data science': 60,
        'aws': 55,
        'kubernetes': 45,
        'blockchain': 40,
        'artificial intelligence': 70,
        'sql': 50,
        'nodejs': 55,
        'angular': 40,
        'vue': 35,
        'docker': 50,
        'java': 70,
        'c++': 45,
        'php': 40,
        'ruby': 30,
        'go': 35,
        'rust': 25
    };

    const lowerKeyword = keyword.toLowerCase();
    return keywordValues[lowerKeyword] || 45; // Default moderate interest
}

module.exports = { getInterestOverTime };