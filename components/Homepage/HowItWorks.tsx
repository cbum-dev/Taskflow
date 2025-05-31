import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, Users, Zap, ArrowRight } from 'lucide-react';
import Image from 'next/image';

const HowItWorks = () => {
  const steps = [
    {
      icon: <Target className="w-8 h-8 text-blue-400 dark:text-blue-500" />,
      title: "Create & Plan",
      description: "Set up projects, define user stories, and plan your sprints with intuitive drag-and-drop boards.",
      imageLight: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop",
      imageDark: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=300&fit=crop"
    },
    {
      icon: <Users className="w-8 h-8 text-purple-400 dark:text-purple-500" />,
      title: "Collaborate & Track",
      description: "Work together seamlessly with real-time updates, comments, and automatic progress tracking.",
      imageLight: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop",
      imageDark: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop"
    },
    {
      icon: <Zap className="w-8 h-8 text-green-400 dark:text-green-500" />,
      title: "Ship & Iterate",
      description: "Deploy faster with automated workflows, detailed analytics, and continuous improvement insights.",
      imageLight: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
      imageDark: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=300&fit=crop"
    }
  ];

  return (
    <section className="py-24 bg-gray-50  dark:bg-neutral-950 w-full relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      
      <div className="container mx-auto px-6 relative">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 border-blue-500/30 text-blue-500 dark:text-blue-400">
            How It Works
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Transform Your Workflow in <span className="text-blue-500">3 Steps</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            From planning to shipping, streamline your entire development process
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="group relative">
              <Card className="bg-white dark:bg-gray-900/50 backdrop-blur-sm border-gray-200 dark:border-gray-800 hover:border-blue-500/30 transition-all duration-300 hover:transform hover:scale-105 h-full">
                <CardHeader className="p-0">
                  <div className="aspect-video rounded-t-lg overflow-hidden relative">
                    <Image 
                      src={step.imageLight}
                      alt={step.title}
                      fill
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 dark:hidden"
                    />
                    <Image 
                      src={step.imageDark}
                      alt={step.title}
                      fill
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 hidden dark:block"
                    />
                  </div>
                </CardHeader>
                
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-xl mr-4">
                      {step.icon}
                    </div>
                    <Badge variant="secondary" className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                      Step {index + 1}
                    </Badge>
                  </div>
                  
                  <CardTitle className="text-2xl text-gray-900 dark:text-white mb-3">
                    {step.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400 leading-relaxed text-base">
                    {step.description}
                  </CardDescription>
                </CardContent>
              </Card>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full">
                    <ArrowRight className="w-6 h-6 text-blue-400 dark:text-blue-500" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;