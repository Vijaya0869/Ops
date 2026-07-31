import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import * as authService from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Building2, Loader2 } from "lucide-react";
import { z } from "zod";

const emailSchema = z.string().email("Please enter a valid email address");
const passwordSchema = z.string().min(6, "Password must be at least 6 characters");

// Social provider icons as SVG components
const GoogleIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);


function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  // Return the user to the page they were trying to reach, or the dashboard.
  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname || "/home";

  useEffect(() => {
    const subscription = authService.onAuthStateChange((session) => {
      if (session?.user) {
        navigate(from, { replace: true });
      }
    });

    authService.getSession().then((session) => {
      if (session?.user) {
        navigate(from, { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, from]);

  const validateForm = (isSignUp: boolean): boolean => {
    try {
      emailSchema.parse(email);
      passwordSchema.parse(password);
      if (isSignUp && !fullName.trim()) {
        toast.error("Please enter your full name");
        return false;
      }
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      }
      return false;
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm(false)) return;

    setIsLoading(true);
    try {
      await authService.signInWithPassword(email, password);
      toast.success("Welcome back!");
    } catch (error) {
      const message = getErrorMessage(error);
      if (message.includes("Invalid login credentials")) {
        toast.error("Invalid email or password. Please try again.");
      } else {
        toast.error(message);
      }
    }
    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm(true)) return;

    setIsLoading(true);
    const redirectUrl = `${window.location.origin}/home`;

    try {
      await authService.signUp(email, password, fullName, redirectUrl);
      toast.success("Account created successfully!");
    } catch (error) {
      const message = getErrorMessage(error);
      if (message.includes("already registered")) {
        toast.error("This email is already registered. Please sign in instead.");
      } else {
        toast.error(message);
      }
    }
    setIsLoading(false);
  };

  const handleGoogleLogin = async () => {
    setSocialLoading('google');
    const redirectUrl = `${window.location.origin}/home`;

    try {
      await authService.signInWithGoogle(redirectUrl);
    } catch (error) {
      toast.error(`Failed to sign in with Google: ${getErrorMessage(error)}`);
      setSocialLoading(null);
    }
  };

  const SocialButtons = () => (
    <div className="space-y-3">
      <Button
        type="button"
        variant="outline"
        className="w-full bg-panel border-border text-foreground hover:bg-panel-raised hover:text-foreground backdrop-blur-sm"
        onClick={handleGoogleLogin}
        disabled={socialLoading !== null}
      >
        {socialLoading === 'google' ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <GoogleIcon />
        )}
        <span className="ml-2">Continue with Google</span>
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0B1120 0%, #131C2E 30%, #1E293B 60%, #131C2E 100%)' }}>
      {/* Decorative glass orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full" style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.25) 0%, transparent 70%)' }} />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full" style={{ background: 'radial-gradient(circle, rgba(15,23,42,0.55) 0%, transparent 70%)' }} />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full" style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 60%)' }} />
      </div>
      
      <Card variant="glass" className="w-full max-w-md rounded-2xl relative z-10">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-accent">
              <Building2 className="h-8 w-8 text-accent-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">REI Dashboard</CardTitle>
          <CardDescription className="text-muted-foreground">
            Real Estate Investment Management Platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-panel backdrop-blur-sm border border-border">
              <TabsTrigger value="signin" className="text-muted-foreground data-[state=active]:bg-panel-raised data-[state=active]:text-foreground data-[state=active]:shadow-sm">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="text-muted-foreground data-[state=active]:bg-panel-raised data-[state=active]:text-foreground data-[state=active]:shadow-sm">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <div className="space-y-4 mt-4">
                <SocialButtons />
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full bg-panel-raised" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="glass px-3 py-1 rounded text-muted-foreground text-[10px]">Or continue with email</span>
                  </div>
                </div>

                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email" className="text-foreground">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-panel border-border text-foreground placeholder:text-muted-foreground focus:border-accent focus:ring-accent/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password" className="text-foreground">Password</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-panel border-border text-foreground placeholder:text-muted-foreground focus:border-accent focus:ring-accent/20"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-accent text-accent-foreground font-semibold hover:bg-accent/90" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>
              </div>
            </TabsContent>

            <TabsContent value="signup">
              <div className="space-y-4 mt-4">
                <SocialButtons />
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full bg-panel-raised" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="glass px-3 py-1 rounded text-muted-foreground text-[10px]">Or continue with email</span>
                  </div>
                </div>

                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="text-foreground">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="bg-panel border-border text-foreground placeholder:text-muted-foreground focus:border-accent focus:ring-accent/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-foreground">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-panel border-border text-foreground placeholder:text-muted-foreground focus:border-accent focus:ring-accent/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-foreground">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-panel border-border text-foreground placeholder:text-muted-foreground focus:border-accent focus:ring-accent/20"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-accent text-accent-foreground font-semibold hover:bg-accent/90" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;