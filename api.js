// OpenAI API Integration for Tamagotchi Evolution
// Note: For security, this requires a backend proxy or CORS-enabled proxy service

class OpenAIService {
    constructor() {
        // In production, use environment variables or a backend service
        this.apiKey = null; // Set via user input or backend
        this.baseUrl = 'https://api.openai.com/v1/chat/completions';
    }

    setApiKey(key) {
        this.apiKey = key;
    }

    async generateBehaviorCode(currentState, currentCode) {
        if (!this.apiKey) {
            throw new Error('OpenAI API key not configured');
        }

        const prompt = `You are an AI that evolves a Tamagotchi's behavior code. Current state: ${currentState}

Current behavior code:
${currentCode}

Please generate new JavaScript behavior code (under 1KB) that:
1. Keeps the same basic structure (Pet class with constructor, update, render methods)
2. Makes the Tamagotchi more interesting based on its current needs
3. May add new behaviors, animations, or personality traits
4. Must stay under 1KB in size
5. Should be valid JavaScript that can be executed

Return ONLY the JavaScript code, no explanations:`;

        const response = await fetch(this.baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 800,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content.trim();
    }
}

// Export for use in main app
window.OpenAIService = OpenAIService;