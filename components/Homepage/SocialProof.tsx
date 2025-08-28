import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Quote, Building2 } from "lucide-react";
import { FaAirbnb, FaGoogle, FaInstagram, FaMicrosoft, FaSpotify, FaStripe } from "react-icons/fa";

const SocialProof = () => {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Engineering Manager",
      company: "TechFlow Inc",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b73f2f5a?w=80&h=80&fit=crop&crop=face",
      content:
        "TaskFlow transformed how our team collaborates. Sprint planning that used to take hours now takes minutes.",
      rating: 5,
    },
    {
      name: "Marcus Rodriguez",
      role: "Product Owner",
      company: "InnovateLab",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
      content:
        "The real-time collaboration features are game-changing. Our remote team feels more connected than ever.",
      rating: 5,
    },
    {
      name: "Emma Thompson",
      role: "Scrum Master",
      company: "DevCorp",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
      content:
        "Best project management tool we've used. The analytics help us improve our velocity consistently.",
      rating: 5,
    },
  ];

  const companies = [
    { name: "Microsoft", logo: "MS", element: <FaMicrosoft className="mx-auto h-7 w-7" /> },
    { name: "Google", logo: "G", element: <FaGoogle className="mx-auto h-7 w-7" /> },
    { name: "Stripe", logo: "S", element: <FaStripe className="mx-auto h-7 w-7"/> },
    { name: "Airbnb", logo: "A", element: <FaAirbnb className="mx-auto h-7 w-7"/> },
    { name: "Spotify", logo: "Sp", element: <FaSpotify className="mx-auto h-7 w-7"/> },
    { name: "Instagram", logo: "N", element: <FaInstagram className="mx-auto h-7 w-7"/> },
  ];

  const stats = [
    { number: "50K+", label: "Active Teams", icon: "👥" },
    { number: "2M+", label: "Issues Tracked", icon: "📊" },
    { number: "99.9%", label: "Uptime", icon: "⚡" },
    { number: "4.9/5", label: "User Rating", icon: "⭐" },
  ];

  return (
    <section className="py-24 bg-gray-50 w-full dark:bg-neutral-950  relative">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <div className="container mx-auto px-6 relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 text-center hover:border-blue-500/30 transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-sm">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mb-16">
          <Badge
            variant="outline"
            className="mb-6 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400"
          >
            Trusted by Industry Leaders
          </Badge>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-6 max-w-4xl mx-auto">
            {companies.map((company, index) => (
              <Card
                key={index}
                className="bg-white/50 dark:bg-gray-900/30 border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 group"
              >
                <CardContent className="p-4 flex flex-col items-center justify-evenly">
                  <div className=" relative mb-2 group-hover:scale-110 transition-transform">
                    {company.element}{" "}
                  </div>
                  <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                    {company.name}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="text-center mb-12">
          <Badge
            variant="outline"
            className="mb-4 border-blue-500/30 text-blue-500 dark:text-blue-400"
          >
            Customer Stories
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            What Our <span className="text-blue-500">Users Say</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="bg-white dark:bg-gray-900/50 backdrop-blur-sm border-gray-200 dark:border-gray-800 hover:border-blue-500/30 transition-all duration-300 hover:transform hover:scale-105"
            >
              <CardHeader>
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-blue-500 dark:text-blue-400 mb-2" />
              </CardHeader>

              <CardContent>
                <CardDescription className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed text-base">
                  "{testimonial.content}"
                </CardDescription>

                <div className="flex items-center">
                  <Avatar className="mr-4">
                    <AvatarImage
                      src={testimonial.avatar}
                      alt={testimonial.name}
                    />
                    <AvatarFallback className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white">
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-gray-900 dark:text-white text-lg">
                      {testimonial.name}
                    </CardTitle>
                    <CardDescription className="flex items-center text-gray-600 dark:text-gray-400">
                      <Building2 className="w-3 h-3 mr-1" />
                      {testimonial.role} at {testimonial.company}
                    </CardDescription>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
