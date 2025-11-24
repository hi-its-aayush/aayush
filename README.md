<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Aayush Acharya | My Journey</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="description" content="The personal journey, skills, and projects of Aayush Acharya – combining hospitality, IT support, and finance." />

  <style>
    :root {
      --bg: #0f172a;
      --bg-alt: #020617;
      --card: #111827;
      --accent: #38bdf8;
      --accent-soft: rgba(56, 189, 248, 0.1);
      --text: #e5e7eb;
      --muted: #9ca3af;
      --border: #1f2937;
      --radius-lg: 18px;
      --radius-xl: 24px;
      --shadow-soft: 0 18px 45px rgba(15, 23, 42, 0.8);
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: radial-gradient(circle at top, #1e293b, #020617 55%);
      color: var(--text);
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }

    a {
      color: inherit;
      text-decoration: none;
    }

    img {
      max-width: 100%;
      display: block;
    }

    /* Layout */
    .page {
      max-width: 1100px;
      margin: 0 auto;
      padding: 20px 16px 60px;
    }

    @media (min-width: 768px) {
      .page {
        padding: 32px 20px 72px;
      }
    }

    header {
      position: sticky;
      top: 0;
      z-index: 20;
      backdrop-filter: blur(16px);
      background: linear-gradient(to bottom,
        rgba(15, 23, 42, 0.96),
        rgba(15, 23, 42, 0.85),
        transparent
      );
      border-bottom: 1px solid rgba(31, 41, 55, 0.7);
    }

    .nav-inner {
      max-width: 1100px;
      margin: 0 auto;
      padding: 8px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .logo-mark {
      width: 32px;
      height: 32px;
      border-radius: 999px;
      background: radial-gradient(circle at 30% 20%, #38bdf8, #0f172a);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 16px;
      color: #e0f2fe;
      box-shadow: 0 0 0 1px rgba(56, 189, 248, 0.5),
                  0 10px 25px rgba(15, 23, 42, 0.8);
    }

    .logo-text-main {
      font-weight: 600;
      font-size: 15px;
      letter-spacing: 0.03em;
    }

    .logo-text-sub {
      font-size: 11px;
      color: var(--muted);
    }

    nav {
      display: none;
      gap: 16px;
      font-size: 14px;
    }

    @media (min-width: 768px) {
      nav {
        display: flex;
      }
    }

    nav a {
      padding: 6px 10px;
      border-radius: 999px;
      color: var(--muted);
      border: 1px solid transparent;
      transition: all 0.15s ease-out;
    }

    nav a:hover {
      color: var(--text);
      border-color: rgba(55, 65, 81, 0.8);
      background: rgba(15, 23, 42, 0.9);
    }

    .nav-cta {
      padding: 7px 13px;
      border-radius: 999px;
      background: linear-gradient(135deg, #38bdf8, #22c55e);
      color: #0b1120;
      font-weight: 600;
      box-shadow: 0 14px 35px rgba(56, 189, 248, 0.4);
      border: none;
    }

    .nav-cta:hover {
      filter: brightness(1.05);
    }

    /* Hero */
    .hero {
      display: grid;
      grid-template-columns: minmax(0, 3fr);
      gap: 28px;
      margin-top: 32px;
      align-items: center;
    }

    @media (min-width: 900px) {
      .hero {
        grid-template-columns: minmax(0, 7fr) minmax(0, 4fr);
        gap: 36px;
        margin-top: 48px;
      }
    }

    .pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 4px 10px 4px 4px;
      border-radius: 999px;
      border: 1px solid rgba(55, 65, 81, 0.8);
      background: radial-gradient(circle at top left, rgba(56, 189, 248, 0.2), rgba(15, 23, 42, 0.9));
      font-size: 11px;
      color: var(--muted);
      margin-bottom: 14px;
    }

    .pill-dot {
      width: 18px;
      height: 18px;
      border-radius: 999px;
      background: radial-gradient(circle at 30% 20%, #22c55e, #16a34a);
      box-shadow: 0 0 0 1px rgba(22, 163, 74, 0.5),
                  0 0 12px rgba(34, 197, 94, 0.8);
    }

    .hero h1 {
      font-size: clamp(26px, 4vw, 34px);
      line-height: 1.15;
      letter-spacing: 0.01em;
      margin-bottom: 10px;
    }

    .hero h1 span {
      color: #7dd3fc;
    }

    .hero-subtitle {
      font-size: 15px;
      color: var(--muted);
      max-width: 550px;
      margin-bottom: 18px;
    }

    .hero-subtitle b {
      color: #e5e7eb;
      font-weight: 600;
    }

    .hero-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      font-size: 12px;
      margin-bottom: 22px;
      color: var(--muted);
    }

    .hero-meta span {
      padding: 4px 10px;
      border-radius: 999px;
      border: 1px solid rgba(55, 65, 81, 0.9);
      background: rgba(15, 23, 42, 0.9);
    }

    .hero-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 14px;
    }

    .btn-primary {
      padding: 9px 18px;
      border-radius: 999px;
      border: none;
      background: linear-gradient(135deg, #38bdf8, #0ea5e9);
      color: #0f172a;
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 18px 40px rgba(8, 47, 73, 0.9);
    }

    .btn-primary:hover {
      filter: brightness(1.06);
    }

    .btn-secondary {
      padding: 9px 16px;
      border-radius: 999px;
      border: 1px solid rgba(55, 65, 81, 0.9);
      background: rgba(15, 23, 42, 0.95);
      color: var(--muted);
      font-size: 13px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    .btn-secondary:hover {
      border-color: rgba(75, 85, 99, 1);
      color: var(--text);
    }

    .hero-note {
      font-size: 11px;
      color: var(--muted);
    }

    /* Hero profile card */
    .hero-card {
      background: radial-gradient(circle at top left, rgba(56, 189, 248, 0.2), #020617);
      border-radius: var(--radius-xl);
      padding: 18px 18px 16px;
      border: 1px solid rgba(31, 41, 55, 0.9);
      box-shadow: var(--shadow-soft);
      position: relative;
      overflow: hidden;
    }

    .hero-card::before {
      content: "";
      position: absolute;
      inset: -40%;
      background:
        radial-gradient(circle at 20% 0%, rgba(56, 189, 248, 0.25), transparent 55%),
        radial-gradient(circle at 80% 100%, rgba(129, 140, 248, 0.23), transparent 55%);
      opacity: 0.65;
      pointer-events: none;
    }

    .hero-card-inner {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 12px;
      z-index: 1;
    }

    .hero-card-top {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .avatar {
      width: 64px;
      height: 64px;
      border-radius: 20px;
      background: radial-gradient(circle at 30% 20%, #38bdf8, #0f172a);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 26px;
      font-weight: 700;
      color: #e0f2fe;
      box-shadow: 0 0 0 1px rgba(15, 23, 42, 0.95),
                  0 18px 35px rgba(15, 23, 42, 1);
    }

    .hero-card-name {
      font-size: 17px;
      font-weight: 600;
    }

    .hero-card-role {
      font-size: 13px;
      color: #bfdbfe;
    }

    .hero-card-location {
      font-size: 12px;
      color: var(--muted);
    }

    .hero-chip-row {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      font-size: 11px;
    }

    .hero-chip {
      padding: 4px 8px;
      border-radius: 999px;
      background: rgba(15, 23, 42, 0.9);
      border: 1px solid rgba(30, 64, 175, 0.9);
      color: #93c5fd;
    }

    .hero-chip.soft {
      border-color: rgba(56, 189, 248, 0.7);
      color: #7dd3fc;
    }

    .hero-card-links {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      font-size: 11px;
    }

    .hero-link {
      padding: 6px 9px;
      border-radius: 999px;
      background: rgba(15, 23, 42, 0.9);
      border: 1px solid rgba(30, 64, 175, 0.9);
      color: #bfdbfe;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .hero-link span.icon {
      font-size: 13px;
    }

    /* Sections */

    section {
      margin-top: 40px;
    }

    @media (min-width: 768px) {
      section {
        margin-top: 52px;
      }
    }

    .section-header {
      margin-bottom: 20px;
    }

    .section-kicker {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.18em;
      color: var(--muted);
      margin-bottom: 4px;
    }

    .section-title {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 6px;
    }

    .section-subtitle {
      font-size: 13px;
      color: var(--muted);
      max-width: 620px;
    }

    .card-grid {
      display: grid;
      gap: 14px;
    }

    @media (min-width: 768px) {
      .card-grid-2 {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    .card {
      background: radial-gradient(circle at top left, rgba(15, 23, 42, 0.95), rgba(2, 6, 23, 0.98));
      border-radius: var(--radius-lg);
      padding: 14px 14px 13px;
      border: 1px solid rgba(31, 41, 55, 0.95);
      box-shadow: 0 8px 28px rgba(15, 23, 42, 0.75);
    }

    .card h3 {
      font-size: 15px;
      margin-bottom: 6px;
    }

    .card p {
      font-size: 13px;
      color: var(--muted);
    }

    .tag-row {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 10px;
    }

    .tag {
      font-size: 11px;
      padding: 3px 8px;
      border-radius: 999px;
      border: 1px solid rgba(55, 65, 81, 0.9);
      color: var(--muted);
      background: rgba(15, 23, 42, 0.9);
    }

    /* Journey timeline */
    .timeline {
      position: relative;
      padding-left: 18px;
      margin-top: 8px;
    }

    .timeline::before {
      content: "";
      position: absolute;
      left: 6px;
      top: 4px;
      bottom: 4px;
      width: 1px;
      background: linear-gradient(to bottom, rgba(55, 65, 81, 0.5), rgba(55, 65, 81, 0.1));
    }

    .timeline-item {
      position: relative;
      padding-bottom: 16px;
    }

    .timeline-bullet {
      position: absolute;
      left: -1px;
      top: 4px;
      width: 10px;
      height: 10px;
      border-radius: 999px;
      background: radial-gradient(circle at 30% 20%, #38bdf8, #0f172a);
      box-shadow: 0 0 0 2px rgba(15, 23, 42, 1);
    }

    .timeline-title {
      font-size: 14px;
      font-weight: 500;
    }

    .timeline-meta {
      font-size: 11px;
      color: var(--muted);
      margin-bottom: 4px;
    }

    .timeline-body {
      font-size: 13px;
      color: var(--muted);
    }

    /* Skills */
    .skills-grid {
      display: grid;
      gap: 12px;
    }

    @media (min-width: 768px) {
      .skills-grid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
    }

    .skill-heading {
      font-size: 13px;
      font-weight: 600;
      margin-bottom: 4px;
    }

    .skill-list {
      list-style: none;
      font-size: 12px;
      color: var(--muted);
    }

    .skill-list li {
      margin-bottom: 3px;
    }

    /* Projects */
    .project-meta {
      font-size: 11px;
      color: var(--muted);
      margin-bottom: 5px;
    }

    .project-points {
      list-style: disc;
      padding-left: 16px;
      margin-top: 6px;
      font-size: 12px;
      color: var(--muted);
    }

    /* Resume + Contact */
    .resume-block {
      display: grid;
      gap: 14px;
    }

    @media (min-width: 768px) {
      .resume-block {
        grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
      }
    }

    .resume-note {
      font-size: 12px;
      color: var(--muted);
      margin-top: 6px;
    }

    .contact-card {
      font-size: 13px;
      color: var(--muted);
    }

    .contact-row {
      display: flex;
      flex-direction: column;
      gap: 4px;
      margin-top: 6px;
    }

    .contact-row a {
      font-size: 13px;
      color: #7dd3fc;
    }

    footer {
      font-size: 11px;
      color: var(--muted);
      margin-top: 40px;
      padding-top: 14px;
      border-top: 1px solid rgba(31, 41, 55, 0.9);
      text-align: center;
    }

    /* Small devices tweak */
    @media (max-width: 480px) {
      .hero-card {
        padding: 14px 12px 12px;
      }
      .hero-card-top {
        align-items: flex-start;
      }
      .avatar {
        width: 56px;
        height: 56px;
        font-size: 22px;
      }
    }
  </style>
</head>
<body>

<header>
  <div class="nav-inner">
    <div class="logo">
      <div class="logo-mark">A</div>
      <div>
        <div class="logo-text-main">Aayush Acharya</div>
        <div class="logo-text-sub">Journey · Skills · Projects</div>
      </div>
    </div>
    <nav>
      <a href="#journey">Journey</a>
      <a href="#skills">Skills</a>
      <a href="#projects">Projects</a>
      <a href="#resume">Resume</a>
      <a href="#contact" class="nav-cta">Contact</a>
    </nav>
  </div>
</header>

<main class="page">
  <!-- HERO -->
  <section class="hero" id="top">
    <div>
      <div class="pill">
        <div class="pill-dot"></div>
        Open to IT support, service desk & operations roles
      </div>

      <h1>
        Hi, I’m <span>Aayush</span> — I turn messy problems into clean, working systems.
      </h1>

      <p class="hero-subtitle">
        I started in <b>hospitality operations</b>, moved into <b>IT helpdesk & support</b>, and am now building depth in <b>finance and systems</b>.  
        I like fixing things, documenting them properly, and making life easier for the people around me.
      </p>

      <div class="hero-meta">
        <span>Based in Sydney, Australia</span>
        <span>Background: Hospitality · IT Support · Finance</span>
      </div>

      <div class="hero-actions">
        <!-- TODO: replace href with your real resume link when hosted -->
        <a class="btn-primary" href="#resume">
          View my resume
        </a>
        <a class="btn-secondary" href="#journey">
          Read my story
        </a>
      </div>

      <p class="hero-note">
        This page is a deeper look at my journey, what I’ve actually done, and how I work — beyond what fits in a two-page CV.
      </p>
    </div>

    <aside class="hero-card">
      <div class="hero-card-inner">
        <div class="hero-card-top">
          <div class="avatar">AA</div>
          <div>
            <div class="hero-card-name">Aayush Acharya</div>
            <div class="hero-card-role">IT Helpdesk Coordinator & Ops Specialist</div>
            <div class="hero-card-location">Sydney · Australia</div>
          </div>
        </div>

        <div class="hero-chip-row">
          <span class="hero-chip soft">IT support & troubleshooting</span>
          <span class="hero-chip">Process & SOP documentation</span>
          <span class="hero-chip">Hospitality & team operations</span>
        </div>

        <div class="hero-card-links">
          <!-- TODO: update these links with your real details -->
          <a class="hero-link" href="mailto:youremail@example.com">
            <span class="icon">✉️</span>
            youremail@example.com
          </a>
          <a class="hero-link" href="https://www.linkedin.com/in/aayushacharya" target="_blank" rel="noopener">
            <span class="icon">🔗</span>
            LinkedIn profile
          </a>
        </div>
      </div>
    </aside>
  </section>

  <!-- JOURNEY -->
  <section id="journey">
    <div class="section-header">
      <div class="section-kicker">My Story</div>
      <div class="section-title">From hospitality floors to IT tickets</div>
      <div class="section-subtitle">
        I grew up around fast-paced service environments, learned how to manage people and operations,
        and then moved into IT — where I now apply the same mindset to systems, devices, and support.
      </div>
    </div>

    <div class="card">
      <div class="timeline">
        <div class="timeline-item">
          <div class="timeline-bullet"></div>
          <div class="timeline-title">Hospitality & Venue Operations</div>
          <div class="timeline-meta">Restaurant & venue roles · Team leadership · Customer experience</div>
          <div class="timeline-body">
            I spent several years working in hospitality and venue operations, including managing day-to-day
            floor service, coordinating staff, and making sure guests had a consistent experience.
            I wrote policies, created checklists, and tightened processes so that service didn’t depend
            on “who happened to be on shift”.
          </div>
        </div>

        <div class="timeline-item">
          <div class="timeline-bullet"></div>
          <div class="timeline-title">Documenting & Systemising Operations</div>
          <div class="timeline-meta">SOPs · closing procedures · staff guides</div>
          <div class="timeline-body">
            Over time I naturally became the person who would say, “Let’s write this down.”
            I built SOPs for closing, stock handling, staff meals, and service standards.
            That got me interested in how much better things run when we treat work like a system,
            not just individual tasks.
          </div>
        </div>

        <div class="timeline-item">
          <div class="timeline-bullet"></div>
          <div class="timeline-title">Moving into IT Helpdesk & Support</div>
          <div class="timeline-meta">PC builds · troubleshooting · ticketing · end-user support</div>
          <div class="timeline-body">
            I transitioned into IT, focusing on helpdesk and support.
            I learned how to build and rebuild machines, follow deployment processes,
            troubleshoot user issues, and maintain clear documentation so that other technicians
            could repeat the work efficiently.
          </div>
        </div>

        <div class="timeline-item">
          <div class="timeline-bullet"></div>
          <div class="timeline-title">Adding Finance & Mortgage Broking</div>
          <div class="timeline-meta">Cert IV in Finance & Mortgage Broking</div>
          <div class="timeline-body">
            To round out my skills, I started formal study in finance and mortgage broking.
            My goal is to combine <b>operations discipline</b>, <b>IT systems</b> and <b>financial understanding</b>
            to support businesses in a more end-to-end way – whether that’s in IT support,
            service desk, or operational roles inside finance or tech-driven organisations.
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- SKILLS -->
  <section id="skills">
    <div class="section-header">
      <div class="section-kicker">What I Work With</div>
      <div class="section-title">Skills I bring to a team</div>
      <div class="section-subtitle">
        My experience spans front-line support, documentation, and operations.
        I focus on being clear, reliable, and easy to work with.
      </div>
    </div>

    <div class="card skills-grid">
      <div>
        <div class="skill-heading">Technical & IT Support</div>
        <ul class="skill-list">
          <li>End-user support (hardware & software)</li>
          <li>New PC builds & existing PC rebuilds</li>
          <li>Basic networking & troubleshooting</li>
          <li>Working with ticketing & helpdesk tools</li>
          <li>Microsoft 365 / Windows environments</li>
        </ul>
      </div>

      <div>
        <div class="skill-heading">Documentation & Process</div>
        <ul class="skill-list">
          <li>Writing clear SOPs & run sheets</li>
          <li>Standardising build & decommission flows</li>
          <li>Translating real-world work into checklists</li>
          <li>Improving consistency across shifts/teams</li>
          <li>Explaining technical steps in plain language</li>
        </ul>
      </div>

      <div>
        <div class="skill-heading">People & Operations</div>
        <ul class="skill-list">
          <li>Customer service & stakeholder communication</li>
          <li>Coordinating with non-technical staff</li>
          <li>Training & supporting team members</li>
          <li>Calm under pressure & time constraints</li>
          <li>Balancing speed with accuracy and safety</li>
        </ul>
      </div>
    </div>
  </section>

  <!-- PROJECTS / EXAMPLES -->
  <section id="projects">
    <div class="section-header">
      <div class="section-kicker">Examples</div>
      <div class="section-title">A few things I’m proud of</div>
      <div class="section-subtitle">
        These aren’t massive “projects”, but they’re real situations where I took ownership,
        cleaned things up, and left the system better than I found it.
      </div>
    </div>

    <div class="card-grid card-grid-2">
      <article class="card">
        <div class="project-meta">Operations · Documentation · Hospitality</div>
        <h3>Standardising closing procedures for a busy venue</h3>
        <p>
          In a large restaurant/venue, closing shifts varied a lot depending on who was working.
          I helped design a clear closing-time policy and step-by-step checklist for the bar and floor.
        </p>
        <ul class="project-points">
          <li>Defined what “finished” actually means for each area.</li>
          <li>Reduced confusion and disagreements at the end of shifts.</li>
          <li>Made it easier for new staff to ramp up quickly.</li>
        </ul>
      </article>

      <article class="card">
        <div class="project-meta">IT · Devices · Documentation</div>
        <h3>New PC builds, rebuilds & decommission process</h3>
        <p>
          In IT, I worked with processes for preparing new machines, rebuilding existing ones,
          and safely decommissioning hardware at end-of-life.
        </p>
        <ul class="project-points">
          <li>Followed a consistent workflow for builds and rebuilds.</li>
          <li>Documented steps so others could repeat the process.</li>
          <li>Helped reduce avoidable mistakes in deployments.</li>
        </ul>
      </article>

      <article class="card">
        <div class="project-meta">Support · Communication</div>
        <h3>Being a calm point of contact under pressure</h3>
        <p>
          Whether it’s a guest in a restaurant or an end-user with an IT issue,
          I’ve often been the person who listens, explains what’s happening,
          and makes sure they feel looked after while the problem is resolved.
        </p>
        <ul class="project-points">
          <li>Translating between technical and non-technical language.</li>
          <li>Owning the issue instead of bouncing people around.</li>
          <li>Keeping communication clear when stress is high.</li>
        </ul>
      </article>

      <article class="card">
        <div class="project-meta">Learning · Career Direction</div>
        <h3>Combining hospitality, IT & finance into one path</h3>
        <p>
          Rather than treating each career step as separate, I’m intentionally combining them.
          Operations taught me discipline. IT taught me structured troubleshooting.
          Finance is teaching me how decisions flow through numbers.
        </p>
        <ul class="project-points">
          <li>Built a unique mix of people, process & technical skills.</li>
          <li>Positioning myself for roles that value both IT and operations.</li>
          <li>Committed to ongoing learning instead of one-off career jumps.</li>
        </ul>
      </article>
    </div>
  </section>

  <!-- RESUME -->
  <section id="resume">
    <div class="section-header">
      <div class="section-kicker">CV & Details</div>
      <div class="section-title">Resume overview</div>
      <div class="section-subtitle">
        For most applications I still use a standard two-page resume, but this site gives extra context
        on how I think and work. You can download my latest CV below.
      </div>
    </div>

    <div class="card resume-block">
      <div>
        <h3>Highlights</h3>
        <p class="resume-note">
          Below is a summary. For full dates, responsibilities, and certifications,
          please refer to the downloaded resume.
        </p>
        <ul class="project-points">
          <li>Experience across hospitality, venue operations, and IT helpdesk support.</li>
          <li>Hands-on with building/rebuilding PCs and supporting users in Windows environments.</li>
          <li>Comfortable writing SOPs, policies, and documentation for both technical and non-technical teams.</li>
          <li>Ongoing study in finance & mortgage broking to deepen business and financial understanding.</li>
        </ul>
      </div>

      <div>
        <!-- TODO: update resume link when hosted -->
        <a class="btn-primary" href="#" style="width: 100%; justify-content: center; text-align: center;">
          Download my resume (PDF)
        </a>
        <p class="resume-note">
          Once this site is hosted, replace the button link with a direct URL to your resume file
          (for example, from the same hosting, Google Drive, or Dropbox).
        </p>
      </div>
    </div>
  </section>

  <!-- CONTACT -->
  <section id="contact">
    <div class="section-header">
      <div class="section-kicker">Connect</div>
      <div class="section-title">Let’s talk</div>
      <div class="section-subtitle">
        If you’d like to discuss a role, a project, or just how I think about support and operations,
        the easiest way to reach me is by email or LinkedIn.
      </div>
    </div>

    <div class="card contact-card">
      <p>
        I’m currently open to:
      </p>
      <ul class="project-points">
        <li>IT support / helpdesk / service desk roles</li>
        <li>Hybrid roles that mix IT support with operations or documentation</li>
        <li>Opportunities in finance or tech-driven organisations where my background fits</li>
      </ul>

      <div class="contact-row">
        <!-- TODO: update with your real details -->
        <span>Email: <a href="mailto:youremail@example.com">youremail@example.com</a></span>
        <span>LinkedIn: <a href="https://www.linkedin.com/in/aayushacharya" target="_blank" rel="noopener">linkedin.com/in/aayushacharya</a></span>
      </div>
    </div>
  </section>

  <footer>
    Built as a simple, fast portfolio site to give employers a clearer picture than a PDF alone.
  </footer>
</main>

</body>
</html># aayush