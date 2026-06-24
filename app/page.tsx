"use client";
import { useEffect, useState, FormEvent } from 'react';
import CampusMap from './components/CampusMap';
import HCaptcha from '@hcaptcha/react-hcaptcha';

export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    const formData = new FormData(e.currentTarget);
    const hCaptchaResponse = formData.get("h-captcha-response");

    if (!hCaptchaResponse) {
      setIsSubmitting(false);
      setErrorMessage("Please complete the captcha.");
      return;
    }

    formData.append("access_key", process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setIsSuccess(true);
      } else {
        setErrorMessage(data.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setErrorMessage("Network error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };
  useEffect(() => {
    // 1. Scroll Reveal & Stats
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          if (entry.target.classList.contains('stat-num') && !entry.target.hasAttribute('data-counted')) {
            countUp(entry.target as HTMLElement);
            entry.target.setAttribute('data-counted', 'true');
          }
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal, .stat-num, .step-card, .feature-card').forEach(el => {
      observer.observe(el);
    });

    function countUp(el: HTMLElement) {
      const target = parseInt(el.getAttribute('data-target') || '0', 10);
      const duration = 2000;
      const stepTime = Math.abs(Math.floor(duration / Math.max(target, 1)));
      let current = 0;
      const timer = setInterval(() => {
        current += Math.ceil(target / 50) || 1;
        if (current >= target) {
          el.innerText = target.toString();
          clearInterval(timer);
        } else {
          el.innerText = current.toString();
        }
      }, stepTime > 10 ? stepTime : 10);
    }

    // 2. Navbar Scroll
    const handleScroll = () => {
      const navbar = document.getElementById('navbar');
      if (window.scrollY > 50) {
        navbar?.classList.add('scrolled');
      } else {
        navbar?.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    // 3. Mobile Menu
    const hamburger = document.getElementById('hamburger');
    const drawer = document.getElementById('mobileDrawer');
    const overlay = document.getElementById('drawerOverlay');
    
    const toggleDrawer = () => {
      hamburger?.classList.toggle('active');
      drawer?.classList.toggle('active');
      overlay?.classList.toggle('active');
      document.body.style.overflow = drawer?.classList.contains('active') ? 'hidden' : '';
    };

    const closeDrawer = () => {
      hamburger?.classList.remove('active');
      drawer?.classList.remove('active');
      overlay?.classList.remove('active');
      document.body.style.overflow = '';
    };

    hamburger?.addEventListener('click', toggleDrawer);
    overlay?.addEventListener('click', closeDrawer);
    document.querySelectorAll('.mobile-drawer a').forEach(a => {
      a.addEventListener('click', closeDrawer);
    });

    // 4. Cursor Glow Tracking
    const cursor = document.getElementById('cursor-glow');
    const handleMouseMove = (e: MouseEvent) => {
      if (cursor) {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      hamburger?.removeEventListener('click', toggleDrawer);
      overlay?.removeEventListener('click', closeDrawer);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="bg-[#0b101e] min-h-screen text-white font-sans">
      <div id="cursor-glow" className="cursor-glow"></div>

{/*  */}
<nav id="navbar">
  <a href="#hero" className="nav-logo">
    <img src="NAvSULogo.png" alt="NAvSU Logo" className="nav-logo-img" />
    <span className="nav-logo-text">NAvSU</span>
  </a>

  <ul className="nav-links">
    <li><a href="#about">About</a></li>
    <li><a href="#features">Features</a></li>
    <li><a href="#how-it-works">How It Works</a></li>
    <li><a href="#contact">Contact</a></li>
  </ul>

  <a href="#contact" className="nav-cta">Try Demo →</a>

  <button className="hamburger" id="hamburger" aria-label="Menu">
    <span></span><span></span><span></span>
  </button>
</nav>

{/*  */}
<div className="drawer-overlay" id="drawerOverlay"></div>
<div className="mobile-drawer" id="mobileDrawer">
  <a href="#about"        >About</a>
  <a href="#features"     >Features</a>
  <a href="#how-it-works" >How It Works</a>
  <a href="#contact"      >Contact</a>
  <a href="#contact" className="nav-cta" style={{ marginTop: '16px', justifyContent: 'center' }} >Try Demo →</a>
</div>

{/*  */}
<section id="hero">
  <canvas id="hero-canvas"></canvas>

  <div className="hero-content">
    <div className="hero-badge">
      <div className="hero-badge-dot"></div>
      Now Live · NAvSU Campus
    </div>

    <h1 className="hero-h1">
      <span className="line1">Find Your Way.</span>
      <span className="line2">No Map Needed.</span>
    </h1>

    <p className="hero-sub">
      NAvSU is a real-time augmented reality navigation system for campus — guiding students, faculty, and visitors to any office, building, or department in seconds.
    </p>

    <div className="hero-buttons">
      <a href="#about" className="btn-primary">
        Explore the Campus
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </a>
      <a href="#map-preview" className="btn-ghost">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
        </svg>
        View Nav Graph
      </a>
    </div>
  </div>

  <div className="scroll-indicator" id="scrollIndicator">
    <svg className="scroll-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
    Scroll
  </div>
</section>

{/*  */}
<section id="stats">
  <div className="stat-item">
    <span className="stat-num" style={{"color":"var(--accent)"}} data-target="46">0</span>
    <span className="stat-lbl">Nodes</span>
  </div>
  <div className="stat-item">
    <span className="stat-num" style={{"color":"var(--yellow)"}} data-target="47">0</span>
    <span className="stat-lbl">Edges</span>
  </div>
  <div className="stat-item">
    <span className="stat-num" style={{"color":"var(--green)"}} data-target="20" data-suffix="+">0</span>
    <span className="stat-lbl">Buildings</span>
  </div>
  <div className="stat-item">
    <span className="stat-num" style={{"color":"var(--red)"}} data-target="4">0</span>
    <span className="stat-lbl">Entry Points</span>
  </div>
  <div className="stat-item">
    <span className="stat-num" style={{"color":"var(--accent)"}} data-target="1">0</span>
    <span className="stat-lbl">Campus</span>
  </div>
</section>

{/*  */}
<section id="about">
  <div className="about-inner">
    <div className="about-text reveal from-left">
      <span className="section-label dark">About the Project</span>
      <h2 className="section-heading">Built for a Campus.<br/>Designed for Everyone.</h2>
      <p>NAvSU started as a thesis project at the Cavite State University - CCAT Campus  — and grew into a full augmented-reality navigation system used by students, visitors, and faculty alike.</p>
      <p>We mapped every path, junction, and building so that no one ever has to wander the campus lost again.</p>
      <a href="#features" className="text-link">
        See all features
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M7 17L17 7M17 7H7M17 7v10"/>
        </svg>
      </a>
    </div>

    <div className="about-visual reveal from-right">
      <div className="mockups-wrapper">
        <img src="Mockup_1.png" alt="NAvSU Phone Mockup 1" className="mockup-phone mockup-left" />
        <img src="Mockup_2.png" alt="NAvSU Phone Mockup 2" className="mockup-phone mockup-center" />
        <img src="Mockup_3.png" alt="NAvSU Phone Mockup 3" className="mockup-phone mockup-right" />

        <div className="about-badge about-badge-1">
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          46 Nodes mapped
        </div>
        <div className="about-badge about-badge-2">
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          Real-time AR overlay
        </div>
        <div className="about-badge about-badge-3">
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          Admin-managed
        </div>
      </div>
    </div>
  </div>
</section>

{/*  */}
<section id="features">
  <div className="features-inner">
    <div className="features-header reveal">
      <span className="section-label dark">Features</span>
      <h2 className="section-heading">Everything You Need to<br/>Navigate Campus Life.</h2>
      <p className="section-sub">From AR overlays to admin node management — NAvSU is a complete campus wayfinding ecosystem.</p>
    </div>

    <div className="features-grid">
      <div className="feature-card">
        <div className="feature-icon blue">📡</div>
        <h3 className="feature-title">AR Navigation</h3>
        <p className="feature-desc">Point your phone and follow AR waypoints directly to your destination — no typing required.</p>
      </div>
      <div className="feature-card">
        <div className="feature-icon green">🗺️</div>
        <h3 className="feature-title">Interactive Campus Map</h3>
        <p className="feature-desc">A live graph of all 46 campus nodes, 47 paths, and 20+ buildings — searchable and zoomable.</p>
      </div>
      <div className="feature-card">
        <div className="feature-icon blue">🏢</div>
        <h3 className="feature-title">Office Directory</h3>
        <p className="feature-desc">Every office, department, and facility is mapped to a specific AR node for instant lookup.</p>
      </div>
      <div className="feature-card">
        <div className="feature-icon yellow">⚡</div>
        <h3 className="feature-title">Real-Time Updates</h3>
        <p className="feature-desc">Admins can reassign nodes, update office locations, and publish changes instantly via the dashboard.</p>
      </div>
      <div className="feature-card">
        <div className="feature-icon red">🔒</div>
        <h3 className="feature-title">Admin Dashboard</h3>
        <p className="feature-desc">A full office-to-node management system — with status tracking, publish controls, and edit history.</p>
      </div>
      <div className="feature-card">
        <div className="feature-icon green">📍</div>
        <h3 className="feature-title">46 Navigation Nodes</h3>
        <p className="feature-desc">Dense node coverage means accurate routing across every corner of campus — no dead zones.</p>
      </div>
    </div>
  </div>
</section>

{/*  */}
<section id="how-it-works">
  <div className="how-inner">
    <div className="how-header reveal">
      <span className="section-label light">How It Works</span>
      <h2 className="section-heading">Three steps to never<br/>getting lost again.</h2>
      <p className="section-sub">Simple enough for a first-year student. Accurate enough for a visitor on day one.</p>
    </div>

    <div className="steps-row">
      <div className="step-card reveal">
        <div className="step-number-bg">01</div>
        <div className="step-icon-wrap blue">📱</div>
        <h3 className="step-title">Scan</h3>
        <p className="step-desc">Open NAvSU on your phone and point it at the campus entrance to initialize the AR overlay.</p>
      </div>
      <div className="step-card reveal" style={{ transitionDelay: '0.12s' }}>
        <div className="step-number-bg">02</div>
        <div className="step-icon-wrap green">🧭</div>
        <h3 className="step-title">Navigate</h3>
        <p className="step-desc">Follow the AR path overlaid on your camera view — turn-by-turn, node by node.</p>
      </div>
      <div className="step-card reveal" style={{ transitionDelay: '0.24s' }}>
        <div className="step-number-bg">03</div>
        <div className="step-icon-wrap accent">🎯</div>
        <h3 className="step-title">Arrive</h3>
        <p className="step-desc">Reach any office, building, or department in seconds — no wandering, no asking around.</p>
      </div>
    </div>
  </div>
</section>

{/*  */}
<section id="map-preview">
  <div className="map-preview-inner">
    <div className="reveal">
      <span className="section-label light">Live Preview</span>
      <h2 className="section-heading">The Campus at a Glance.</h2>
      <p className="section-sub">Every node. Every path. Every building — visualized in one interactive graph.</p>
    </div>

    <div className="map-embed-wrap reveal" style={{ transitionDelay: '0.1s' }}>
      <div className="map-overlay-bar">
        <div className="dot-red"></div>
        <div className="dot-yellow"></div>
        <div className="dot-green"></div>
        <span className="map-overlay-title">campus-nav-graph · NAvSU · 46 nodes · 47 edges</span>
      </div>
      <div style={{ position:'absolute', top:'44px', left:0, right:0, bottom:0, width:'100%', height:'calc(100% - 44px)' }}>
        <CampusMap />
      </div>
    </div>

    <a href="#contact" className="map-cta reveal" style={{ transitionDelay: '0.2s' }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
      </svg>
      Open Full Map →
    </a>
  </div>
</section>

{/*  */}
<section id="contact">
  <div className="contact-inner">
    <div className="contact-left reveal from-left">
      <span className="section-label dark">Get In Touch</span>
      <h2 className="section-heading">Have a question<br/>about NAvSU?</h2>
      <p>Want to deploy it at your campus? Found a bug? Have a suggestion? We'd love to hear from you.</p>

      <div className="contact-info-list">
        <div className="contact-info-item">
          <div className="contact-info-icon">📧</div>
          <a href="mailto:celda.karl.cyrus110@gmail.com" style={{ color: 'inherit', textDecoration: 'none' }}>celda.karl.cyrus110@gmail.com</a>
        </div>
        <div className="contact-info-item">
          <div className="contact-info-icon">🔗</div>
          <a href="https://www.linkedin.com/in/celdakarlcyrus/" target="_blank" style={{ color: 'inherit', textDecoration: 'none' }}>LinkedIn</a>
        </div>
        <div className="contact-info-item">
          <div className="contact-info-icon">📍</div>
          <span>Rosario, Cavite, Philippines</span>
        </div>
      </div>
    </div>

    <div className="contact-right reveal from-right">
      {!isSuccess ? (
      <form className="contact-form" id="contactForm" onSubmit={handleSubmit}>
        <div className="form-row">
          <label className="form-label" htmlFor="fname">Full Name <span className="req">*</span></label>
          <input className="form-input" id="fname" name="name" type="text" placeholder="Juan dela Cruz" required />
        </div>
        <div className="form-row">
          <label className="form-label" htmlFor="femail">Email Address <span className="req">*</span></label>
          <input className="form-input" id="femail" name="email" type="email" placeholder="juan@campus.edu.ph" required />
        </div>
        <div className="form-row">
          <label className="form-label" htmlFor="fsubject">Subject <span className="req">*</span></label>
          <div className="form-select-wrap">
            <select className="form-select" id="fsubject" name="subject" required>
              <option value="">Select a subject…</option>
              <option>General Inquiry</option>
              <option>Technical Issue</option>
              <option>Partnership</option>
              <option>Feedback</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <label className="form-label" htmlFor="fmessage">Message <span className="req">*</span></label>
          <textarea className="form-textarea" id="fmessage" name="message" placeholder="Tell us what's on your mind…" required></textarea>
        </div>
        {errorMessage && <div className="form-error" style={{display: 'block', marginBottom: '1rem'}}>{errorMessage}</div>}
        
        <div style={{ marginBottom: '1rem' }}>
          <HCaptcha sitekey="50b2fe65-b00b-4b9e-ad62-3ba471098be2" reCaptchaCompat={false} />
        </div>

        <button className="form-submit" type="submit" disabled={isSubmitting} style={{ opacity: isSubmitting ? 0.7 : 1 }}>
          {isSubmitting ? 'Sending...' : 'Send Message'}
          {!isSubmitting && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          )}
        </button>
      </form>
      ) : (
      <div className="contact-form form-success" style={{ display: 'flex' }} id="formSuccess">
        <div className="form-success-icon">✅</div>
        <h3>Message Sent!</h3>
        <p>Thanks for reaching out. We'll get back to you within 1–2 business days.</p>
        <button className="form-submit" onClick={() => setIsSuccess(false)} style={{marginTop: '2rem'}}>
          Send Another Message
        </button>
      </div>
      )}
    </div>
  </div>
</section>

{/*  */}
<footer>
  <div className="footer-main">
    <div className="footer-brand">
      <img src="NAvSULogo.png" alt="NAvSU Logo" className="footer-logo-img" />
      <div className="footer-brand-text">
        <span className="footer-logo-text">NAvSU</span>
        <p className="footer-tagline">Campus AR Navigation System<br/>Cavite State University - CCAT Campus<br/>Rosario, Cavite, Philippines</p>
      </div>
    </div>

    <div className="footer-nav">
      <div className="footer-nav-label">Navigation</div>
      <a href="#about">About</a>
      <a href="#features">Features</a>
      <a href="#how-it-works">How It Works</a>
      <a href="#map-preview">Nav Graph</a>
      <a href="#contact">Contact</a>
    </div>
  </div>

  <div className="footer-bottom">
    <span className="footer-copy">© 2025 NAvSU Project. All rights reserved.</span>
    <span className="footer-love">Built with <span>♥</span> at NAvSU</span>
  </div>
</footer>

    </div>
  );
}
