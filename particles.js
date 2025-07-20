// ==================== DYNAMIC PARTICLES BACKGROUND ====================

class ParticlesBackground {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 150 };
        this.animationId = null;
        
        // Configuration
        this.config = {
            particleCount: 100,
            particleSize: { min: 1, max: 3 },
            speed: { min: 0.1, max: 0.3 },
            connectionDistance: 150,
            mouseInteractionDistance: 200,
            colors: {
                particle: 'rgba(79, 70, 229, 0.6)', // Primary color
                connection: 'rgba(79, 70, 229, 0.1)',
                mouseConnection: 'rgba(255, 215, 0, 0.2)' // Gold accent
            }
        };
        
        this.init();
    }
    
    init() {
        this.resize();
        this.createParticles();
        this.setupEventListeners();
        this.animate();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        this.particles = [];
        
        for (let i = 0; i < this.config.particleCount; i++) {
            this.particles.push(new Particle(
                Math.random() * this.canvas.width,
                Math.random() * this.canvas.height,
                Math.random() * (this.config.particleSize.max - this.config.particleSize.min) + this.config.particleSize.min,
                (Math.random() - 0.5) * this.config.speed.max,
                (Math.random() - 0.5) * this.config.speed.max,
                this.config.colors.particle
            ));
        }
    }
    
    setupEventListeners() {
        // Mouse move
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        
        // Mouse leave
        window.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
        
        // Resize
        window.addEventListener('resize', () => {
            this.resize();
            this.createParticles();
        });
        
        // Performance optimization - pause when tab is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pause();
            } else {
                this.resume();
            }
        });
    }
    
    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        
        // Clear canvas
        this.ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        this.particles.forEach(particle => {
            particle.update(this.canvas.width, this.canvas.height);
            particle.draw(this.ctx);
            
            // Mouse interaction
            if (this.mouse.x !== null && this.mouse.y !== null) {
                const dx = this.mouse.x - particle.x;
                const dy = this.mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.config.mouseInteractionDistance) {
                    const force = (this.config.mouseInteractionDistance - distance) / this.config.mouseInteractionDistance;
                    const angle = Math.atan2(dy, dx);
                    
                    particle.vx -= Math.cos(angle) * force * 0.5;
                    particle.vy -= Math.sin(angle) * force * 0.5;
                }
            }
        });
        
        // Draw connections
        this.drawConnections();
    }
    
    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.config.connectionDistance) {
                    const opacity = 1 - (distance / this.config.connectionDistance);
                    
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = this.config.colors.connection.replace('0.1', opacity * 0.1);
                    this.ctx.lineWidth = 1;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
            
            // Mouse connections
            if (this.mouse.x !== null && this.mouse.y !== null) {
                const dx = this.mouse.x - this.particles[i].x;
                const dy = this.mouse.y - this.particles[i].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.mouse.radius) {
                    const opacity = 1 - (distance / this.mouse.radius);
                    
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = this.config.colors.mouseConnection.replace('0.2', opacity * 0.2);
                    this.ctx.lineWidth = 2;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.mouse.x, this.mouse.y);
                    this.ctx.stroke();
                }
            }
        }
    }
    
    pause() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    resume() {
        if (!this.animationId) {
            this.animate();
        }
    }
    
    destroy() {
        this.pause();
        window.removeEventListener('mousemove', this.handleMouseMove);
        window.removeEventListener('resize', this.handleResize);
    }
}

// Particle class
class Particle {
    constructor(x, y, size, vx, vy, color) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.baseSize = size;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.pulsePhase = Math.random() * Math.PI * 2;
    }
    
    update(canvasWidth, canvasHeight) {
        // Move particle
        this.x += this.vx;
        this.y += this.vy;
        
        // Bounce off edges
        if (this.x < 0 || this.x > canvasWidth) {
            this.vx = -this.vx;
        }
        if (this.y < 0 || this.y > canvasHeight) {
            this.vy = -this.vy;
        }
        
        // Keep particles within bounds
        this.x = Math.max(0, Math.min(canvasWidth, this.x));
        this.y = Math.max(0, Math.min(canvasHeight, this.y));
        
        // Pulse effect
        this.pulsePhase += 0.02;
        this.size = this.baseSize + Math.sin(this.pulsePhase) * 0.5;
        
        // Damping
        this.vx *= 0.99;
        this.vy *= 0.99;
        
        // Add small random movement
        this.vx += (Math.random() - 0.5) * 0.01;
        this.vy += (Math.random() - 0.5) * 0.01;
        
        // Speed limit
        const maxSpeed = 1;
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed > maxSpeed) {
            this.vx = (this.vx / speed) * maxSpeed;
            this.vy = (this.vy / speed) * maxSpeed;
        }
    }
    
    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        
        // Glow effect
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 3);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, 'transparent');
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
    }
}

