import React, { useState, useEffect } from 'react';
import { Mail, Zap, BarChart, MessageSquare, Brain, Target, Layers, Cpu, ChevronDown, ChevronUp, Send, Bot, Workflow, Users, Database } from 'lucide-react';
import AnimatedHeroTitle from '../components/AnimatedHeroTitle';
import AdminPanel from '../components/AdminPanel';
import { addToWaitlist } from '../services/emailService';

const HomePage: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    const isAdmin = new URLSearchParams(window.location.search).get('admin') === 'true';
    setShowAdmin(isAdmin);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const success = await addToWaitlist(firstName, lastName, email, message);
      setSubmitMessage(success ? 'Thank you for joining our waitlist!' : 'An error occurred. Please try again.');
      if (success) {
        setFirstName('');
        setLastName('');
        setEmail('');
        setMessage('');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitMessage('An unexpected error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <>
      {showAdmin ? (
        <section className="py-12 sm:py-16 md:py-20">
          <div className="container-custom">
            <AdminPanel />
          </div>
        </section>
      ) : (
        <>
          <section className="py-12 sm:py-16 md:py-20 bg-secondary">
            <div className="container-custom text-center">
              <AnimatedHeroTitle />
              <p className="text-lg mb-8 max-w-3xl mx-auto">
                MΛRVI empowers small and medium-sized businesses with easy-to-use AI automation. Boost efficiency, streamline processes, and accelerate growth—unlock your potential in today's competitive market.
              </p>
              <a href="#contact" className="btn-gray">Join the Waitlist</a>
            </div>
          </section>

          <section id="about" className="py-16 sm:py-20">
            <div className="container-custom">
              <h2 className="text-section-heading font-bold mb-12 text-center">About MΛRVI.ΛI</h2>
              <p className="text-lg mb-12 text-center">
                Our advanced AI solutions empower small and medium-sized businesses to streamline workflows, make data-driven decisions, and compete on an equal footing with larger enterprises.
              </p>
              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div className="bg-white p-6 rounded-lg shadow-notion">
                  <Brain className="text-accent mb-4" size={32} />
                  <h3 className="text-subheading font-semibold mb-4">AI Revolution</h3>
                  <p>
                    MΛRVI.ΛI leads the AI revolution, transforming businesses through intelligent automation. Our technology and industry expertise deliver innovation and measurable results.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-notion">
                  <Target className="text-accent mb-4" size={32} />
                  <h3 className="text-subheading font-semibold mb-4">Our Mission</h3>
                  <p>
                    We make AI automation affordable and accessible to small and medium-sized businesses, helping them boost efficiency, reduce costs, and drive growth in a scalable way.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-notion">
                  <Layers className="text-accent mb-4" size={32} />
                  <h3 className="text-subheading font-semibold mb-4">Our Technology</h3>
                  <p>
                    MΛRVI.ΛI leverages advanced machine learning to create adaptable systems that evolve with your business, driving continuous improvement without extensive technical expertise.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section id="services" className="bg-secondary py-16 sm:py-20">
            <div className="container-custom">
              <h2 className="text-section-heading font-bold mb-12 text-center">Our Services</h2>
              <p className="text-lg mb-8 text-center">
                We guide SMBs through the integration of advanced AI technologies—from concept to implementation—ensuring tailored solutions that meet your specific needs and budget constraints.
              </p>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-notion">
                  <Bot className="text-accent mb-4" size={32} />
                  <h3 className="text-subheading font-semibold mb-4">Chatbot Development</h3>
                  <p>Enhance customer experience and streamline operations with our chatbot solutions.</p>
                  <ul className="mt-4 list-disc list-inside">
                    <li>Customer Support Automation</li>
                    <li>Lead Generation & Qualification</li>
                    <li>Product Recommendations</li>
                    <li>Voice Bots</li>
                    <li>Multi-language Support</li>
                    <li>Custom Chatbot Design</li>
                  </ul>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-notion">
                  <Workflow className="text-accent mb-4" size={32} />
                  <h3 className="text-subheading font-semibold mb-4">Workflow Automations</h3>
                  <p>Automate your business processes to save time and boost efficiency.</p>
                  <ul className="mt-4 list-disc list-inside">
                    <li>Social Media Automation</li>
                    <li>CRM Management</li>
                    <li>Lead Qualification</li>
                    <li>Onboarding Processes</li>
                    <li>Web Scraping Systems</li>
                    <li>Natural Language to SQL Conversion</li>
                  </ul>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-notion">
                  <Users className="text-accent mb-4" size={32} />
                  <h3 className="text-subheading font-semibold mb-4">Individual Consulting</h3>
                  <p>Tailored consulting services to guide your AI journey.</p>
                  <ul className="mt-4 list-disc list-inside">
                    <li>Strategic Planning</li>
                    <li>Feasibility Evaluations</li>
                    <li>Identifying Use Cases</li>
                    <li>Coaching for AI Agency Owners</li>
                    <li>Implementation Roadmaps</li>
                    <li>Custom Consulting Solutions</li>
                  </ul>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-notion">
                  <Database className="text-accent mb-4" size={32} />
                  <h3 className="text-subheading font-semibold mb-4">Machine Learning Integration</h3>
                  <p>Harness machine learning to solve complex challenges and enhance your business capabilities.</p>
                  <ul className="mt-4 list-disc list-inside">
                    <li>Predictive Maintenance</li>
                    <li>Customer Churn Prevention</li>
                    <li>Inventory Optimisation</li>
                    <li>Fraud Detection</li>
                    <li>Personalised Marketing</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section id="faq" className="py-16 sm:py-20">
            <div className="container-custom">
              <h2 className="text-section-heading font-bold mb-12 text-center">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {[
                  { q: "How can AI automation benefit my small business?", a: "AI automation can significantly improve efficiency and reduce costs. For example, it can automate your scheduling processes, saving your team hours every week, or provide 24/7 customer support through chatbots, improving customer satisfaction." },
                  { q: "Is MΛRVI.AI's solution suitable for my industry?", a: "MΛRVI.AI's solutions are versatile and can be applied across various industries, including finance, healthcare, retail, manufacturing, and more. Our AI technology adapts to specific industry needs and challenges." },
                  { q: "How does MΛRVI.AI ensure data security?", a: "We prioritise data security with state-of-the-art encryption, regular security audits, and compliance with industry standards like GDPR. Your data is protected at every step of the process." },
                  { q: "Can MΛRVI.AI integrate with my existing systems?", a: "Yes, our solutions are designed to seamlessly integrate with your existing infrastructure and software ecosystem, minimising disruption to your current operations." },
                  { q: "What kind of support does MΛRVI.AI offer?", a: "We provide comprehensive support, including initial setup, training, ongoing maintenance, and dedicated customer service to ensure you get the most out of our AI solutions." },
                  { q: "How long does it take to see results from AI automation?", a: "The timeline can vary depending on the complexity of the solution, but most businesses start seeing measurable improvements in efficiency within 2-3 months after deployment. Some benefits, like 24/7 customer support through chatbots, can be almost immediate." }
                ].map((faq, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-notion">
                    <button
                      className="flex justify-between items-center w-full p-4 text-left"
                      onClick={() => toggleFaq(index)}
                    >
                      <span className="font-semibold">{faq.q}</span>
                      {expandedFaq === index ? <ChevronUp /> : <ChevronDown />}
                    </button>
                    {expandedFaq === index && (
                      <div className="p-4 pt-0">
                        <p>{faq.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="contact" className="py-16 sm:py-20 bg-gray-100">
            <div className="container-custom">
              <h2 className="text-section-heading font-bold mb-8 text-center">Stay Updated</h2>
              <div className="max-w-md mx-auto">
                <p className="mb-6 text-center">Join our waitlist today to get exclusive access to powerful AI tools that can transform your business operations and give you a competitive edge.</p>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    className="input-field"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="input-field"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="input-field"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <textarea
                    placeholder="What challenges are you facing that AI automation could solve?"
                    className="input-field h-24 resize-none"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <button type="submit" className="btn-gray flex items-center justify-center" disabled={isSubmitting}>
                    <Send className="mr-2" size={18} />
                    {isSubmitting ? 'Subscribing...' : 'Join Waitlist'}
                  </button>
                </form>
                {submitMessage && (
                  <p className="mt-4 text-center font-semibold">{submitMessage}</p>
                )}
                <p className="mt-4 text-sm text-text-secondary text-center">We respect your privacy. Your information will only be used to notify you about our launch and provide exclusive offers.</p>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
};

export default HomePage;