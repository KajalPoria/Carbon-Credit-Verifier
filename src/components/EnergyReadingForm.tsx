import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Zap } from "lucide-react";

interface EnergyReadingFormProps {
  onSuccess: () => void;
}

interface Project {
  id: string;
  name: string;
}

const EnergyReadingForm = ({ onSuccess }: EnergyReadingFormProps) => {
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
      fetchProjects();
    }
  }, [open]);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("id, name")
      .eq("status", "active");

    if (error) {
      toast.error("Failed to load projects");
    } else {
      setProjects(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("energy_readings").insert({
        project_id: formData.project_id,
        energy_kwh: parseFloat(formData.energy_kwh),
        co2_offset_tons: parseFloat(formData.co2_offset_tons),
      });

      if (error) throw error;

      toast.success("Energy reading recorded successfully!");
      setFormData({ project_id: "", energy_kwh: "", co2_offset_tons: "" });
      setOpen(false);
      onSuccess();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Zap className="w-4 h-4" />
          Add Reading
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record Energy Reading</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project">Project</Label>
            <Select value={formData.project_id} onValueChange={(value) => setFormData({ ...formData, project_id: value })}>
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
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading || !formData.project_id}>
            {loading ? "Recording..." : "Record Reading"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EnergyReadingForm;
