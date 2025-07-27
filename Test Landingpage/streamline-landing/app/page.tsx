import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Star, Users, Zap, Shield, BarChart3, ArrowRight, Menu, Twitter, Linkedin, Github } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function StreamLineLanding() {
  return (
    <div className="min-h-screen bg-[#0d0e10] text-white relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      {/* Header */}
      <header className="relative z-50 w-full border-b border-white/10 bg-[#0d0e10]/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white">
              <Zap className="h-4 w-4 text-black" />
            </div>
            <span className="text-lg font-medium text-white">StreamLine</span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-sm text-gray-400 hover:text-white transition-colors">
              Product
            </Link>
            <Link href="#testimonials" className="text-sm text-gray-400 hover:text-white transition-colors">
              Resources
            </Link>
            <Link href="#pricing" className="text-sm text-gray-400 hover:text-white transition-colors">
              Pricing
            </Link>
            <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
              Customers
            </Link>
            <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
              Blog
            </Link>
            <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
              Contact
            </Link>
          </nav>

          <div className="flex items-center space-x-3">
            <Button variant="ghost" className="hidden md:inline-flex text-gray-400 hover:text-white hover:bg-white/5">
              Log in
            </Button>
            <Button className="bg-white text-black hover:bg-gray-100 font-medium">Sign up</Button>
            <Button variant="ghost" size="sm" className="md:hidden text-gray-400">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-32 md:py-40">
        <div className="container px-6">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-8 bg-white/10 text-white border-white/20 hover:bg-white/15">
              ✨ Introducing AI-powered automation
            </Badge>
            <h1 className="mb-8 text-5xl font-medium tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">
              Built for modern
              <br />
              <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">teams</span>
            </h1>
            <p className="mb-12 text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Streamline your workflow with purpose-built tools.
              <br />
              Designed for speed, built for scale.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="bg-white text-black hover:bg-gray-100 font-medium px-8 py-3 h-12">
                Get started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="text-gray-400 hover:text-white hover:bg-white/5 px-8 py-3 h-12"
              >
                View demo
              </Button>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="container px-6 mt-20">
          <div className="mx-auto max-w-6xl">
            <div className="relative rounded-xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-1">
              <Image
                src="/placeholder.svg?height=600&width=1000&text=StreamLine+Dashboard"
                alt="StreamLine Dashboard"
                width={1000}
                height={600}
                className="rounded-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-32">
        <div className="container px-6">
          <div className="mx-auto max-w-2xl text-center mb-20">
            <h2 className="text-4xl font-medium tracking-tight text-white mb-6">Everything you need</h2>
            <p className="text-xl text-gray-400">Powerful features that adapt to how you work</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
            <div className="group">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/5 border border-white/10 mb-6 group-hover:bg-white/10 transition-colors">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-medium text-white mb-3">AI Automation</h3>
              <p className="text-gray-400 leading-relaxed">
                Intelligent workflows that learn and adapt to your team's patterns
              </p>
            </div>

            <div className="group">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/5 border border-white/10 mb-6 group-hover:bg-white/10 transition-colors">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-medium text-white mb-3">Team Sync</h3>
              <p className="text-gray-400 leading-relaxed">
                Real-time collaboration with instant updates across all devices
              </p>
            </div>

            <div className="group">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/5 border border-white/10 mb-6 group-hover:bg-white/10 transition-colors">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-medium text-white mb-3">Insights</h3>
              <p className="text-gray-400 leading-relaxed">
                Deep analytics to understand performance and optimize workflows
              </p>
            </div>

            <div className="group">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/5 border border-white/10 mb-6 group-hover:bg-white/10 transition-colors">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-medium text-white mb-3">Security</h3>
              <p className="text-gray-400 leading-relaxed">Enterprise-grade security with SOC 2 compliance and SSO</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative py-32">
        <div className="container px-6">
          <div className="mx-auto max-w-2xl text-center mb-20">
            <h2 className="text-4xl font-medium tracking-tight text-white mb-6">Trusted by teams</h2>
            <p className="text-xl text-gray-400">Join thousands of companies building better products</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
            <div className="border border-white/10 rounded-xl p-8 bg-white/5 backdrop-blur-sm">
              <div className="flex mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-white text-white" />
                ))}
              </div>
              <blockquote className="text-gray-300 mb-8 leading-relaxed">
                "StreamLine has completely transformed how our engineering team collaborates. The AI automation saves us
                hours every week."
              </blockquote>
              <div className="flex items-center">
                <Image
                  src="/placeholder.svg?height=40&width=40"
                  alt="Sarah Chen"
                  width={40}
                  height={40}
                  className="rounded-full mr-4"
                />
                <div>
                  <div className="font-medium text-white">Sarah Chen</div>
                  <div className="text-sm text-gray-400">VP Engineering, TechCorp</div>
                </div>
              </div>
            </div>

            <div className="border border-white/10 rounded-xl p-8 bg-white/5 backdrop-blur-sm">
              <div className="flex mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-white text-white" />
                ))}
              </div>
              <blockquote className="text-gray-300 mb-8 leading-relaxed">
                "The most intuitive project management tool we've used. Our team adopted it instantly and productivity
                soared."
              </blockquote>
              <div className="flex items-center">
                <Image
                  src="/placeholder.svg?height=40&width=40"
                  alt="Marcus Rodriguez"
                  width={40}
                  height={40}
                  className="rounded-full mr-4"
                />
                <div>
                  <div className="font-medium text-white">Marcus Rodriguez</div>
                  <div className="text-sm text-gray-400">Product Manager, StartupXYZ</div>
                </div>
              </div>
            </div>

            <div className="border border-white/10 rounded-xl p-8 bg-white/5 backdrop-blur-sm">
              <div className="flex mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-white text-white" />
                ))}
              </div>
              <blockquote className="text-gray-300 mb-8 leading-relaxed">
                "Finally, a tool that makes remote work feel seamless. Our distributed team has never been more
                aligned."
              </blockquote>
              <div className="flex items-center">
                <Image
                  src="/placeholder.svg?height=40&width=40"
                  alt="Emily Watson"
                  width={40}
                  height={40}
                  className="rounded-full mr-4"
                />
                <div>
                  <div className="font-medium text-white">Emily Watson</div>
                  <div className="text-sm text-gray-400">Design Lead, CreativeStudio</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative py-32">
        <div className="container px-6">
          <div className="mx-auto max-w-2xl text-center mb-20">
            <h2 className="text-4xl font-medium tracking-tight text-white mb-6">Simple pricing</h2>
            <p className="text-xl text-gray-400">Start free, scale as you grow</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3 max-w-5xl mx-auto">
            {/* Starter Plan */}
            <div className="border border-white/10 rounded-xl p-8 bg-white/5 backdrop-blur-sm">
              <div className="mb-8">
                <h3 className="text-xl font-medium text-white mb-2">Starter</h3>
                <p className="text-gray-400 mb-6">For small teams getting started</p>
                <div className="flex items-baseline">
                  <span className="text-4xl font-medium text-white">$9</span>
                  <span className="text-gray-400 ml-2">/user/month</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-300">
                  <Check className="h-4 w-4 text-white mr-3 flex-shrink-0" />
                  Up to 10 team members
                </li>
                <li className="flex items-center text-gray-300">
                  <Check className="h-4 w-4 text-white mr-3 flex-shrink-0" />
                  Basic project management
                </li>
                <li className="flex items-center text-gray-300">
                  <Check className="h-4 w-4 text-white mr-3 flex-shrink-0" />
                  5GB storage per user
                </li>
                <li className="flex items-center text-gray-300">
                  <Check className="h-4 w-4 text-white mr-3 flex-shrink-0" />
                  Email support
                </li>
              </ul>
              <Button className="w-full bg-white/10 text-white border border-white/20 hover:bg-white/20">
                Get started
              </Button>
            </div>

            {/* Professional Plan */}
            <div className="border border-white/20 rounded-xl p-8 bg-white/10 backdrop-blur-sm relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-white text-black px-3 py-1 font-medium">Most popular</Badge>
              </div>
              <div className="mb-8">
                <h3 className="text-xl font-medium text-white mb-2">Professional</h3>
                <p className="text-gray-400 mb-6">For growing teams and businesses</p>
                <div className="flex items-baseline">
                  <span className="text-4xl font-medium text-white">$19</span>
                  <span className="text-gray-400 ml-2">/user/month</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-300">
                  <Check className="h-4 w-4 text-white mr-3 flex-shrink-0" />
                  Up to 50 team members
                </li>
                <li className="flex items-center text-gray-300">
                  <Check className="h-4 w-4 text-white mr-3 flex-shrink-0" />
                  Advanced project management
                </li>
                <li className="flex items-center text-gray-300">
                  <Check className="h-4 w-4 text-white mr-3 flex-shrink-0" />
                  AI automation features
                </li>
                <li className="flex items-center text-gray-300">
                  <Check className="h-4 w-4 text-white mr-3 flex-shrink-0" />
                  50GB storage per user
                </li>
                <li className="flex items-center text-gray-300">
                  <Check className="h-4 w-4 text-white mr-3 flex-shrink-0" />
                  Priority support
                </li>
              </ul>
              <Button className="w-full bg-white text-black hover:bg-gray-100 font-medium">Get started</Button>
            </div>

            {/* Enterprise Plan */}
            <div className="border border-white/10 rounded-xl p-8 bg-white/5 backdrop-blur-sm">
              <div className="mb-8">
                <h3 className="text-xl font-medium text-white mb-2">Enterprise</h3>
                <p className="text-gray-400 mb-6">For large organizations</p>
                <div className="flex items-baseline">
                  <span className="text-4xl font-medium text-white">$39</span>
                  <span className="text-gray-400 ml-2">/user/month</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-300">
                  <Check className="h-4 w-4 text-white mr-3 flex-shrink-0" />
                  Unlimited team members
                </li>
                <li className="flex items-center text-gray-300">
                  <Check className="h-4 w-4 text-white mr-3 flex-shrink-0" />
                  Custom workflows
                </li>
                <li className="flex items-center text-gray-300">
                  <Check className="h-4 w-4 text-white mr-3 flex-shrink-0" />
                  Advanced AI automation
                </li>
                <li className="flex items-center text-gray-300">
                  <Check className="h-4 w-4 text-white mr-3 flex-shrink-0" />
                  Unlimited storage
                </li>
                <li className="flex items-center text-gray-300">
                  <Check className="h-4 w-4 text-white mr-3 flex-shrink-0" />
                  24/7 dedicated support
                </li>
              </ul>
              <Button className="w-full bg-white/10 text-white border border-white/20 hover:bg-white/20">
                Contact sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-32">
        <div className="container px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-4xl font-medium tracking-tight text-white mb-8">Ready to get started?</h2>
            <p className="text-xl text-gray-400 mb-12">
              Join thousands of teams already using StreamLine to build better products faster.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="bg-white text-black hover:bg-gray-100 font-medium px-8 py-3 h-12">
                Start free trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="text-gray-400 hover:text-white hover:bg-white/5 px-8 py-3 h-12"
              >
                Talk to sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/10 py-16">
        <div className="container px-6">
          <div className="grid gap-12 md:grid-cols-5">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white">
                  <Zap className="h-4 w-4 text-black" />
                </div>
                <span className="text-lg font-medium text-white">StreamLine</span>
              </div>
              <p className="text-gray-400 mb-8 max-w-sm">
                Built for modern teams who want to move fast and build great products.
              </p>
              <div className="flex space-x-4">
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Github className="h-5 w-5" />
                </Link>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-white mb-4">Product</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Changelog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    API
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-white mb-4">Company</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-white mb-4">Resources</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Community
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Status
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© {new Date().getFullYear()} StreamLine. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Security
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
