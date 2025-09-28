# Tamaigotchi - Self-Evolving Pet

A Tamagotchi-like bot that can change its own source code using an LLM. This is a web-based application that can be deployed on GitHub Pages.

![Tamagotchi App](https://github.com/user-attachments/assets/55748e3f-6618-4ab8-896c-0f2717db990b)

## Features

- **Interactive Tamagotchi**: A virtual pet that moves around in a fixed-size display area
- **Needs System**: The pet has hunger, happiness, and energy needs that decrease over time
- **Visual Feedback**: Color-coded mood states (happy=yellow, sad=gray, neutral=pink)
- **Self-Evolution**: Every 5 minutes, the pet can request AI to rewrite its behavior code
- **OpenAI Integration**: Uses GPT to generate new behavior patterns (API key required)
- **Activity Log**: Real-time logging of pet activities and evolution events
- **GitHub Pages Ready**: Pure frontend application with no backend dependencies

## How It Works

### Core Architecture

1. **Behavior Code**: The pet's behavior is controlled by a JavaScript class (`Pet`) stored as a string (≤1KB)
2. **Dynamic Execution**: The behavior code is evaluated dynamically using `new Function()`
3. **AI Evolution**: Every 5 minutes, the pet generates a prompt based on its current state and asks OpenAI to rewrite its behavior
4. **State Management**: The pet maintains hunger, happiness, and energy levels that affect its mood and appearance

### Behavior Code Structure

The behavior code follows this structure:
```javascript
class Pet {
    constructor() {
        // Initialize needs, position, velocity, mood
    }
    update() {
        // Update needs, movement, mood logic
    }
    render() {
        // Update visual appearance and position
    }
}
```

## Setup and Deployment

### Local Development

1. Clone the repository
2. Serve the files using any HTTP server:
   ```bash
   python3 -m http.server 8000
   # or
   npx http-server
   ```
3. Open `http://localhost:8000` in your browser

### GitHub Pages Deployment

1. Push your code to a GitHub repository
2. Go to repository Settings > Pages
3. Select source branch (usually `main`)
4. Your Tamagotchi will be available at `https://username.github.io/repository-name`

### OpenAI API Integration

To enable AI evolution:

1. Get an OpenAI API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Enter the API key in the input field at the bottom of the app
3. Click "Set Key" to activate AI evolution

**Note**: For production use, implement a backend service to securely handle API keys. The current implementation stores the key client-side for demonstration purposes.

## File Structure

```
├── index.html          # Main HTML structure
├── style.css           # Styling and animations
├── tamagotchi.js       # Core pet logic and system management
├── api.js              # OpenAI API integration
└── README.md           # This file
```

## Customization

### Modifying Behavior

The initial behavior code can be modified in `tamagotchi.js` in the `BEHAVIOR_CODE` constant. Keep it under 1KB for optimal performance.

### Styling

Customize the appearance by modifying `style.css`. The Tamagotchi's visual states are controlled by CSS classes:
- `.happy` - Yellow color, slightly larger
- `.sad` - Gray color, slightly smaller  
- `.hungry` - Bouncing animation
- `.sleeping` - Blue color, smaller size

### Evolution Prompts

The AI evolution prompts can be customized in the `evolve()` method in `tamagotchi.js`.

## Technical Details

- **Size Limit**: Behavior code is limited to 1KB to ensure fast execution and evolution
- **Update Frequency**: Pet updates 10 times per second (100ms intervals)
- **Evolution Interval**: AI evolution occurs every 5 minutes (300 seconds)
- **API Model**: Uses GPT-3.5-turbo for code generation
- **Browser Compatibility**: Works in all modern browsers with ES6 support

## Security Considerations

- API keys are stored client-side (not recommended for production)
- Generated code is executed using `new Function()` (safer than `eval()`)
- For production deployment, implement a backend proxy for API calls

## License

MIT License - Feel free to modify and distribute as needed.
