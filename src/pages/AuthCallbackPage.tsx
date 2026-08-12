import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import * as authService from "@/services/auth.service";

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      toast.error("Google sign-in didn't return a token.");
      navigate("/auth", { replace: true });
      return;
    }

    authService
      .completeGoogleSignIn(token)
      .then(() => navigate("/home", { replace: true }))
      .catch((error) => {
        toast.error(`Google sign-in failed: ${getErrorMessage(error)}`);
        navigate("/auth", { replace: true });
      });
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  );
};

export default AuthCallbackPage;
