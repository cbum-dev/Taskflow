import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';

const PricingPreview = () => {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for small teams getting started",
      features: [
        "Up to 10 team members",
        "3 projects",
        "Basic reporting",
        "Community support"
      ],
      buttonText: "Get Started",
      buttonVariant: "outline",
      popular: false
    },
    {
      name: "Professional",
      price: "$8",
      period: "per user/month",
      description: "Advanced features for growing teams",
      features: [
        "Unlimited team members",
        "Unlimited projects",
        "Advanced analytics",
        "Priority support",
        "Custom workflows",
        "Time tracking"
      ],
      buttonText: "Start Free Trial",
      buttonVariant: "default",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "contact us",
      description: "Scalable solution for large organizations",
      features: [
        "Everything in Professional",
        "Advanced security",
        "SSO integration",
        "Custom integrations",
        "Dedicated support",
        "SLA guarantee"
      ],
      buttonText: "Contact Sales",
      buttonVariant: "outline",
      popular: false
    }
  ];

  return (
    <section className="py-24 bg-gray-50 w-full dark:bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      

      <div className="container mx-auto px-6 relative">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 border-blue-500/30 text-blue-500 dark:text-blue-400">
            Pricing Plans
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Simple <span className="text-blue-500">Pricing</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Choose the plan that fits your team's needs. Start free, upgrade when you're ready.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div key={index} className={`relative ${plan.popular ? 'transform scale-105 z-10' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <Card className={`h-full flex flex-col transition-all duration-300 hover:transform hover:scale-105 ${
                plan.popular 
                  ? 'bg-white dark:bg-gray-900/80 border-blue-500/50 shadow-2xl shadow-blue-500/10 dark:shadow-blue-500/20' 
                  : 'bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 hover:border-blue-500/30'
              }`}>
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl text-gray-900 dark:text-white mb-2">{plan.name}</CardTitle>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                    {plan.period !== "contact us" && (
                      <CardDescription className="text-gray-600 dark:text-gray-400 mt-1">
                        /{plan.period}
                      </CardDescription>
                    )}
                  </div>
                  <CardDescription className="text-gray-600 dark:text-gray-400 text-base">
                    {plan.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col">
                  <div className="flex-1 mb-8">
                    <ul className="space-y-4">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start text-gray-700 dark:text-gray-300">
                          <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button 
                    className={`w-full py-6 font-semibold text-base transition-all duration-300 ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg shadow-blue-500/25 dark:shadow-blue-500/40 border-0' 
                        : plan.buttonVariant === 'outline'
                          ? 'bg-transparent border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-600'
                          : ''
                    }`}
                    //@ts-ignore
                    variant={plan.popular ? 'default' : plan.buttonVariant}
                  >
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Card className="bg-white/50 dark:bg-gray-900/30 border-gray-200 dark:border-gray-800 inline-block">
            <CardContent className="p-4">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                All plans include 14-day free trial • No credit card required • Cancel anytime
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PricingPreview;