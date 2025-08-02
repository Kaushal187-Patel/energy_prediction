import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { X, Edit, Save } from 'lucide-react';

interface ProfileModalProps {
  user: any;
  onClose: () => void;
  onUpdate: (user: any) => void;
}

export default function ProfileModal({ user, onClose, onUpdate }: ProfileModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(user.name.split(' ')[0] || '');
  const [lastName, setLastName] = useState(user.name.split(' ')[1] || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/update-profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ name: `${firstName} ${lastName}` })
      });

      const data = await response.json();

      if (response.ok) {
        const updatedUser = { ...user, name: `${firstName} ${lastName}` };
        onUpdate(updatedUser);
        toast.success('Profile updated successfully!');
        setIsEditing(false);
      } else {
        toast.error(data.error || 'Update failed');
      }
    } catch (error) {
      toast.error('Connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
            Profile Settings
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-1 rounded hover:bg-gray-100"
            >
              <Edit className="h-4 w-4" />
            </button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Email</label>
            <Input value={user.email} disabled className="mt-1" />
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-sm font-medium text-gray-600">First Name</label>
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={!isEditing}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Last Name</label>
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={!isEditing}
                className="mt-1"
              />
            </div>
          </div>

          {isEditing && (
            <Button onClick={handleSave} className="w-full" disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}