// Tamagotchi Behavior Code - Under 1KB
const BEHAVIOR_CODE = `
class Pet {
    constructor() {
        this.needs = {h:50,p:50,e:50};
        this.x = Math.random()*240;
        this.y = Math.random()*140;
        this.vx = (Math.random()-.5)*2;
        this.vy = (Math.random()-.5)*2;
        this.mood = 'neutral';
    }
    update() {
        this.needs.h -= .1;
        this.needs.p -= .05;
        this.needs.e -= .08;
        Object.keys(this.needs).forEach(k => this.needs[k] = Math.max(0,Math.min(100,this.needs[k])));
        const a = (this.needs.h+this.needs.p+this.needs.e)/3;
        this.mood = a>70?'happy':a<30?'sad':'neutral';
        this.x += this.vx; this.y += this.vy;
        if(this.x<=0||this.x>=240) this.vx*=-1;
        if(this.y<=0||this.y>=140) this.vy*=-1;
        this.render();
    }
    render() {
        this.el.style.left = this.x+'px';
        this.el.style.top = this.y+'px';
        this.el.className = 'tamagotchi '+this.mood+(this.needs.h<20?' hungry':'');
    }
}
`;

// Main Tamagotchi System
class Tamagotchi {
    constructor() {
        this.behaviorCode = BEHAVIOR_CODE;
        this.openAI = new OpenAIService();
        this.createPet();
        this.startSystems();
    }

    createPet() {
        // Evaluate the behavior code to define the Pet class
        const func = new Function(this.behaviorCode + '; return Pet;');
        const PetClass = func();
        
        this.pet = new PetClass();
        this.display = document.getElementById('tamagotchi-display');
        this.pet.el = document.createElement('div');
        this.pet.el.className = 'tamagotchi';
        this.display.appendChild(this.pet.el);
    }

    updateUI() {
        ['hunger', 'happiness', 'energy'].forEach((need, i) => {
            const key = ['h','p','e'][i];
            const bar = document.getElementById(`${need}-bar`);
            const val = document.getElementById(`${need}-value`);
            bar.style.width = this.pet.needs[key] + '%';
            val.textContent = Math.round(this.pet.needs[key]);
        });
    }

    log(msg) {
        const entries = document.getElementById('log-entries');
        const p = document.createElement('p');
        p.textContent = new Date().toLocaleTimeString() + ': ' + msg;
        entries.insertBefore(p, entries.firstChild);
        if (entries.children.length > 10) entries.removeChild(entries.lastChild);
    }

    startSystems() {
        setInterval(() => {
            this.pet.update();
            this.updateUI();
        }, 100);

        let countdown = 300;
        setInterval(() => {
            countdown--;
            const mins = Math.floor(countdown / 60);
            const secs = countdown % 60;
            document.getElementById('countdown').textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
            
            if (countdown <= 0) {
                this.evolve();
                countdown = 300;
            }
        }, 1000);
    }

    async evolve() {
        const state = `h:${this.pet.needs.h.toFixed(1)},p:${this.pet.needs.p.toFixed(1)},e:${this.pet.needs.e.toFixed(1)},mood:${this.pet.mood}`;
        this.log("AI evolution starting...");
        
        try {
            // Try to use OpenAI API if configured
            if (this.openAI.apiKey) {
                const newCode = await this.openAI.generateBehaviorCode(state, this.behaviorCode);
                
                // Validate the new code is under 1KB
                if (newCode.length > 1024) {
                    throw new Error("Generated code exceeds 1KB limit");
                }
                
                // Update behavior and recreate pet
                this.behaviorCode = newCode;
                this.display.removeChild(this.pet.el);
                this.createPet();
                this.log("Evolution complete! New behavior applied.");
            } else {
                // Simulated evolution for demo without API key
                await new Promise(resolve => setTimeout(resolve, 2000));
                this.log("Evolution simulated (no API key provided)");
            }
        } catch (error) {
            this.log("Evolution failed: " + error.message);
        }
    }
}

const tamagotchi = new Tamagotchi();