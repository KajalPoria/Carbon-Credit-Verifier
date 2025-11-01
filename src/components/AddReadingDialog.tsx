import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Activity } from "lucide-react";

interface Project {
  id: string;
  name: string;
}

interface AddReadingDialogProps {
  onReadingAdded: () => void;
}

const AddReadingDialog = ({ onReadingAdded }: AddReadingDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [formData, setFormData] = useState({
    project_id: "",
    energy_kwh: "",
    co2_offset_tons: "",
  });

  useEffect(() => {
    if (open) {
      loadProjects();
    }
  }, [open]);

  const loadProjects = async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("id, name")
      .eq("status", "active")
      .order("name");

    if (!error && data) {
      setProjects(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("energy_readings").insert({
      project_id: formData.project_id,
      energy_kwh: parseFloat(formData.energy_kwh),
      co2_offset_tons: parseFloat(formData.co2_offset_tons),
      verified: false,
    });

    if (error) {
      toast.error("Failed to add reading: " + error.message);
    } else {
      toast.success("Energy reading added successfully!");
      setFormData({ project_id: "", energy_kwh: "", co2_offset_tons: "" });
      setOpen(false);
      onReadingAdded();
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Activity className="w-4 h-4" />
          Add Reading
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Energy Reading</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project">Project</Label>
            <Select
              value={formData.project_id}
              onValueChange={(value) => setFormData({ ...formData, project_id: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="energy">Energy Generated (kWh)</Label>
            <Input
              id="energy"
              type="number"
              step="0.01"
              value={formData.energy_kwh}
              onChange={(e) => setFormData({ ...formData, energy_kwh: e.target.value })}
              placeholder="1247.5"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="co2">CO₂ Offset (tons)</Label>
            <Input
              id="co2"
              type="number"
              step="0.01"
              value={formData.co2_offset_tons}
              onChange={(e) => setFormData({ ...formData, co2_offset_tons: e.target.value })}
              placeholder="623.0"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading || projects.length === 0}>
            {loading ? "Adding..." : "Add Reading"}
          </Button>
          {projects.length === 0 && (
            <p className="text-sm text-muted-foreground text-center">
              No active projects. Please create a project first.
            </p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddReadingDialog;
