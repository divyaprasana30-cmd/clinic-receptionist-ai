'use client'

import { motion } from 'framer-motion'
import { Stethoscope, CheckCircle2, ArrowRight, Zap, MessageSquare, Calendar, Users, Bell, Smartphone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

const fadeInDown = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

const fadeInScale = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } }
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg">ClinicAI</span>
          </motion.div>

          <div className="hidden md:flex items-center gap-8">
            {['Features', 'How it Works', 'Pricing', 'Demo'].map((item, i) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase().replace(' ', '-')}`}
                className="text-slate-300 hover:text-white transition-colors text-sm"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * (i + 1) }}
              >
                {item}
              </motion.a>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => window.location.href = '/login'}>Get Started</Button>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-6"
            >
              <motion.div variants={fadeInUp}>
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                  AI-Powered WhatsApp Receptionist
                </Badge>
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="text-5xl md:text-6xl font-bold text-white leading-tight"
              >
                Your Clinic&apos;s AI Receptionist on WhatsApp
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-xl text-slate-300 leading-relaxed"
              >
                Automate appointment booking, reminders, and patient conversations 24/7. No app downloads. No staff overhead.
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-4 pt-4"
              >
                <Button className="bg-blue-600 hover:bg-blue-700 text-white text-lg h-12 px-8 group" onClick={() => window.location.href = '/login'}>
                  Start Free Trial
                 <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-800 text-lg h-12 px-8" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
                  Watch Demo
                </Button>
              </motion.div>
            </motion.div>

            {/* Phone Mockup */}
            <motion.div
              variants={fadeInScale}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl blur-2xl opacity-20"></div>
              <div className="relative bg-gradient-to-b from-slate-900 to-slate-950 rounded-3xl border border-slate-700 p-2 shadow-2xl">
                <div className="bg-black rounded-2xl overflow-hidden">
                  <div className="bg-gradient-to-b from-slate-800 to-slate-900 p-4 h-12 flex items-center justify-between text-xs text-white">
                    <span>9:41</span>
                    <span>📶 📡 🔋</span>
                  </div>

                  <div className="p-4 space-y-4 h-96 overflow-y-auto bg-slate-950">
                    {/* Chat messages */}
                    <div className="flex justify-end">
                      <div className="bg-blue-600 rounded-2xl rounded-tr-none px-4 py-2 max-w-xs">
                        <p className="text-sm">I want to book an appointment tomorrow</p>
                      </div>
                    </div>

                    <div className="flex justify-start">
                      <div className="bg-slate-800 rounded-2xl rounded-tl-none px-4 py-2 max-w-xs">
                        <p className="text-sm">Sure! Available slots for tomorrow:</p>
                        <p className="text-sm mt-1">1️⃣ 9:00 AM</p>
                        <p className="text-sm">2️⃣ 10:30 AM</p>
                        <p className="text-sm">3️⃣ 2:00 PM</p>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <div className="bg-blue-600 rounded-2xl rounded-tr-none px-4 py-2 max-w-xs">
                        <p className="text-sm">10:30 AM please</p>
                      </div>
                    </div>

                    <div className="flex justify-start">
                      <div className="bg-slate-800 rounded-2xl rounded-tl-none px-4 py-2 max-w-xs">
                        <p className="text-sm">✅ Appointment confirmed with Dr. Priya at 10:30 AM!</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900 p-4 border-t border-slate-800">
                    <input
                      type="text"
                      placeholder="Type message..."
                      className="w-full bg-slate-800 rounded-full px-4 py-2 text-xs text-white placeholder-slate-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-slate-800 bg-slate-900/50 backdrop-blur py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { number: '500+', label: 'Clinics Using ClinicAI' },
              { number: '50,000+', label: 'Appointments Booked' },
              { number: '98%', label: 'Patient Satisfaction' }
            ].map((stat, i) => (
              <motion.div key={i} variants={fadeInUp} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-blue-400 mb-2">{stat.number}</div>
                <div className="text-slate-300 text-sm md:text-base">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              Everything Your Clinic Needs
            </motion.h2>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { icon: Zap, title: 'AI Intent Detection', desc: 'Understands natural language booking requests' },
              { icon: Calendar, title: 'Smart Scheduling', desc: 'Real-time slot management and conflict prevention' },
              { icon: MessageSquare, title: 'WhatsApp Native', desc: 'Patients book on the app they already use' },
              { icon: Users, title: 'Multi-Doctor Support', desc: 'Manage all doctors from one dashboard' },
              { icon: Bell, title: 'Auto Reminders', desc: '24h and 1h appointment reminders automatically' },
              { icon: Smartphone, title: 'Human Takeover', desc: 'Receptionist can take over any conversation instantly' }
            ].map((feature, i) => (
              <motion.div
                key={i}
                variants={fadeInScale}
                className="group relative p-6 rounded-2xl border border-slate-700 bg-slate-900/50 hover:bg-slate-900/80 backdrop-blur transition-all hover:border-blue-500/50"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity"></div>
                <div className="relative space-y-3">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                    <feature.icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="text-slate-300 text-sm">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-4xl md:text-5xl font-bold text-center mb-16"
          >
            How It Works
          </motion.h2>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { num: '1', title: 'Patient Messages', desc: 'Patient messages your WhatsApp number' },
              { num: '2', title: 'AI Detects Intent', desc: 'AI detects intent and shows available slots' },
              { num: '3', title: 'Instant Confirmation', desc: 'Appointment confirmed and saved automatically' }
            ].map((step, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="relative"
              >
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-xl font-bold">
                    {step.num}
                  </div>
                  <h3 className="text-xl font-semibold text-center">{step.title}</h3>
                  <p className="text-slate-300 text-center text-sm">{step.desc}</p>
                </div>

                {i < 2 && (
                  <div className="hidden md:block absolute top-7 -right-4 w-8 h-1 bg-gradient-to-r from-blue-500 to-transparent"></div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 -right-96 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-4xl md:text-5xl font-bold text-center mb-16"
          >
            Simple, Transparent Pricing
          </motion.h2>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                name: 'Starter',
                price: '₹999',
                features: ['Up to 100 appointments/month', 'Basic AI responses', 'Single doctor', 'Chat support']
              },
              {
                name: 'Growth',
                price: '₹2,499',
                features: ['Unlimited appointments', 'Advanced AI with custom training', 'Multi-doctor support', '24/7 priority support'],
                popular: true
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                features: ['Custom integration', 'Dedicated account manager', 'Custom features', 'SLA guarantee'],
              }
            ].map((plan, i) => (
              <motion.div
                key={i}
                variants={fadeInScale}
                className={`relative rounded-2xl border p-8 transition-all ${
                  plan.popular
                    ? 'border-blue-500/50 bg-slate-900 ring-2 ring-blue-500/20 scale-105'
                    : 'border-slate-700 bg-slate-900/50'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white">Most Popular</Badge>
                  </div>
                )}

                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold text-blue-400 mb-2">
                  {plan.price}
                  {plan.name !== 'Enterprise' && <span className="text-lg text-slate-400">/mo</span>}
                </div>

                <ul className="space-y-3 mb-8 mt-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full h-11 text-base ${
                    plan.popular
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-slate-800 hover:bg-slate-700 text-white'
                  }`}
                >
                  Get Started
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-blue-500/10 -z-10"></div>

        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Ready to Automate Your Clinic?
          </motion.h2>

          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-xl text-slate-300 mb-8"
          >
            Join 500+ clinics already using ClinicAI
          </motion.p>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Button className="bg-blue-600 hover:bg-blue-700 text-white text-lg h-12 px-8">
              Start Free Trial
              <ArrowRight className="ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950/50 backdrop-blur py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Stethoscope className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold">ClinicAI</span>
              </div>
              <p className="text-slate-400 text-sm">Your clinic&apos;s AI-powered receptionist</p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between text-slate-400 text-sm">
            <p>&copy; 2024 ClinicAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

