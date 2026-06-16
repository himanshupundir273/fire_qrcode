import Link from 'next/link'
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Phone,
  Shield,
  Wrench,
  Zap,
  ArrowRight,
  MessageCircle,
  Star,
  Award,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const services = [
  {
    icon: Wrench,
    title: 'Panel Repair & Maintenance',
    description:
      'Expert repair services for all major fire alarm panel brands. Fast turnaround and guaranteed workmanship.',
  },
  {
    icon: Zap,
    title: 'Emergency Response',
    description:
      'Critical issue? Our technicians are available for emergency on-site visits within hours.',
  },
  {
    icon: Shield,
    title: 'Preventive Maintenance',
    description:
      'Scheduled maintenance programs to keep your fire alarm systems running reliably year-round.',
  },
  {
    icon: CheckCircle,
    title: 'System Testing & Certification',
    description:
      'Complete testing, calibration and certification services to meet fire safety compliance standards.',
  },
]

const stats = [
  { label: 'Panels Serviced', value: '5,000+' },
  { label: 'Happy Clients', value: '1,200+' },
  { label: 'Response Time', value: '< 4 hrs' },
  { label: 'Years Experience', value: '15+' },
]

const testimonials = [
  {
    name: 'Rajesh Sharma',
    company: 'Sharma Industries Pvt. Ltd.',
    text: 'Excellent service! Our Notifier panel was repaired within 24 hours. Highly professional team.',
    rating: 5,
  },
  {
    name: 'Priya Menon',
    company: 'Green Valley Residency',
    text: 'Very responsive support. The technician explained everything clearly and fixed all issues.',
    rating: 5,
  },
  {
    name: 'Amit Patel',
    company: 'Patel Commercial Complex',
    text: 'Best fire alarm service provider in the city. Quick response and fair pricing.',
    rating: 5,
  },
]

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-red-600 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900">Notofire</span>
                <span className="text-xl font-bold text-red-600"> Service</span>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <a href="#services" className="text-sm text-gray-600 hover:text-red-600 transition-colors">Services</a>
              <a href="#testimonials" className="text-sm text-gray-600 hover:text-red-600 transition-colors">Reviews</a>
              <Link href="/submit">
                <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                  Submit Request
                </Button>
              </Link>
              <Link href="/login">
                <Button size="sm" variant="outline" className="border-slate-800 text-slate-800 hover:bg-slate-800 hover:text-white">
                  Login
                </Button>
              </Link>
            </div>
            <div className="md:hidden">
              <Link href="/submit">
                <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                  Submit Request
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-gradient text-white py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 border-2 border-white rounded-full" />
          <div className="absolute bottom-10 right-10 w-60 h-60 border-2 border-white rounded-full" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl">
            <Badge className="bg-red-500/20 text-red-200 border-red-400/30 mb-6 text-sm px-3 py-1">
              🔥 Professional Fire Alarm Support
            </Badge>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
              Fire Alarm Panel
              <span className="text-red-400"> Support</span> &amp;
              <span className="text-red-400"> Repair</span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl">
              Fast, reliable, and certified fire alarm panel repair and maintenance services.
              Submit your support request online and get a technician at your doorstep.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/submit">
                <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg">
                  Submit Support Request
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <a href="https://wa.me/919999999999?text=Hello, I need fire alarm panel support" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-3 rounded-lg border-0">
                  <MessageCircle className="mr-2 w-5 h-5" />
                  WhatsApp Us
                </Button>
              </a>
            </div>
            <div className="flex flex-wrap items-center gap-6 mt-10">
              {['Certified Technicians', 'Same-day Service Available', 'All Brands Covered'].map((item) => (
                <div key={item} className="flex items-center gap-2 text-blue-200">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl font-extrabold text-red-600">{stat.value}</div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="bg-red-100 text-red-700 border-red-200 mb-4">Our Services</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Complete Fire Alarm Solutions</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              From emergency repairs to preventive maintenance, we cover every aspect of fire alarm panel servicing.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <div key={service.title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 card-hover">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <service.icon className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-sm text-gray-500">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-red-600 py-16 px-4 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <Award className="w-12 h-12 mx-auto mb-4 text-red-200" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Is Your Fire Alarm Panel Malfunctioning?</h2>
          <p className="text-red-100 text-lg mb-8">
            Do not wait until it&apos;s too late. Submit your support request now and our certified
            technicians will diagnose and fix your fire alarm panel quickly.
          </p>
          <Link href="/submit">
            <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100 font-bold px-10 py-4 text-lg rounded-lg shadow-lg">
              Submit Your Request Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 mb-4">Testimonials</Badge>
            <h2 className="text-3xl font-bold text-gray-900">What Our Clients Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm mb-4">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{t.name}</div>
                  <div className="text-xs text-gray-500">{t.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Strip */}
      <section className="bg-slate-900 py-12 px-4 text-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Phone className="w-8 h-8 text-red-400" />
            <div>
              <div className="text-sm text-slate-400">24/7 Emergency Hotline</div>
              <div className="text-2xl font-bold">+91 99999 99999</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Clock className="w-8 h-8 text-blue-400" />
            <div>
              <div className="text-sm text-slate-400">Business Hours</div>
              <div className="text-lg font-semibold">Mon–Sat: 8 AM – 8 PM</div>
            </div>
          </div>
          <div className="flex gap-3">
            <Link href="/submit">
              <Button className="bg-red-600 hover:bg-red-700 text-white">Submit Request</Button>
            </Link>
            <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-slate-900">
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-8 px-4 text-center text-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-600 rounded flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-semibold">Notofire Service</span>
          </div>
          <p>&copy; {new Date().getFullYear()} Notofire Service. All rights reserved.</p>
          <Link href="/login" className="hover:text-white transition-colors">Staff Login</Link>
        </div>
      </footer>
    </div>
  )
}
