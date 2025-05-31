"use client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { GitBranch, Kanban, GanttChart,ChevronRight, BarChart, Zap, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Badge} from "../ui/badge";

const features = [
  {
    icon: <Kanban className="h-8 w-8" />,
    title: "Visual Kanban",
    description: "Drag-and-drop interface with customizable workflows",
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  {
    icon: <GanttChart className="h-8 w-8" />,
    title: "Sprint Planning",
    description: "Agile roadmaps with velocity tracking",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10"
  },
  {
    icon: <GitBranch className="h-8 w-8" />,
    title: "Git Integration",
    description: "Link commits to issues automatically",
    color: "text-purple-500",
    bg: "bg-purple-500/10"
  },
  {
    icon: <BarChart className="h-8 w-8" />,
    title: "Advanced Analytics",
    description: "Burndown charts and cycle time reports",
    color: "text-amber-500",
    bg: "bg-amber-500/10"
  },
  {
    icon: <Zap className="h-8 w-8" />,
    title: "Quick Actions",
    description: "Keyboard shortcuts and command menu",
    color: "text-rose-500",
    bg: "bg-rose-500/10"
  },
  {
    icon: <ShieldCheck className="h-8 w-8" />,
    title: "Enterprise Security",
    description: "SOC 2 compliant with SSO support",
    color: "text-indigo-500",
    bg: "bg-indigo-500/10"
  }
];

export function FeatureGrid() {
  return (
    <section className="container relative py-24 w-full ">
      <div className="mx-auto max-w-4xl text-center">       

      <Badge variant="outline" className="mb-4 relative z-10 border-blue-500/30 text-blue-500 dark:text-blue-400">
Features          </Badge>
        <h2 className="text-3xl z-10 relative font-bold tracking-tight sm:text-4xl">
          Everything your team needs
        </h2>
        <p className="mt-4 relative z-10 text-lg text-muted-foreground">
          TaskFlow adapts to your workflow with powerful features
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="h-full transition-all hover:shadow-lg hover:shadow-primary/10">

              <CardHeader>
                <div className={cn("mb-4 flex h-12 w-12 items-center justify-center rounded-lg", feature.bg)}>
                  {feature.icon}
                </div>
                <CardTitle className={feature.color}>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="link" className={cn("px-0 hover:no-underline relative z-10", feature.color)}>
                  Learn more <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

    </section>
  );
}

