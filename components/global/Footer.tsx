import { 
    Github, 
    Twitter, 
    Linkedin, 
    Mail, 
    HelpCircle, 
    BookOpen, 
    Code, 
    Shield, 
    Globe, 
    Clock,
    Heart 
  } from "lucide-react";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Separator } from "@/components/ui/separator";
  import { ModeToggle } from "@/components/global/mode-toggle";
  import Link from "next/link";
  
  export function Footer() {
    const currentYear = new Date().getFullYear();
  
    return (
      <footer className="bg-background border-t">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">TaskFlow</h3>
              <p className="text-muted-foreground">
                Organize your work efficiently with TaskFlow. Create, manage, and track your
                workspaces and projects seamlessly.
              </p>
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon">
                  <Github className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Linkedin className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Mail className="h-5 w-5" />
                </Button>
              </div>
            </div>
  
            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Quick Links</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/features" className="hover:text-primary transition-colors flex items-center">
                    <Code className="h-4 w-4 mr-2" /> Features
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-primary transition-colors flex items-center">
                    <BookOpen className="h-4 w-4 mr-2" /> Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/docs" className="hover:text-primary transition-colors flex items-center">
                    <HelpCircle className="h-4 w-4 mr-2" /> Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/status" className="hover:text-primary transition-colors flex items-center">
                    <Shield className="h-4 w-4 mr-2" /> System Status
                  </Link>
                </li>
              </ul>
            </div>
  
            {/* Resources */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Resources</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/blog" className="hover:text-primary transition-colors flex items-center">
                    <BookOpen className="h-4 w-4 mr-2" /> Blog
                  </Link>
                </li>
                <li>
                  <Link href="/community" className="hover:text-primary transition-colors flex items-center">
                    <Globe className="h-4 w-4 mr-2" /> Community
                  </Link>
                </li>
                <li>
                  <Link href="/webinars" className="hover:text-primary transition-colors flex items-center">
                    <Clock className="h-4 w-4 mr-2" /> Webinars
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="hover:text-primary transition-colors flex items-center">
                    <HelpCircle className="h-4 w-4 mr-2" /> Support
                  </Link>
                </li>
              </ul>
            </div>
  
            {/* Newsletter */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Stay Updated</h3>
              <p className="text-muted-foreground">
                Subscribe to our newsletter for the latest updates and features.
              </p>
              <div className="flex space-x-2">
                <Input type="email" placeholder="Your email" className="flex-1" />
                <Button variant="default">Subscribe</Button>
              </div>
              <div className="flex items-center justify-between pt-4">
                <ModeToggle />
                <div className="text-sm text-muted-foreground">
                  Available in English
                </div>
              </div>
            </div>
          </div>
  
          <Separator className="my-8" />
  
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-sm text-muted-foreground flex items-center">
              <Heart className="h-4 w-4 mr-1 text-red-500" />
              <span>Made with love · © {currentYear} TaskFlow. All rights reserved.</span>
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-sm text-muted-foreground hover:text-primary">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    );
  }