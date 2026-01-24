import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { supabase } from "../../../supabase/supabase";
import { toast } from "sonner";
import { CheckCircle2, Loader2 } from "lucide-react";

export default function WaitlistSection() {
  const [email, setEmail] = useState("");
  const [selectedTier, setSelectedTier] = useState<"free" | "pro">("free");
  
  // Debug: Log current configuration
  console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
  console.log('Supabase Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [waitlistNumber, setWaitlistNumber] = useState<number | null>(null);
  const [liveCount, setLiveCount] = useState(1247); // Mock initial count

  useEffect(() => {
    // Simulate live counter updates
    const interval = setInterval(() => {
      setLiveCount(prev => prev + Math.floor(Math.random() * 3));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleCloseModal = () => {
    setShowSuccess(false);
    setEmail("");
    setWaitlistNumber(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      // Get UTM params from URL
      const urlParams = new URLSearchParams(window.location.search);
      const utmSource = urlParams.get('utm_source');
      const utmMedium = urlParams.get('utm_medium');
      const utmCampaign = urlParams.get('utm_campaign');
      const referralCode = urlParams.get('ref');

      // For Pro tier, redirect to Stripe checkout
      if (selectedTier === "pro") {
        // First join waitlist, then create checkout
        const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke(
          'create-checkout',
          {
            body: {
              price_id: import.meta.env.VITE_STRIPE_PRO_PRICE_ID || 'price_pro_placeholder',
              user_email: email,
              return_url: `${window.location.origin}/success`,
            },
          }
        );

        if (checkoutError) throw checkoutError;

        if (checkoutData?.url) {
          window.location.href = checkoutData.url;
        } else {
          throw new Error('No checkout URL returned');
        }
      } else {
        // For free tier, save to waitlist via direct database insertion
        try {
          // Check if email already exists
          const { data: existingEntry } = await supabase
            .from('waitlist')
            .select('id, email, tier, waitlist_number, referral_code')
            .eq('email', email.toLowerCase())
            .single();

          if (existingEntry) {
            // User already on waitlist, return their info
            setWaitlistNumber(existingEntry.waitlist_number);
            setShowSuccess(true);
            toast.success("Welcome back!", {
              description: `You're already on the waitlist with number #${existingEntry.waitlist_number}.`,
            });
            return;
          }

          // Insert new waitlist entry
          const { data: newEntry, error: insertError } = await supabase
            .from('waitlist')
            .insert({
              email: email.toLowerCase(),
              tier: 'free',
              status: 'active',
              ip_address: 'localhost', // Fallback IP for local testing
              user_agent: navigator.userAgent,
              utm_source: utmSource,
              utm_medium: utmMedium,
              utm_campaign: utmCampaign
            })
            .select('id, email, tier, waitlist_number, referral_code, status')
            .single();

          if (insertError) {
            console.error('Error inserting waitlist entry:', insertError);
            
            // If table doesn't exist, show a more helpful error
            if (insertError.code === 'PGRST116' || insertError.message?.includes('relation "waitlist" does not exist')) {
              throw new Error('Waitlist table not found. Please contact support.');
            }
            
            throw insertError;
          }

          // Get total count for social proof
          const { count: totalCount } = await supabase
            .from('waitlist')
            .select('*', { count: 'exact', head: true });

          setWaitlistNumber(newEntry.waitlist_number || Math.floor(Math.random() * 1000) + 1); // Fallback number
          setShowSuccess(true);
          
          // Update live count with actual total
          if (totalCount) {
            setLiveCount(totalCount);
          }
          
          toast.success("You're on the list!", {
            description: `We'll notify you at ${email} when pulse launches.`,
          });
        } catch (error) {
          console.error('Waitlist signup error:', error);
          throw error;
        }
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("Something went wrong", {
        description: error instanceof Error ? error.message : "Please try again or contact support.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (showSuccess && selectedTier === "free") {
    return (
      <section id="waitlist" className="py-32 bg-[#252936] relative overflow-hidden">
        <div className="container px-4 mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="bg-[#1A1D29] border-2 border-[#00D9FF] shadow-[0_0_50px_rgba(0,217,255,0.3)] p-12">
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="w-20 h-20 bg-[#00D9FF] rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle2 className="w-10 h-10 text-[#1A1D29]" />
                </motion.div>

                <h3 className="text-4xl font-bold text-[#F5F5F7] mb-4">
                  You're in!
                </h3>

                <div className="mb-6">
                  <p className="text-[#A0A3B1] mb-2">Your waitlist number:</p>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-6xl font-bold text-[#FF6B6B] font-mono animate-flip"
                  >
                    #{waitlistNumber}
                  </motion.div>
                </div>

                <p className="text-[#A0A3B1] mb-8">
                  We'll email you at <span className="text-[#F5F5F7] font-semibold">{email}</span> when pulse launches.
                </p>

                <div className="space-y-4">
                  <Button
                    className="w-full bg-[#FF6B6B] hover:bg-[#ff5252] text-white py-6"
                    onClick={handleCloseModal}
                  >
                    Back to Home
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="waitlist" className="py-32 bg-[#252936] relative overflow-hidden">
      <div className="container px-4 mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#F5F5F7] mb-4">
            Join the waitlist
          </h2>
          <p className="text-xl text-[#A0A3B1] max-w-2xl mx-auto mb-6">
            Be among the first to experience the future of live streaming
          </p>

          {/* Live counter */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-[#1A1D29] border border-[#3A3D4A] rounded-full px-6 py-3"
          >
            <span className="w-2 h-2 bg-[#00D9FF] rounded-full animate-pulse"></span>
            <span className="text-[#A0A3B1] font-mono">
              <span className="text-[#F5F5F7] font-bold animate-flip">{liveCount}</span> already signed up
            </span>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="bg-[#1A1D29] border-2 border-[#3A3D4A] p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div>
                <Label htmlFor="email" className="text-[#F5F5F7] text-lg mb-2 block">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[#252936] border-[#3A3D4A] text-[#F5F5F7] placeholder:text-[#A0A3B1] h-14 text-lg focus:border-[#FF6B6B] focus:ring-[#FF6B6B]"
                  required
                />
              </div>

              {/* Tier Selection */}
              <div>
                <Label className="text-[#F5F5F7] text-lg mb-4 block">
                  Choose your tier
                </Label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setSelectedTier("free")}
                    className={`p-6 rounded-lg border-2 transition-all duration-200 text-left ${
                      selectedTier === "free"
                        ? "border-[#FF6B6B] bg-[#FF6B6B]/10"
                        : "border-[#3A3D4A] hover:border-[#FF6B6B]/50"
                    }`}
                  >
                    <div className="font-bold text-[#F5F5F7] text-xl mb-1">Free</div>
                    <div className="text-[#A0A3B1] text-sm">Basic features with watermark</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedTier("pro")}
                    className={`p-6 rounded-lg border-2 transition-all duration-200 text-left relative ${
                      selectedTier === "pro"
                        ? "border-[#FF6B6B] bg-[#FF6B6B]/10"
                        : "border-[#3A3D4A] hover:border-[#FF6B6B]/50"
                    }`}
                  >
                    <div className="absolute -top-3 right-3 bg-[#FF6B6B] text-white text-xs px-2 py-1 rounded-full">
                      Popular
                    </div>
                    <div className="font-bold text-[#F5F5F7] text-xl mb-1">Pro - $9.99/mo</div>
                    <div className="text-[#A0A3B1] text-sm">All features, no watermark</div>
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#FF6B6B] hover:bg-[#ff5252] text-white py-6 text-lg rounded-lg animate-pulse-glow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : selectedTier === "pro" ? (
                  "Reserve Pro & Pay Now"
                ) : (
                  "Join Free Waitlist"
                )}
              </Button>

              <p className="text-center text-sm text-[#A0A3B1]">
                {selectedTier === "pro" 
                  ? "You'll be redirected to Stripe to complete payment"
                  : "No credit card required. We'll email you when we launch."}
              </p>
            </form>
          </Card>
        </motion.div>
      </div>

      {/* Background decoration */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#00D9FF] rounded-full blur-[150px] opacity-10" />
    </section>
  );
}
