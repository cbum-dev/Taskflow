import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Play, CheckCircle, Users, Star, Zap } from 'lucide-react';

const CTAFooter = () => {
  const features = [
    {
      icon: <CheckCircle className="w-8 h-8 text-emerald-500 dark:text-emerald-400" />,
      title: "14-Day Free Trial",
      description: "No credit card required",
      badge: "Free"
    },
    {
      icon: <Users className="w-8 h-8 text-blue-500 dark:text-blue-400" />,
      title: "Setup in Minutes",
      description: "Get your team started instantly",
      badge: "Quick"
    },
    {
      icon: <Star className="w-8 h-8 text-amber-500 dark:text-amber-400" />,
      title: "24/7 Support",
      description: "We're here when you need us",
      badge: "Support"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br w-full from-blue-50/80 via-purple-50/80 to-white dark:from-blue-900/20 dark:via-purple-900/20 dark:to-black relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200/30 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-200/30 dark:bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      
      <div className="container mx-auto px-6 relative text-center">
        <div className="max-w-4xl mx-auto">
          <Badge variant="outline" className="mb-6 border-blue-500/30 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-transparent">
            Get Started Today
          </Badge>
          
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-8">
            Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">Transform</span> Your Workflow?
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join thousands of teams who've streamlined their project management with TaskFlow. 
            Start your free trial today and experience the difference.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button 
              size="lg" 
              className="group bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-6 text-lg font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-[1.02] border-0"
            >
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="group bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white px-8 py-6 text-lg font-semibold hover:bg-gray-100/80 dark:hover:bg-gray-700/50 hover:border-gray-400 dark:hover:border-gray-600 transition-all duration-300"
            >
              <Play className="mr-2 w-5 h-5 text-blue-500 dark:text-blue-400" />
              Watch Demo
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm border-gray-200 dark:border-gray-700 hover:border-blue-400/50 dark:hover:border-blue-500/30 transition-all duration-300 hover:transform hover:scale-[1.02]">
                <CardHeader className="text-center pb-2">
                  <div className="mx-auto mb-4 p-3 bg-blue-50/50 dark:bg-gray-900/50 rounded-xl w-fit">
                    {feature.icon}
                  </div>
                  <div className="mb-2">
                    <Badge variant="secondary" className="bg-blue-100/70 dark:bg-gray-700 text-blue-600 dark:text-gray-300 text-xs">
                      {feature.badge}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="text-center pt-0">
                  <CardTitle className="text-gray-900 dark:text-white font-semibold mb-2 text-lg">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400 text-sm">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12">
            <Card className="bg-white/80 dark:bg-gray-900/30 border-gray-200 dark:border-gray-800 inline-block">
              <CardContent className="p-4 flex items-center justify-center space-x-4">
                <Zap className="w-5 h-5 text-amber-500 dark:text-amber-400" />
                <span className="text-gray-700 dark:text-gray-300 text-sm">
                  Over 50,000 teams trust TaskFlow to manage their projects
                </span>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTAFooter;