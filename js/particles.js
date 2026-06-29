/* Particles Background Animation */
class ParticlesBackground {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: null, y: null, radius: 120 };
    this.maxParticles = 80;
    this.connectionDistance = 100;
    
    this.init();
    this.animate();
    this.setupEventListeners();
  }

  init() {
    this.resizeCanvas();
    this.createParticles();
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    
    // Adjust density based on screen size
    if (window.innerWidth < 768) {
      this.maxParticles = 30;
      this.connectionDistance = 70;
    } else {
      this.maxParticles = 80;
      this.connectionDistance = 100;
    }
  }

  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.maxParticles; i++) {
      const size = Math.random() * 2 + 1; // particle size 1-3px
      const x = Math.random() * (this.canvas.width - size * 2) + size;
      const y = Math.random() * (this.canvas.height - size * 2) + size;
      const directionX = (Math.random() * 0.4) - 0.2; // slow movement
      const directionY = (Math.random() * 0.4) - 0.2;
      const color = Math.random() > 0.5 ? '#7c3aed' : '#06b6d4'; // Violet or Cyan
      
      this.particles.push(new Particle(x, y, directionX, directionY, size, color));
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Update and draw particles
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].update(this.canvas.width, this.canvas.height, this.mouse);
      this.particles[i].draw(this.ctx);
    }
    
    this.connectParticles();
    requestAnimationFrame(this.animate.bind(this));
  }

  connectParticles() {
    for (let a = 0; a < this.particles.length; a++) {
      for (let b = a; b < this.particles.length; b++) {
        const dx = this.particles[a].x - this.particles[b].x;
        const dy = this.particles[a].y - this.particles[b].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.connectionDistance) {
          // Fade connection line as particles get further
          const alpha = (1 - (distance / this.connectionDistance)) * 0.15;
          
          // Connect with a subtle gradient-like line
          this.ctx.strokeStyle = `rgba(124, 58, 237, ${alpha})`;
          this.ctx.lineWidth = 0.8;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[a].x, this.particles[a].y);
          this.ctx.lineTo(this.particles[b].x, this.particles[b].y);
          this.ctx.stroke();
        }
      }
    }
  }

  setupEventListeners() {
    window.addEventListener('resize', () => {
      this.resizeCanvas();
      this.createParticles();
    });

    window.addEventListener('mousemove', (event) => {
      this.mouse.x = event.x;
      this.mouse.y = event.y;
    });

    window.addEventListener('mouseout', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });
  }
}

class Particle {
  constructor(x, y, directionX, directionY, size, color) {
    this.x = x;
    this.y = y;
    this.directionX = directionX;
    this.directionY = directionY;
    this.size = size;
    this.color = color;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 8;
    ctx.shadowColor = this.color;
    ctx.fill();
    ctx.shadowBlur = 0; // reset shadow
  }

  update(width, height, mouse) {
    // Check boundaries and bounce
    if (this.x > width || this.x < 0) {
      this.directionX = -this.directionX;
    }
    if (this.y > height || this.y < 0) {
      this.directionY = -this.directionY;
    }

    // Interactive mouse repulsion
    if (mouse.x !== null && mouse.y !== null) {
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < mouse.radius) {
        const force = (mouse.radius - distance) / mouse.radius;
        const angle = Math.atan2(dy, dx);
        const pushX = Math.cos(angle) * force * 1.5;
        const pushY = Math.sin(angle) * force * 1.5;
        
        this.x += pushX;
        this.y += pushY;
      }
    }

    // Move particle
    this.x += this.directionX;
    this.y += this.directionY;
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  new ParticlesBackground('particles-canvas');
});
