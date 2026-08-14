import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import * as profilesService from "@/services/profiles.service";
import type { Profile } from "@/services/profiles.service";
import * as authService from "@/services/auth.service";
import { ApiError } from "@/services/api-client";
import { toast } from "sonner";
import { Loader2, User, Mail, Building2, Calendar, Camera, Upload, Lock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const data = await profilesService.fetchProfile();
      if (data) {
        setProfile(data);
        setFullName(data.fullName || "");
        setCompanyName(data.companyName || "");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile");
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
      await profilesService.uploadAvatar(file);

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

    try {
      await profilesService.upsertProfile({
        full_name: fullName || null,
        company_name: companyName || null,
      });
      toast.success(profile ? "Profile updated successfully" : "Profile created successfully");
      fetchProfile();
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error(profile ? "Failed to update profile" : "Failed to create profile");
    }

    setSaving(false);
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    setChangingPassword(true);
    try {
      await authService.changePassword(currentPassword, newPassword);
      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      const message =
        error instanceof ApiError && error.status === 401
          ? "Current password is incorrect"
          : error instanceof Error
            ? error.message
            : "Failed to change password";
      toast.error(message);
    }
    setChangingPassword(false);
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
    <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Profile</h1>
            <p className="text-muted-foreground">
              Manage your account settings and profile information
            </p>
          </div>

          {loading ? (
            <div className="space-y-6">
              <Card variant="glass">
                <CardHeader>
                  <Skeleton className="h-5 w-36" />
                  <Skeleton className="h-3 w-48" />
                </CardHeader>
                <CardContent className="flex items-center gap-4">
                  <Skeleton className="h-20 w-20 rounded-full" />
                  <Skeleton className="h-9 w-32" />
                </CardContent>
              </Card>
              <Card variant="glass">
                <CardHeader>
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-3 w-56" />
                </CardHeader>
                <CardContent className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-9 w-full" />
                    </div>
                  ))}
                </CardContent>
              </Card>
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
                      <AvatarImage src={profile?.avatarUrl || undefined} />
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
                        {user?.createdAt ? formatDate(user.createdAt) : "Unknown"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-panel border border-border">
                    <User className="h-5 w-5 text-accent" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Auth Provider</p>
                      <p className="text-sm text-muted-foreground">Email</p>
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

              {/* Change Password */}
              {user?.hasPassword && (
                <Card variant="glass">
                  <CardHeader>
                    <CardTitle className="text-foreground">Change Password</CardTitle>
                    <CardDescription className="text-muted-foreground">Update your account password</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword" className="flex items-center gap-2 text-foreground">
                        <Lock className="h-4 w-4 text-accent" />
                        Current Password
                      </Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="bg-panel border-border text-foreground"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword" className="flex items-center gap-2 text-foreground">
                        <Lock className="h-4 w-4 text-accent" />
                        New Password
                      </Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="bg-panel border-border text-foreground"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="flex items-center gap-2 text-foreground">
                        <Lock className="h-4 w-4 text-accent" />
                        Confirm New Password
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="bg-panel border-border text-foreground"
                      />
                    </div>
                    <Button
                      onClick={handleChangePassword}
                      disabled={changingPassword || !currentPassword || !newPassword}
                      variant="gold"
                      className="w-full"
                    >
                      {changingPassword ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Changing...
                        </>
                      ) : (
                        "Change Password"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </main>
  );
}