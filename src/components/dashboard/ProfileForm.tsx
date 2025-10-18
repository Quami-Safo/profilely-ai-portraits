import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Upload } from "lucide-react";
import { z } from "zod";

const profileSchema = z.object({
  username: z.string().min(3).max(50).regex(/^[a-z0-9_-]+$/i, "Username can only contain letters, numbers, hyphens, and underscores"),
  full_name: z.string().min(2).max(100),
  profession: z.string().max(100).optional(),
  bio: z.string().max(2000).optional(),
  tagline: z.string().max(200).optional(),
  skills: z.string().optional(),
});

const ProfileForm = ({ profile, userId, onUpdate }: any) => {
  const [formData, setFormData] = useState({
    username: profile?.username || "",
    full_name: profile?.full_name || "",
    profession: profile?.profession || "",
    bio: profile?.bio || "",
    tagline: profile?.tagline || "",
    skills: profile?.skills?.join(", ") || "",
  });
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}/${Math.random()}.${fileExt}`;

    setUploading(true);

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: uploadError.message,
      });
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("avatars")
      .getPublicUrl(fileName);

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ profile_photo_url: publicUrl })
      .eq("id", userId);

    if (updateError) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: updateError.message,
      });
    } else {
      onUpdate({ ...profile, profile_photo_url: publicUrl });
      toast({
        title: "Success",
        description: "Profile photo updated",
      });
    }

    setUploading(false);
  };

  const handleGenerateAI = async () => {
    setGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke("generate-portfolio-content", {
        body: {
          profession: formData.profession,
          skills: formData.skills,
          currentBio: formData.bio,
        },
      });

      if (error) throw error;

      setFormData({
        ...formData,
        bio: data.bio,
        tagline: data.tagline,
      });

      toast({
        title: "AI Generated Content",
        description: "Your bio and tagline have been generated!",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: error.message || "Failed to generate content",
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    try {
      const validated = profileSchema.parse(formData);

      const { error } = await supabase
        .from("profiles")
        .update({
          ...validated,
          skills: validated.skills?.split(",").map((s) => s.trim()).filter(Boolean),
        })
        .eq("id", userId);

      if (error) throw error;

      onUpdate({
        ...profile,
        ...validated,
        skills: validated.skills?.split(",").map((s) => s.trim()).filter(Boolean),
      });

      toast({
        title: "Saved!",
        description: "Your profile has been updated",
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: error.errors[0].message,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Save Failed",
          description: error.message,
        });
      }
    }
  };

  return (
    <Card className="p-6 animate-fade-in">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Sparkles className="w-6 h-6 text-primary" />
        Profile Information
      </h2>

      <div className="space-y-4">
        <div>
          <Label>Profile Photo</Label>
          <div className="flex items-center gap-4 mt-2">
            {profile?.profile_photo_url && (
              <img
                src={profile.profile_photo_url}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover"
              />
            )}
            <Button variant="outline" disabled={uploading} asChild>
              <label className="cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                {uploading ? "Uploading..." : "Upload Photo"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </Button>
          </div>
        </div>

        <div>
          <Label htmlFor="username">Username *</Label>
          <Input
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="johndoe"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Your portfolio will be at /u/{formData.username || "username"}
          </p>
        </div>

        <div>
          <Label htmlFor="full_name">Full Name *</Label>
          <Input
            id="full_name"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            placeholder="John Doe"
          />
        </div>

        <div>
          <Label htmlFor="profession">Profession</Label>
          <Input
            id="profession"
            name="profession"
            value={formData.profession}
            onChange={handleChange}
            placeholder="Full Stack Developer"
          />
        </div>

        <div>
          <Label htmlFor="skills">Skills (comma separated)</Label>
          <Input
            id="skills"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="React, Node.js, TypeScript"
          />
        </div>

        <div>
          <Label htmlFor="tagline">Tagline</Label>
          <Input
            id="tagline"
            name="tagline"
            value={formData.tagline}
            onChange={handleChange}
            placeholder="Building the future, one line at a time"
          />
        </div>

        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell us about yourself..."
            rows={5}
          />
        </div>

        <div className="flex gap-3">
          <Button onClick={handleGenerateAI} variant="outline" disabled={generating}>
            <Sparkles className="w-4 h-4 mr-2" />
            {generating ? "Generating..." : "Generate with AI"}
          </Button>
          <Button onClick={handleSave}>
            Save Profile
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProfileForm;
