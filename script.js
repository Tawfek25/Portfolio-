document.addEventListener('DOMContentLoaded', () => {
  // ---------- Typing animation ----------
  const roles = ["Biotechnology Graduate", "Molecular Biologist", "Microbiologist", "Bioinformatics Enthusiast", "QC & R&D Aspirant"];
  let roleIndex = 0, charIndex = 0, isDeleting = false;
  const typedElement = document.getElementById('typed-role');
  if (!typedElement) return;

  function typeEffect() {
    const currentRole = roles[roleIndex];
    if (isDeleting) {
      typedElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typedElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }
    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      setTimeout(typeEffect, 2000);
      return;
    }
    if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      setTimeout(typeEffect, 300);
      return;
    }
    setTimeout(typeEffect, isDeleting ? 50 : 100);
  }
  typeEffect();

  // ---------- Smooth scroll & active nav ----------
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNav() {
    const scrollPos = window.scrollY + 120;
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop, height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) current = section.id;
    });
    navLinks.forEach(link => {
      link.classList.remove('active-nav');
      if (link.getAttribute('href').substring(1) === current) link.classList.add('active-nav');
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        updateActiveNav();
        const navMenu = document.querySelector('.nav-links');
        if (navMenu && navMenu.classList.contains('show')) navMenu.classList.remove('show');
      }
    });
  });

  window.addEventListener('scroll', updateActiveNav);
  updateActiveNav();

  // ---------- Animated counters ----------
  const counters = [
    { id: 'expMonths', target: 20 },
    { id: 'certCount', target: 12 },
    { id: 'projectsCount', target: 4 }
  ];

  function animateCounter(id, target) {
    const el = document.getElementById(id);
    if (!el) return;
    let current = 0;
    const step = Math.ceil(target / 50);
    const interval = setInterval(() => {
      current += step;
      if (current >= target) {
        el.innerText = target;
        clearInterval(interval);
      } else el.innerText = current;
    }, 20);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        counters.forEach(c => animateCounter(c.id, c.target));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) observer.observe(heroStats);

  // ---------- Radar Chart ----------
  const ctx = document.getElementById('radarChart')?.getContext('2d');
  if (ctx) {
    new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['Molecular Biology', 'Microbiology', 'Enzyme Technology', 'Quality Control', 'Bioinformatics/R'],
        datasets: [{
          label: 'Proficiency %',
          data: [88, 92, 85, 84, 78],
          backgroundColor: 'rgba(15, 139, 124, 0.2)',
          borderColor: '#0f8b7c',
          borderWidth: 2,
          pointBackgroundColor: '#0f8b7c',
          pointBorderColor: '#fff',
          pointRadius: 5,
        }]
      },
      options: { responsive: true, maintainAspectRatio: true, scales: { r: { beginAtZero: true, max: 100 } } }
    });
  }

  // ---------- Training data ----------
  const trainingData = [
    { name: "Good Manufacturing Practices (GMP)", category: "cert", desc: "Certified – essential for pharmaceutical QC." },
    { name: "Hazard Analysis Critical Control Points (HACCP)", category: "cert", desc: "Food safety management system." },
    { name: "Advanced Techniques of Molecular Biology", category: "cert", desc: "PCR, blotting, advanced lab skills." },
    { name: "Basic Bioinformatics", category: "cert", desc: "R programming, sequence analysis." },
    { name: "Microbiology Techniques", category: "workshop", desc: "Isolation, staining, aseptic methods." },
    { name: "Medical Analysis & Lab Diagnostics", category: "cert", desc: "Clinical chemistry & diagnostic methods." },
    { name: "MASRI Lab – Molecular Genomic Unit", category: "workshop", desc: "Full molecular biology training (PCR, gel electrophoresis, animal handling)." },
    { name: "OmniGenics – R Programming", category: "workshop", desc: "From basics to biological data analysis (2024)." },
    { name: "HackBio – Biomarker Discovery", category: "workshop", desc: "Breast cancer transcriptomics, volcano plots." },
    { name: "NRC – Genetics & Cytology", category: "workshop", desc: "Cytology, tissue culture, advanced genetics." }
  ];

  function renderTrainingGrid(filter = "all") {
    const container = document.getElementById('trainingGrid');
    if (!container) return;
    const filtered = trainingData.filter(item => filter === "all" || item.category === filter);
    container.innerHTML = filtered.map(item => `
      <div class="training-item" data-desc="${item.desc.replace(/"/g, '&quot;')}">
        <i class="fas ${item.category === 'cert' ? 'fa-certificate' : 'fa-chalkboard-user'}"></i>
        <h4>${item.name}</h4>
        <div class="train-meta">${item.category === 'cert' ? 'Certification' : 'Workshop / Traineeship'}</div>
        <p style="font-size: 0.85rem; margin-top: 5px;">${item.desc.substring(0, 80)}...</p>
      </div>
    `).join('');
    attachTrainingModal();
  }

  function attachTrainingModal() {
    document.querySelectorAll('.training-item').forEach(el => {
      el.removeEventListener('click', trainingModalHandler);
      el.addEventListener('click', trainingModalHandler);
    });
  }

  function trainingModalHandler(e) {
    const el = e.currentTarget;
    const desc = el.getAttribute('data-desc') || "More details available in CV.";
    const modal = document.createElement('div');
    modal.className = 'custom-modal';
    modal.innerHTML = `<div class="custom-modal-content"><span class="close-modal">&times;</span><h3>Training Details</h3><p>${desc}</p></div>`;
    document.body.appendChild(modal);
    modal.style.display = 'flex';
    modal.querySelector('.close-modal').onclick = () => modal.remove();
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
  }

  function initFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active-filter'));
        btn.classList.add('active-filter');
        renderTrainingGrid(btn.getAttribute('data-filter'));
      });
    });
  }

  renderTrainingGrid('all');
  initFilters();

  // ---------- Mobile menu toggle ----------
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-links');
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', (e) => { e.stopPropagation(); navMenu.classList.toggle('show'); });
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !menuToggle.contains(e.target) && navMenu.classList.contains('show')) {
        navMenu.classList.remove('show');
      }
    });
  }

  // ---------- Force CV download (Blob) ----------
  const downloadBtn = document.getElementById('downloadCVBtn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const cvFileName = 'Tawfek_Ahmed_CV.pdf';
      try {
        const response = await fetch(cvFileName);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = cvFileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (err) {
        alert(`Could not download "${cvFileName}". Please ensure the file exists in the same folder.`);
      }
    });
  }

  // ---------- Canvas background (particles) ----------
  const canvas = document.getElementById('bioCanvas');
  if (canvas) {
    let ctxCanvas = canvas.getContext('2d');
    let width = window.innerWidth, height = window.innerHeight;
    let particles = [];
    const PARTICLE_COUNT = 80;

    function resizeCanvas() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    }

    class BioParticle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.radius = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 0.25;
        this.speedY = (Math.random() - 0.5) * 0.2;
        this.color = `rgba(15, 139, 124, ${Math.random() * 0.35 + 0.1})`;
        this.type = Math.random() > 0.7 ? 'dna' : 'cell';
      }
      draw() {
        if (this.type === 'dna') {
          ctxCanvas.beginPath();
          ctxCanvas.arc(this.x, this.y, this.radius * 0.8, 0, Math.PI * 2);
          ctxCanvas.fillStyle = this.color;
          ctxCanvas.fill();
          ctxCanvas.beginPath();
          ctxCanvas.moveTo(this.x - 2, this.y - 2);
          ctxCanvas.lineTo(this.x + 2, this.y + 2);
          ctxCanvas.strokeStyle = '#0f8b7c';
          ctxCanvas.lineWidth = 0.6;
          ctxCanvas.stroke();
        } else {
          ctxCanvas.beginPath();
          ctxCanvas.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
          ctxCanvas.fillStyle = this.color;
          ctxCanvas.fill();
        }
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < -10) this.x = width + 10;
        if (this.x > width + 10) this.x = -10;
        if (this.y < -10) this.y = height + 10;
        if (this.y > height + 10) this.y = -10;
      }
    }

    function initParticles() {
      particles = Array.from({ length: PARTICLE_COUNT }, () => new BioParticle());
    }

    function animate() {
      if (!ctxCanvas) return;
      ctxCanvas.clearRect(0, 0, width, height);
      particles.forEach(p => { p.update(); p.draw(); });
      requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });
    resizeCanvas();
    initParticles();
    animate();
  }

  // ---------- Modal styles ----------
  if (!document.querySelector('#modal-styles')) {
    const style = document.createElement('style');
    style.id = 'modal-styles';
    style.textContent = `
      .custom-modal{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);display:none;align-items:center;justify-content:center;z-index:1000;backdrop-filter:blur(4px)}
      .custom-modal-content{background:white;max-width:450px;width:90%;padding:2rem;border-radius:32px;position:relative}
      .close-modal{position:absolute;right:20px;top:15px;font-size:1.8rem;cursor:pointer;color:#0f8b7c}
      .custom-modal-content h3{margin-bottom:1rem;color:#0f8b7c}
    `;
    document.head.appendChild(style);
  }
});