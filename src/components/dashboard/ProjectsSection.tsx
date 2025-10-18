import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Upload, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ProjectsSection = ({ projects, userId, onUpdate }: any) => {
  const [open, setOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    project_url: "",
    github_url: "",
    tags: "",
  });
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
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
      .from("project-images")
      .upload(fileName, file);

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
      .from("project-images")
      .getPublicUrl(fileName);

    setImageUrl(publicUrl);
    setUploading(false);
  };

  const handleGenerateDescription = async () => {
    if (!formData.title) {
      toast({
        variant: "destructive",
        title: "Missing Title",
        description: "Please enter a project title first",
      });
      return;
    }

    setGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke("generate-project-description", {
        body: {
          title: formData.title,
          tags: formData.tags,
        },
      });

      if (error) throw error;

      setFormData({
        ...formData,
        description: data.description,
      });

      toast({
        title: "Description Generated",
        description: "AI has created a description for your project!",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: error.message || "Failed to generate description",
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title) {
      toast({
        variant: "destructive",
        title: "Missing Title",
        description: "Please enter a project title",
      });
      return;
    }

    const projectData = {
      ...formData,
      user_id: userId,
      image_url: imageUrl,
      tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
    };

    if (editingProject) {
      const { error } = await supabase
        .from("projects")
        .update(projectData)
        .eq("id", editingProject.id);

      if (error) {
        toast({
          variant: "destructive",
          title: "Update Failed",
          description: error.message,
        });
        return;
      }
    } else {
      const { error } = await supabase.from("projects").insert(projectData);

      if (error) {
        toast({
          variant: "destructive",
          title: "Create Failed",
          description: error.message,
        });
        return;
      }
    }

    const { data } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", userId)
      .order("display_order");

    if (data) {
      onUpdate(data);
    }

    toast({
      title: "Success",
      description: editingProject ? "Project updated" : "Project created",
    });

    resetForm();
    setOpen(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("projects").delete().eq("id", id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Delete Failed",
        description: error.message,
      });
      return;
    }

    onUpdate(projects.filter((p: any) => p.id !== id));
    toast({
      title: "Deleted",
      description: "Project removed",
    });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      project_url: "",
      github_url: "",
      tags: "",
    });
    setImageUrl("");
    setEditingProject(null);
  };

  const openEdit = (project: any) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description || "",
      project_url: project.project_url || "",
      github_url: project.github_url || "",
      tags: project.tags?.join(", ") || "",
    });
    setImageUrl(project.image_url || "");
    setOpen(true);
  };

  return (
    <Card className="p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Projects</h2>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProject ? "Edit Project" : "Add New Project"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Project Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="My Awesome Project"
                />
              </div>

              <div>
                <Label>Project Image</Label>
                <div className="flex items-center gap-4 mt-2">
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt="Project"
                      className="w-20 h-20 rounded object-cover"
                    />
                  )}
                  <Button variant="outline" disabled={uploading} asChild>
                    <label className="cursor-pointer">
                      <Upload className="w-4 h-4 mr-2" />
                      {uploading ? "Uploading..." : "Upload Image"}
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
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="React, TypeScript, Tailwind"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your project..."
                  rows={4}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={handleGenerateDescription}
                  disabled={generating}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {generating ? "Generating..." : "Generate with AI"}
                </Button>
              </div>

              <div>
                <Label htmlFor="project_url">Live URL</Label>
                <Input
                  id="project_url"
                  name="project_url"
                  value={formData.project_url}
                  onChange={handleChange}
                  placeholder="https://myproject.com"
                />
              </div>

              <div>
                <Label htmlFor="github_url">GitHub URL</Label>
                <Input
                  id="github_url"
                  name="github_url"
                  value={formData.github_url}
                  onChange={handleChange}
                  placeholder="https://github.com/username/repo"
                />
              </div>

              <Button onClick={handleSave} className="w-full">
                {editingProject ? "Update Project" : "Create Project"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {projects.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No projects yet. Add your first project!
          </p>
        ) : (
          projects.map((project: any) => (
            <div
              key={project.id}
              className="border rounded-lg p-4 hover:border-primary transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2">{project.title}</h3>
                  {project.description && (
                    <p className="text-sm text-muted-foreground mb-2">
                      {project.description.substring(0, 100)}...
                    </p>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEdit(project)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(project.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default ProjectsSection;
