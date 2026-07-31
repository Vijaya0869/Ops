import { useEffect, useState, useRef } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, User, Mail, Building2, Calendar, Camera, Upload } from "lucide-react";

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  company_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile");
    } else if (data) {
      setProfile(data);
      setFullName(data.full_name || "");
      setCompanyName(data.company_name || "");
    }
    setLoading(false);
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setUploadingAvatar(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      const avatarUrl = `${urlData.publicUrl}?t=${Date.now()}`;

      // Update profile with avatar URL
      if (profile) {
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ avatar_url: avatarUrl, updated_at: new Date().toISOString() })
          .eq("user_id", user.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("profiles")
          .insert({
            user_id: user.id,
            avatar_url: avatarUrl,
          });

        if (insertError) throw insertError;
      }

      toast.success("Avatar updated successfully");
      fetchProfile();
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Failed to upload avatar");
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setSaving(true);
    
    const profileData = {
      user_id: user.id,
      full_name: fullName || null,
      company_name: companyName || null,
      updated_at: new Date().toISOString(),
    };

    if (profile) {
      // Update existing profile
      const { error } = await supabase
        .from("profiles")
        .update(profileData)
        .eq("user_id", user.id);

      if (error) {
        console.error("Error updating profile:", error);
        toast.error("Failed to update profile");
      } else {
        toast.success("Profile updated successfully");
        fetchProfile();
      }
    } else {
      // Insert new profile
      const { error } = await supabase
        .from("profiles")
        .insert(profileData);

      if (error) {
        console.error("Error creating profile:", error);
        toast.error("Failed to create profile");
      } else {
        toast.success("Profile created successfully");
        fetchProfile();
      }
    }
    
    setSaving(false);
  };

  const getInitials = () => {
    if (fullName) {
      return fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return user?.email?.charAt(0).toUpperCase() || "U";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="flex min-h-screen purple-gradient">
      <Navigation />
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Profile</h1>
            <p className="text-muted-foreground">
              Manage your account settings and profile information
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
            </div>
          ) : (
            <>
              {/* Profile Avatar Card */}
              <Card variant="glass">
                <CardHeader>
                  <CardTitle className="text-foreground">Profile Picture</CardTitle>
                  <CardDescription className="text-muted-foreground">Your avatar and display name</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center gap-6">
                  <div className="relative group">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={profile?.avatar_url || undefined} />
                      <AvatarFallback className="text-xl gold-gradient text-accent-foreground">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingAvatar}
                      className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      {uploadingAvatar ? (
                        <Loader2 className="h-6 w-6 animate-spin text-foreground" />
                      ) : (
                        <Camera className="h-6 w-6 text-foreground" />
                      )}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-medium text-foreground">
                      {fullName || "No name set"}
                    </p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                    <Button
                      variant="glass-outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingAvatar}
                    >
                      {uploadingAvatar ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Photo
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Account Information */}
              <Card variant="glass">
                <CardHeader>
                  <CardTitle className="text-foreground">Account Information</CardTitle>
                  <CardDescription className="text-muted-foreground">Your account details from authentication</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-panel border border-border">
                    <Mail className="h-5 w-5 text-accent" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Email</p>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-panel border border-border">
                    <Calendar className="h-5 w-5 text-accent" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Member since</p>
                      <p className="text-sm text-muted-foreground">
                        {user?.created_at ? formatDate(user.created_at) : "Unknown"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-panel border border-border">
                    <User className="h-5 w-5 text-accent" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Auth Provider</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {user?.app_metadata?.provider || "email"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Edit Profile */}
              <Card variant="glass">
                <CardHeader>
                  <CardTitle className="text-foreground">Edit Profile</CardTitle>
                  <CardDescription className="text-muted-foreground">Update your profile information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="flex items-center gap-2 text-foreground">
                      <User className="h-4 w-4 text-accent" />
                      Full Name
                    </Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      className="bg-panel border-border text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyName" className="flex items-center gap-2 text-foreground">
                      <Building2 className="h-4 w-4 text-accent" />
                      Company Name
                    </Label>
                    <Input
                      id="companyName"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Enter your company name"
                      className="bg-panel border-border text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                  <Button 
                    onClick={handleSaveProfile} 
                    disabled={saving}
                    variant="gold"
                    className="w-full"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  );
}