// Alternative geometric particles system
class GeometricParticles {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.shapes = [];
        this.time = 0;
        
        this.config = {
            shapeCount: 20,
            colors: [
                'rgba(79, 70, 229, 0.1)',
                'rgba(99, 102, 241, 0.1)', 
                'rgba(139, 92, 246, 0.1)',
                'rgba(255, 215, 0, 0.05)'
            ],
            rotationSpeed: 0.001,
            floatSpeed: 0.0005
        };
        
        this.init();
    }
    
    init() {
        this.resize();
        this.createShapes();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createShapes() {
        this.shapes = [];
        
        for (let i = 0; i < this.config.shapeCount; i++) {
            const type = ['triangle', 'square', 'hexagon'][Math.floor(Math.random() * 3)];
            const size = Math.random() * 100 + 50;
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const rotation = Math.random() * Math.PI * 2;
            const rotationSpeed = (Math.random() - 0.5) * this.config.rotationSpeed;
            const floatSpeed = Math.random() * this.config.floatSpeed + this.config.floatSpeed;
            const color = this.config.colors[Math.floor(Math.random() * this.config.colors.length)];
            
            this.shapes.push({
                type, size, x, y, rotation, rotationSpeed, floatSpeed, color,
                initialY: y,
                floatPhase: Math.random() * Math.PI * 2
            });
        }
    }
    
    drawShape(shape) {
        this.ctx.save();
        this.ctx.translate(shape.x, shape.y);
        this.ctx.rotate(shape.rotation);
        this.ctx.fillStyle = shape.color;
        this.ctx.strokeStyle = shape.color.replace('0.1', '0.2').replace('0.05', '0.1');
        this.ctx.lineWidth = 2;
        
        this.ctx.beginPath();
        
        switch (shape.type) {
            case 'triangle':
                this.ctx.moveTo(0, -shape.size / 2);
                this.ctx.lineTo(-shape.size / 2, shape.size / 2);
                this.ctx.lineTo(shape.size / 2, shape.size / 2);
                this.ctx.closePath();
                break;
                
            case 'square':
                this.ctx.rect(-shape.size / 2, -shape.size / 2, shape.size, shape.size);
                break;
                
            case 'hexagon':
                for (let i = 0; i < 6; i++) {
                    const angle = (Math.PI / 3) * i;
                    const x = Math.cos(angle) * shape.size / 2;
                    const y = Math.sin(angle) * shape.size / 2;
                    if (i === 0) {
                        this.ctx.moveTo(x, y);
                    } else {
                        this.ctx.lineTo(x, y);
                    }
                }
                this.ctx.closePath();
                break;
        }
        
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.restore();
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.time += 1;
        
        this.shapes.forEach(shape => {
            // Update rotation
            shape.rotation += shape.rotationSpeed;
            
            // Floating motion
            shape.floatPhase += shape.floatSpeed;
            shape.y = shape.initialY + Math.sin(shape.floatPhase) * 30;
            
            // Draw with blur effect
            this.ctx.filter = 'blur(1px)';
            this.drawShape(shape);
            this.ctx.filter = 'none';
        });
    }
}

// Initialize particles when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check which canvas exists and initialize appropriate system
    if (document.getElementById('particles-canvas')) {
        new ParticlesBackground('particles-canvas');
    } else if (document.getElementById('geometric-canvas')) {
        new GeometricParticles('geometric-canvas');
    }
});

// Export for use in other scripts
window.ParticlesBackground = ParticlesBackground;
window.GeometricParticles = GeometricParticles;