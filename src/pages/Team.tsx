import { Card, CardContent } from "../components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { useState } from "react";

const Team = () => {
  const [selectedMember, setSelectedMember] = useState(null);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const teamMembers = [
    {
      name: "Keraliya Kaushal",
      role: "Full Stack Developer",
      expertise: "Server-side Development & API Integration",
      image: "/TeamImage/kaushal.jpg",
      bio: "Full Stack Developer with expertise in Next.js, React, and backend technologies",
      email: "kaushal151131@gmail.com",
      education: "Bachelor of Engineering (B.E) in Computer Engineering (2022 - 2026) | LDRP-ITR",
      experience: [
        {
          company: "The Special Character - Ahmedabad",
          position: "Full Stack Developer",
          duration: "01 July, 2025 - 30 July, 2025",
          description: "Completed 1-month internship on live client projects using Next.js, Tailwind CSS, Payload CMS, and PostgreSQL. Built responsive and SEO-friendly web pages with backend CMS integration."
        }
      ],
      projects: [
        {
          name: "E-commerce Website (RINO & PELLE)",
          description: "Developed using Next.js and Medusa.js with product management, cart, and secure checkout features.",
          tech: "Next.js, Medusa.js, PostgreSQL"
        },
        {
          name: "Yoga Guru",
          description: "Real-time yoga pose classifier using webcam with ML model for pose identification and visual feedback.",
          tech: "Python, OpenCV, MediaPipe, scikit-learn, Node.js, React"
        }
      ],
      skills: {
        languages: "C, C++, Java, Python, MySQL",
        web: "HTML, CSS, JavaScript, ReactJS, NextJS, NodeJS, MongoDB, PostgreSQL, ExpressJS, Tailwind CSS",
        tools: "Git, GitHub, VSCode, Medusa, Payload, Vercel"
      }
    },
    {
      name: "Mankad Drashti",
      role: "AI-ML Engineer",
      expertise: "Machine Learning & Artificial Intelligence",
      image: "/TeamImage/drashti.jpg",
      bio: "Specializes in developing and optimizing machine learning algorithms for energy consumption prediction",
      email: "drashtimankad1@gmail.com",
      education: "Bachelor of Engineering (B.E) in Computer Engineering (2022 - 2026) | LDRP-ITR",
      projects: [
        {
          name: "Yoga Guru",
          description: "Real-time yoga pose classifier using webcam with ML model for pose identification and visual feedback.",
          tech: "Python, OpenCV, MediaPipe, scikit-learn, Node.js, React"
        }
      ],
      skills: {
        languages: "C, C++, Java, Python, MySQL",
        web: "HTML, CSS, JavaScript, ReactJS, NextJS, NodeJS, MongoDB, PostgreSQL, ExpressJS, Tailwind CSS",
        tools: "Git, GitHub, VSCode, Medusa, Payload, Vercel"
      }
    },
    {
      name: "Kaneriya Hasti", 
      role: "Frontend Developer",
      expertise: "UI/UX Development & User Interface Design",
      image: "/TeamImage/hasti.jpg",
      bio: "Creates intuitive and responsive user interfaces for seamless energy monitoring experience",
      email: "hastijk83@gmail.com",
      education: "Bachelor of Engineering (B.E) in Computer Engineering (2022 - 2026) | LDRP-ITR",
      projects: [
        {
          name: "Yoga Guru",
          description: "Real-time yoga pose classifier using webcam with ML model for pose identification and visual feedback.",
          tech: "Python, OpenCV, MediaPipe, scikit-learn, Node.js, React"
        }
      ],
      skills: {
        languages: "C, C++, Java, Python, MySQL",
        web: "HTML, CSS, JavaScript, ReactJS, NextJS, NodeJS, MongoDB, PostgreSQL, ExpressJS, Tailwind CSS",
        tools: "Git, GitHub, VSCode, Medusa, Payload, Vercel"
      }
    },
    {
      name: "Kodiya Bansi",
      role: "Data Analyst",
      expertise: "Data Analysis & Business Intelligence",
      image: "/TeamImage/bansi.jpg",
      bio: "Analyzes energy consumption patterns and provides actionable insights for optimization",
      email: "bansi.kodiya@gmail.com",
      education: "Bachelor of Engineering (B.E) in Computer Engineering (2022 - 2026) | LDRP-ITR",
      projects: [
        {
          name: "Yoga Guru",
          description: "Real-time yoga pose classifier using webcam with ML model for pose identification and visual feedback.",
          tech: "Python, OpenCV, MediaPipe, scikit-learn, Node.js, React"
        }
      ],
      skills: {
        languages: "C, C++, Java, Python, MySQL",
        web: "HTML, CSS, JavaScript, ReactJS, NextJS, NodeJS, MongoDB, PostgreSQL, ExpressJS, Tailwind CSS",
        tools: "Git, GitHub, VSCode, Medusa, Payload, Vercel"
      }
    }
  ];

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16" data-aos="fade-up">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-6">
              Our Team
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Meet the passionate individuals behind Energy AI - dedicated to revolutionizing 
              energy consumption prediction through cutting-edge machine learning
            </p>
          </div>

          {/* Team Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {teamMembers.map((member, index) => (
              <Card 
                key={index} 
                className="group glass-morphism border-white/10 hover:border-green-400/50 transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 hover:shadow-2xl hover:shadow-green-400/20 cursor-pointer animate-in fade-in-0 slide-in-from-bottom-4 hover:rotate-1" 
                style={{
                  animationDelay: `${index * 150}ms`,
                  animationDuration: '800ms'
                }}
                onClick={() => setSelectedMember(member)}
              >
                <CardContent className="p-8 text-center h-80 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 via-transparent to-blue-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="flex flex-col items-center justify-center h-full relative z-10">
                    <div className="mb-6 relative">
                      <div className="absolute inset-0 bg-green-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 scale-150"></div>
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-28 h-28 rounded-full object-cover border-4 border-green-400/30 group-hover:border-green-400 group-hover:scale-110 transition-all duration-500 energy-glow mx-auto relative z-10 group-hover:shadow-lg group-hover:shadow-green-400/30"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg";
                        }}
                      />
                    </div>
                    <div className="space-y-3 transform group-hover:translate-y-1 transition-transform duration-300">
                      <h3 className="text-xl font-bold text-white group-hover:text-green-300 transition-colors duration-300">
                        {member.name}
                      </h3>
                      <p className="text-green-400 font-semibold text-lg group-hover:text-green-300 transition-colors duration-300">
                        {member.role}
                      </p>
                      <p className="text-blue-300 text-sm leading-relaxed group-hover:text-blue-200 transition-colors duration-300">
                        {member.expertise}
                      </p>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Team Stats */}
          <div className="glass-morphism border-white/10 rounded-2xl p-8" data-aos="fade-up">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <h3 className="text-3xl font-bold text-green-400 mb-2">4</h3>
                <p className="text-gray-300">Team Members</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-blue-400 mb-2">5+</h3>
                <p className="text-gray-300">ML Models</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-purple-400 mb-2">88%</h3>
                <p className="text-gray-300">Accuracy</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-cyan-400 mb-2">24/7</h3>
                <p className="text-gray-300">Support</p>
              </div>
            </div>
          </div>
      </div>
      
      {/* Team Member Modal */}
      <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
        <DialogContent className="max-w-4xl glass-morphism border-white/20 h-[90vh] overflow-hidden flex flex-col mt-8 animate-in fade-in-0 zoom-in-95 duration-1000">
          <div className="flex-1 overflow-y-auto scrollbar-hide">
          {selectedMember && (
            <>
              <div className="flex flex-col md:flex-row gap-6 mb-6 mt-4 animate-in fade-in-0 slide-in-from-top-4 duration-1500">
                <div className="flex-shrink-0 flex items-center">
                  <img
                    src={selectedMember.image}
                    alt={selectedMember.name}
                    className="w-40 h-40 rounded-full object-cover border-4 border-green-400 energy-glow cursor-pointer hover:scale-110 transition-all duration-700 animate-in zoom-in-0 duration-1800"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFullscreenImage(selectedMember.image);
                    }}
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                  />
                </div>
                <div className="flex-1 text-left pl-4">
                  <DialogTitle className="text-3xl font-bold text-white mb-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-1600">
                    {selectedMember.name}
                  </DialogTitle>
                  <h3 className="text-xl font-bold text-green-400 mb-3 animate-in fade-in-0 slide-in-from-left-2 duration-1700">
                    {selectedMember.role}
                  </h3>
                  <p className="text-blue-300 font-medium mb-4 animate-in fade-in-0 slide-in-from-right-2 duration-1800">
                    {selectedMember.expertise}
                  </p>
                  <p className="text-gray-300 leading-relaxed mb-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-1900">
                    {selectedMember.bio}
                  </p>
                  {selectedMember.email && (
                    <p className="text-sm text-gray-400 mb-2 animate-in fade-in-0 slide-in-from-top-2 duration-2000">
                      <span className="text-green-400 font-medium">Email:</span> {selectedMember.email}
                    </p>
                  )}
                  {selectedMember.education && (
                    <p className="text-sm text-gray-400 mb-4 animate-in fade-in-0 slide-in-from-top-2 duration-2100">
                      <span className="text-green-400 font-medium">Education:</span> {selectedMember.education}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-2100">
                
                {selectedMember.experience && (
                  <div className="animate-in fade-in-0 slide-in-from-left-4 duration-1200 delay-800">
                    <h4 className="text-lg font-bold text-green-400 mb-3">Work Experience</h4>
                    {selectedMember.experience.map((exp, index) => (
                      <div key={index} className="bg-white/5 rounded-lg p-4 mb-3 hover:bg-white/10 transition-colors duration-300">
                        <h5 className="text-white font-semibold">{exp.company}</h5>
                        <p className="text-blue-300 text-sm">{exp.position} | {exp.duration}</p>
                        <p className="text-gray-300 text-sm mt-2">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                )}
                
                {selectedMember.projects && (
                  <div className="animate-in fade-in-0 slide-in-from-right-4 duration-1200 delay-1000">
                    <h4 className="text-lg font-bold text-green-400 mb-3">Projects</h4>
                    {selectedMember.projects.map((project, index) => (
                      <div key={index} className="bg-white/5 rounded-lg p-4 mb-3 hover:bg-white/10 transition-colors duration-300">
                        <h5 className="text-white font-semibold">{project.name}</h5>
                        <p className="text-gray-300 text-sm mt-1">{project.description}</p>
                        <p className="text-blue-300 text-xs mt-2">
                          <span className="text-green-400 font-medium">Tech:</span> {project.tech}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
                
                {selectedMember.skills && (
                  <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-1200 delay-1200">
                    <h4 className="text-lg font-bold text-green-400 mb-3">Technical Skills</h4>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-400 hover:text-gray-200 transition-colors duration-700">
                        <span className="text-green-400 font-medium">Languages:</span> {selectedMember.skills.languages}
                      </p>
                      <p className="text-sm text-gray-400 hover:text-gray-200 transition-colors duration-700">
                        <span className="text-green-400 font-medium">Web Development:</span> {selectedMember.skills.web}
                      </p>
                      <p className="text-sm text-gray-400 hover:text-gray-200 transition-colors duration-700">
                        <span className="text-green-400 font-medium">Tools:</span> {selectedMember.skills.tools}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Fullscreen Image Modal */}
      <Dialog open={!!fullscreenImage} onOpenChange={() => setFullscreenImage(null)}>
        <DialogContent 
          className="max-w-none w-screen h-screen p-0 bg-black/90 flex items-center justify-center animate-in fade-in-0 zoom-in-50 duration-900"
          onClick={() => setFullscreenImage(null)}
        >
          <img
            src={fullscreenImage}
            alt="Fullscreen view"
            className="max-w-full max-h-full object-contain cursor-pointer animate-in zoom-in-0 duration-1200 hover:scale-105 transition-transform duration-700"
            onClick={() => setFullscreenImage(null)}
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg";
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Team;