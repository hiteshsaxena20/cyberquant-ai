import { Link } from 'react-router-dom';
import { BookOpen, Calendar, User, ArrowRight } from 'lucide-react';

export default function BlogPage() {
  const posts = [
    {
      title: 'Why High/Medium/Low Risk Heatmaps are Failing CISOs in Boardrooms',
      category: 'Cyber Risk Quantification',
      date: 'Sep 24, 2026',
      author: 'Aditya Mandloi, Chief Risk Architect',
      excerpt: 'Qualitative color-coded heatmaps lack statistical confidence intervals. Discover how Open FAIR Monte Carlo simulation converts subjective risk into exact ₹ Expected Annual Loss.',
    },
    {
      title: 'Quantifying Ransomware Tail Risk: Calculating 95% Cyber VaR',
      category: 'Financial Modeling',
      date: 'Sep 18, 2026',
      author: 'Priya Sharma, Lead Quant Engineer',
      excerpt: 'Learn how Cyber Value at Risk (VaR) models extreme 95th percentile loss events to help treasury teams decide optimal cyber insurance coverage levels.',
    },
    {
      title: 'Navigating SEBI & RBI Cyber Security Guidelines with Automated Evidence',
      category: 'Regulatory Compliance',
      date: 'Sep 10, 2026',
      author: 'Rakesh Verma, Compliance Director',
      excerpt: 'A practical roadmap for Indian scheduled commercial banks and depository participants to automate quarterly VAPT and SOC reporting.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 animate-fade-in">
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Cyber Risk Insights & Financial AI Engineering
        </h1>
        <p className="text-sm text-dark-300">
          Articles, whitepapers, and mathematical research from the CyberTwinX engineering team.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {posts.map((p, i) => (
          <div key={i} className="glass-card p-6 flex flex-col justify-between space-y-4 hover:border-cyber-500/40 transition-all">
            <div className="space-y-3">
              <span className="badge badge-low text-[10px]">{p.category}</span>
              <h3 className="text-lg font-bold text-white hover:text-cyber-300 transition-colors cursor-pointer">
                {p.title}
              </h3>
              <p className="text-xs text-dark-400 leading-relaxed">{p.excerpt}</p>
            </div>
            <div className="pt-4 border-t border-dark-800 flex items-center justify-between text-[11px] text-dark-500">
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-cyber-400" />
                <span>{p.author.split(',')[0]}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{p.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
