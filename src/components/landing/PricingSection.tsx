import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";
import { useState } from "react";

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    interval: "forever",
    description: "Perfect for getting started",
    features: [
      "Background blur",
      "Basic overlays",
      "720p @ 30fps output",
      "pulse watermark",
      "Community support"
    ],
    cta: "Start Free",
    highlighted: false
  },
  {
    name: "Pro",
    price: "$9.99",
    interval: "month",
    description: "For serious streamers",
    features: [
      "All Free features",
      "Background removal",
      "Virtual backgrounds",
      "Color correction",
      "1080p @ 60fps output",
      "No watermark",
      "Priority support",
      "Custom overlays"
    ],
    cta: "Reserve Pro",
    highlighted: true,
    badge: "Most Popular"
  }
];

export default function PricingSection() {
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);

  const handleReservation = (planName: string) => {
    setProcessingPlan(planName);
    // Scroll to waitlist form
    setTimeout(() => {
      document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' });
      setProcessingPlan(null);
    }, 500);
  };

  return (
    <section className="py-32 bg-[#1A1D29] relative overflow-hidden">
      <div className="container px-4 mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#F5F5F7] mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-[#A0A3B1] max-w-2xl mx-auto">
            Start free, upgrade when you need more power. No hidden fees.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={plan.highlighted ? "md:scale-105" : ""}
            >
              <Card className={`h-full flex flex-col relative ${
                plan.highlighted 
                  ? "bg-[#252936] border-2 border-[#FF6B6B] shadow-[0_0_50px_rgba(255,107,107,0.3)]" 
                  : "bg-[#252936] border-[#3A3D4A] hover:border-[#FF6B6B]"
              } transition-all duration-300`}>
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-[#FF6B6B] text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      {plan.badge}
                    </div>
                  </div>
                )}

                <CardHeader className="pb-8">
                  <CardTitle className="text-2xl text-[#F5F5F7] mb-2">
                    {plan.name}
                  </CardTitle>
                  <CardDescription className="text-[#A0A3B1]">
                    {plan.description}
                  </CardDescription>
                  <div className="mt-4">
                    <span className="text-5xl font-bold text-[#F5F5F7]">
                      {plan.price}
                    </span>
                    <span className="text-[#A0A3B1] ml-2">
                      /{plan.interval}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="flex-grow">
                  <ul className="space-y-4">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-[#00D9FF] flex-shrink-0 mt-0.5" />
                        <span className="text-[#A0A3B1]">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  <Button
                    onClick={() => handleReservation(plan.name)}
                    disabled={processingPlan === plan.name}
                    className={`w-full py-6 text-lg rounded-lg transition-all duration-200 ${
                      plan.highlighted
                        ? "bg-[#FF6B6B] hover:bg-[#ff5252] text-white border-2 border-[#FF6B6B] hover:scale-105"
                        : "bg-transparent hover:bg-[#1A1D29] text-[#F5F5F7] border-2 border-[#3A3D4A] hover:border-[#FF6B6B]"
                    }`}
                  >
                    {processingPlan === plan.name ? "Redirecting..." : plan.cta}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Enterprise note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <p className="text-[#A0A3B1] mb-4">
            Need custom solutions for your team?
          </p>
          <Button 
            variant="outline"
            className="border-2 border-[#3A3D4A] bg-transparent text-[#F5F5F7] hover:bg-[#252936] hover:border-[#FF6B6B] px-8 py-6"
          >
            Contact Sales for Enterprise
          </Button>
        </motion.div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#FF6B6B] rounded-full blur-[150px] opacity-10" />
    </section>
  );
}
