"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, Brain, Stethoscope, MessageCircle, Shield, Clock, CheckCircle, ArrowRight, User } from 'lucide-react';
import { motion } from "framer-motion";
import { TypingAnimation } from "@/components/magicui/typing-animation";
import { cn } from "@/lib/utils";

const ChatMessage = ({ message, type }: { message: string; type: "user" | "assistant" }) => {
  return (
    <div className={cn(
      "px-4 py-6 border-b border-gray-100",
      type === "assistant" ? "bg-white" : "bg-gray-50"
    )}>
      <div className="max-w-2xl mx-auto flex gap-4">
        <div className={cn(
          "w-8 h-8 rounded-sm flex items-center justify-center shrink-0",
          type === "assistant" ? "bg-blue-600" : "bg-gray-700"
        )}>
          {type === "assistant" ? (
            <Heart className="h-4 w-4 text-white" />
          ) : (
            <User className="h-4 w-4 text-white" />
          )}
        </div>
        <div className="flex-1">
          <div className="font-medium text-sm mb-1">
            {type === "assistant" ? "PerplexaCare AI" : "You"}
          </div>
          <div className="text-gray-700">
            {message}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white overflow-hidden scroll-smooth">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Heart className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-semibold text-gray-900">PerplexaCare</span>
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-gray-600 hover:text-blue-600 transition-colors" scroll={false}>Features</Link>
            <Link href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors" scroll={false}>How It Works</Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/sign-in">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button className="bg-blue-600 hover:bg-blue-700">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white -z-10"></div>
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-100 rounded-full opacity-30 blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-blue-200 rounded-full opacity-20 blur-3xl -z-10"></div>

        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="md:w-1/2 md:pr-8 space-y-6 mb-10 md:mb-0"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-2"
              >
                Powered by Perplexity Sonar
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 tracking-tight leading-tight"
              >
                <style jsx global>{`
                  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap');
                `}</style>
                Healthcare guidance, <span className="text-blue-600" style={{ fontFamily: 'Playfair Display, serif' }}>powered by AI</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-xl text-gray-600 max-w-lg"
              >
                Experience trusted medical insights from verified sources, personalized to your health profile.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="flex flex-wrap gap-4 pt-2"
              >
                <Link href="/sign-up">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 transition-all">
                    <span>Start Free Trial</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#how-it-works">
                  <Button size="lg" variant="outline" className="border-gray-300">
                    Learn How It Works
                  </Button>
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="flex items-center gap-2 text-gray-600 pt-4"
              >
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm">No credit card required</span>
              </motion.div>
            </motion.div>

            {/* Chat Interface */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="md:w-1/2 relative"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full aspect-[4/3] bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200 relative"
              >
                {/* Chat Header */}
                <div className="absolute top-0 inset-x-0 h-10 bg-white border-b border-gray-100 flex items-center px-4">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                  </div>
                  <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
                    <Heart className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-sm text-gray-700">PerplexaCare Chat</span>
                  </div>
                </div>

                <div className="mt-10 overflow-y-auto h-[calc(100%-2.5rem)]">
                  {/* User Message */}
                  <ChatMessage
                    type="user"
                    message="I've been experiencing frequent headaches and fatigue lately. What could be the possible causes?"
                  />

                  {/* AI Response */}
                  <div className="px-4 py-6 bg-white">
                    <div className="max-w-2xl mx-auto flex gap-4">
                      <div className="w-8 h-8 rounded-sm flex items-center justify-center shrink-0 bg-blue-600">
                        <Heart className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm mb-3">PerplexaCare AI</div>
                        <div className="text-gray-700 prose prose-sm max-w-none">
                          <TypingAnimation
                            className="text-base font-normal leading-relaxed tracking-normal"
                            duration={40}
                          >
                            It sounds like you might be dealing with tension headaches, dehydration, eye strain, or sleep issues. These are common and often linked to stress, not drinking enough water, too much screen time, or poor sleep quality. To help alleviate these symptoms, try taking regular breaks from screens, staying hydrated, and maintaining good posture while working.
                          </TypingAnimation>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-50 rounded-full blur-2xl -z-10"></div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mt-20 border-t border-gray-100 pt-10"
          >
            <p className="text-center text-gray-500 text-md mb-6">Trusted medical data from</p>
            <div className="flex flex-wrap justify-center gap-x-10 gap-y-4 items-center opacity-70">
              <div className="text-gray-500 font-serif font-medium text-xl">Mayo Clinic</div>
              <div className="text-gray-500 font-medium text-xl">WebMD</div>
              <div className="text-gray-500 font-medium text-xl font-serif">NIH</div>
              <div className="text-gray-500 font-medium text-xl">CDC</div>
              <div className="text-gray-500 font-medium text-xl font-serif">Cleveland Clinic</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Comprehensive Healthcare Support
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our AI-powered platform delivers accurate medical information and personalized insights.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-100 transition-all group"
              >
                <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center mb-6 group-hover:bg-blue-100 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              How PerplexaCare Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Leveraging Perplexity Sonar technology to deliver trusted medical insights.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((step, i) => (
              <div key={i} className="relative">
                {i < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-[calc(100%-16px)] w-[calc(100%-64px)] h-[2px] bg-blue-200 z-0"></div>
                )}
                <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm relative z-10">
                  <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg mb-6">
                    {i + 1}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-600 to-blue-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Healthcare Experience?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of users who trust PerplexaCare for their health-related questions and guidance.
            </p>
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20 mb-8">
              <form className="flex flex-col md:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 rounded-lg px-4 py-3 bg-white border border-transparent focus:border-blue-300 focus:ring-2 focus:ring-blue-300 outline-none"
                />
                <Button size="lg" className="bg-blue-800 hover:bg-blue-900 text-white">
                  Join Waitlist
                </Button>
              </form>
            </div>
            <p className="text-sm text-blue-200">
              By signing up, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white py-12 relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-400 rounded-full opacity-10 blur-3xl -z-10"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-400 rounded-full opacity-10 blur-3xl -z-10"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Main Footer Content */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {/* Brand Section */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center shadow-lg">
                      <Heart className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold">PerplexaCare</span>
                  </div>
                  <p className="text-blue-100 leading-relaxed mb-4 text-base">
                    AI-powered healthcare guidance that provides trusted medical insights from verified sources, helping you make informed decisions about your health.
                  </p>
                  <div className="flex items-center gap-2 text-blue-200 bg-blue-800/30 backdrop-blur-sm rounded-lg p-2">
                    <Stethoscope className="w-4 h-4" />
                    <span className="text-xs font-medium">Powered by Perplexity Sonar</span>
                  </div>
                </motion.div>
              </div>

              {/* Contact Information */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-xl font-bold mb-6">Get in Touch</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 group">
                      <div className="w-10 h-10 rounded-lg bg-blue-700/50 backdrop-blur-sm flex items-center justify-center group-hover:bg-blue-500 transition-all duration-300 border border-blue-600/30">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                        </svg>
                      </div>
                      <div>
                        <p className="text-blue-200 text-xs font-medium">Email</p>
                        <a
                          href="mailto:riteshhiremath6@gmail.com"
                          className="text-white hover:text-blue-300 transition-colors font-semibold text-sm"
                        >
                          riteshhiremath6@gmail.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 group">
                      <div className="w-10 h-10 rounded-lg bg-blue-700/50 backdrop-blur-sm flex items-center justify-center group-hover:bg-blue-500 transition-all duration-300 border border-blue-600/30">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.559-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.559.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd"></path>
                        </svg>
                      </div>
                      <div>
                        <p className="text-blue-200 text-xs font-medium">Website</p>
                        <a
                          href="https://riteshhiremath.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white hover:text-blue-300 transition-colors font-semibold text-sm"
                        >
                          riteshhiremath.com
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Creator Info */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-xl font-bold mb-6">About the Creator</h3>
                  <p className="text-blue-100 leading-relaxed mb-4 text-base">
                    Built with passion for healthcare innovation. PerplexaCare combines cutting-edge AI technology with trusted medical sources to democratize access to healthcare information.
                  </p>
                </motion.div>
              </div>
            </div>

            {/* Bottom Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              className="border-t border-blue-700/50 pt-8"
            >
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-blue-300" />
                  <span className="text-blue-100 text-sm">
                    © {new Date().getFullYear()} PerplexaCare. Built with ❤️ for better healthcare.
                  </span>
                </div>
                <div className="flex items-center gap-6 text-blue-200">
                  <span className="text-sm font-medium">Made by Ritesh Hiremath</span>
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Powered by AI</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    title: "24/7 AI Health Assistant",
    description: "Get instant answers to your health questions anytime, anywhere with our AI-powered assistant.",
    icon: <Clock className="w-6 h-6 text-blue-600" />,
  },
  {
    title: "Smart Symptom Analysis",
    description: "Advanced AI-powered analysis of your symptoms using data from trusted medical sources.",
    icon: <Brain className="w-6 h-6 text-blue-600" />,
  },
  {
    title: "Personalized Care",
    description: "Tailored health recommendations based on your unique profile and medical history.",
    icon: <Heart className="w-6 h-6 text-blue-600" />,
  },
  {
    title: "Verified Medical Knowledge",
    description: "Access to comprehensive information sourced from Mayo Clinic, WebMD, NIH, and more.",
    icon: <Stethoscope className="w-6 h-6 text-blue-600" />,
  },
  {
    title: "Privacy-Focused",
    description: "Your health data is protected with enterprise-grade security and strict privacy policies.",
    icon: <Shield className="w-6 h-6 text-blue-600" />,
  },
  {
    title: "Natural Conversation",
    description: "Interact naturally with our AI through simple conversation - just like talking to a doctor.",
    icon: <MessageCircle className="w-6 h-6 text-blue-600" />,
  },
];

const howItWorks = [
  {
    title: "Ask Your Health Question",
    description: "Simply type your health-related question in natural language, just as you would ask a healthcare professional."
  },
  {
    title: "AI Searches Trusted Sources",
    description: "Our Perplexity Sonar technology searches and analyzes information from verified medical websites and journals."
  },
  {
    title: "Get Personalized Insights",
    description: "Receive clear, accurate answers tailored to your specific query, with sources cited for your reference."
  }
];
