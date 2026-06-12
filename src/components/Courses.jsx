import React, { useMemo, useState } from "react";

const COMPANY_WHATSAPP_NUMBER = "2349162249670"; // Replace with your company WhatsApp number

const COURSES = [
  {
    id: "html",
    title: "HTML Essentials",
    description: "Build modern web pages with clean markup, responsive layout, and semantic structure.",
    price: "Free",
    duration: "2 weeks",
    level: "Beginner",
    mode: "Online",
    topics: ["HTML5", "Semantic tags", "Forms", "Responsive layout"],
  },
  {
    id: "javascript",
    title: "JavaScript Mastery",
    description: "Master modern JavaScript, DOM interaction, and real-world web app behavior.",
    price: "$49",
    duration: "4 weeks",
    level: "Intermediate",
    mode: "Online",
    topics: ["ES6+", "Functions", "Events", "APIs"],
  },
  {
    id: "ai",
    title: "AI Foundations",
    description: "Understand AI concepts, practical tools, and intelligent automation workflows.",
    price: "$79",
    duration: "5 weeks",
    level: "Beginner to Intermediate",
    mode: "Online",
    topics: ["AI basics", "Chatbots", "Prompt design", "Real use cases"],
  },
  {
    id: "web-design",
    title: "Web Design Crash Course",
    description: "Create beautiful, mobile-friendly websites with strong visual design and UX.",
    price: "$29",
    duration: "3 weeks",
    level: "Beginner",
    mode: "Online",
    topics: ["Design systems", "Color theory", "Layouts", "UX basics"],
  },
  {
    id: "python",
    title: "Python for Beginners",
    description: "Start programming with Python and build scripts, automation, and small apps.",
    price: "$59",
    duration: "4 weeks",
    level: "Beginner",
    mode: "Online",
    topics: ["Syntax", "Data types", "Control flow", "Project work"],
  },
];

function formatWhatsAppUrl(courseTitle, profileData) {
  const name = profileData?.name || "Student";
  const email = profileData?.email ? ` Email: ${profileData.email}` : "";
  const message = `Hello ITech, I want to enroll in the ${courseTitle} course. My name is ${name}.${email} Please contact me.`;
  return `https://wa.me/${COMPANY_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export default function Courses({ onNavigate, profileData }) {
  const [selectedCourseId, setSelectedCourseId] = useState(COURSES[0]?.id || "");
  const selectedCourse = useMemo(
    () => COURSES.find((course) => course.id === selectedCourseId) || COURSES[0],
    [selectedCourseId]
  );

  return (
    <div className="app-shell">
      <div className="content-wrapper">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 18 }}>
          <button
            type="button"
            onClick={() => onNavigate('profile')}
            style={{ background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer', fontSize: 18 }}
          >
            ← Back
          </button>
          <div>
            <div style={{ color: '#94A3B8', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.16em' }}>Learning Hub</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)' }}>Courses</div>
          </div>
          <button
            type="button"
            className="btn-secondary"
            style={{ minWidth: 140 }}
            onClick={() => window.open(`https://wa.me/${COMPANY_WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello iTech, I want to learn more about your courses and enroll.')}`, '_blank')}
          >
            Contact Us
          </button>
        </div>

        <div style={{ display: 'grid', gap: 16, marginBottom: 24 }}>
          <div style={{ padding: 24, borderRadius: 20, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>Start learning with iTech</div>
            <div style={{ color: '#94A3B8', lineHeight: 1.7 }}>
              Choose a course below and enroll instantly using WhatsApp. Our team will contact you to confirm your schedule and payment.
            </div>
          </div>

          <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr 1fr', alignItems: 'start' }}>
            <div style={{ display: 'grid', gap: 16 }}>
              <div style={{ padding: 20, borderRadius: 20, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>Course list</div>
                <div style={{ display: 'grid', gap: 12 }}>
                  {COURSES.map((course) => (
                    <button
                      key={course.id}
                      type="button"
                      onClick={() => setSelectedCourseId(course.id)}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                        padding: '16px 18px',
                        borderRadius: 16,
                        border: selectedCourseId === course.id ? '1px solid #60A5FA' : '1px solid rgba(255,255,255,0.08)',
                        background: selectedCourseId === course.id ? 'rgba(59,130,246,0.12)' : 'transparent',
                        color: 'var(--text)',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 700 }}>{course.title}</div>
                        <div style={{ fontSize: 12, color: '#94A3B8' }}>{course.level} • {course.duration}</div>
                      </div>
                      <div style={{ fontWeight: 700, color: '#10B981' }}>{course.price}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ padding: 20, borderRadius: 20, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>How it works</div>
                <ol style={{ color: '#94A3B8', lineHeight: 1.8, paddingLeft: 18 }}>
                  <li>Pick the course you want to learn.</li>
                  <li>Tap enroll and send the message on WhatsApp.</li>
                  <li>We contact you to confirm your schedule and payment.</li>
                </ol>
              </div>
            </div>

            <div style={{ padding: 24, borderRadius: 20, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
                <div>
                  <div style={{ fontSize: 14, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: 6 }}>Selected course</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)' }}>{selectedCourse.title}</div>
                </div>
                <div style={{ color: '#10B981', fontWeight: 700, fontSize: 18 }}>{selectedCourse.price}</div>
              </div>

              <div style={{ display: 'grid', gap: 14, marginBottom: 18 }}>
                <div style={{ display: 'grid', gap: 4 }}>
                  <span style={{ color: '#94A3B8', fontSize: 12 }}>Duration</span>
                  <span style={{ color: 'var(--text)' }}>{selectedCourse.duration}</span>
                </div>
                <div style={{ display: 'grid', gap: 4 }}>
                  <span style={{ color: '#94A3B8', fontSize: 12 }}>Level</span>
                  <span style={{ color: 'var(--text)' }}>{selectedCourse.level}</span>
                </div>
                <div style={{ display: 'grid', gap: 4 }}>
                  <span style={{ color: '#94A3B8', fontSize: 12 }}>Mode</span>
                  <span style={{ color: 'var(--text)' }}>{selectedCourse.mode}</span>
                </div>
              </div>

              <div style={{ color: '#CBD5E1', marginBottom: 16, lineHeight: 1.7 }}>{selectedCourse.description}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 20 }}>
                {selectedCourse.topics.map((topic) => (
                  <span key={topic} style={{ padding: '8px 12px', borderRadius: 999, background: 'rgba(16,185,129,0.12)', color: '#A7F3D0', fontSize: 12 }}>{topic}</span>
                ))}
              </div>

              <button
                type="button"
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => window.open(formatWhatsAppUrl(selectedCourse.title, profileData), '_blank')}
              >
                Enroll in {selectedCourse.title}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
