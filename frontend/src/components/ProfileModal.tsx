import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Edit, Mail, Save, User, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ProfileModalProps {
  user: any;
  onClose: () => void;
  onUpdate: (user: any) => void;
}

export default function ProfileModal({
  user,
  onClose,
  onUpdate,
}: ProfileModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(user.name.split(" ")[0] || "");
  const [lastName, setLastName] = useState(user.name.split(" ")[1] || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ name: `${firstName} ${lastName}` }),
      });

      const data = await response.json();

      if (response.ok) {
        const updatedUser = { ...user, name: `${firstName} ${lastName}` };
        onUpdate(updatedUser);
        toast.success("Profile updated successfully!");
        setIsEditing(false);
      } else {
        toast.error(data.error || "Update failed");
      }
    } catch (error) {
      toast.error("Connection error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md glass-morphism border-white/20 shadow-2xl">
        <CardHeader className="relative pb-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="h-4 w-4 text-gray-400" />
          </button>
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="p-3 bg-blue-500/20 rounded-full">
              <User className="h-6 w-6 text-blue-400" />
            </div>
            <CardTitle className="text-xl text-white">
              Edit Profile Information
            </CardTitle>
          </div>
          <p className="text-center text-gray-400 text-sm">
            Update your personal information
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Email Field */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
              <Mail className="h-4 w-4" />
              Email Address
            </label>
            <Input
              value={user.email}
              disabled
              className="bg-white/5 border-white/20 text-gray-300 placeholder:text-gray-500"
            />
            <p className="text-xs text-gray-500">Email cannot be changed</p>
          </div>

          {/* Name Fields */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                <User className="h-4 w-4" />
                Full Name
              </label>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-1 px-3 py-1 text-xs bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg transition-colors"
              >
                <Edit className="h-3 w-3" />
                {isEditing ? "Cancel" : "Edit"}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-400">
                  First Name
                </label>
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={!isEditing}
                  className="bg-white/5 border-white/20 text-white placeholder:text-gray-500 disabled:opacity-50"
                  placeholder="Enter first name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-400">
                  Last Name
                </label>
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={!isEditing}
                  className="bg-white/5 border-white/20 text-white placeholder:text-gray-500 disabled:opacity-50"
                  placeholder="Enter last name"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          {isEditing && (
            <div className="pt-4 border-t border-white/10">
              <Button
                onClick={handleSave}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                disabled={loading || !firstName.trim()}
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? "Saving Changes..." : "Save Changes"}
              </Button>
              {!firstName.trim() && (
                <p className="text-xs text-red-400 mt-2 text-center">
                  First name is required
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
