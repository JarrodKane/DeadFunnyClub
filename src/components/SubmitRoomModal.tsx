import { useState } from 'react';
import { PlusCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';

export function SubmitRoomModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    eventName: '',
    location: '',
    eventLink: '',
    additionalInfo: ''
  });

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setTimeout(() => {
        setSuccess(false);
        setFormData({
          eventName: '',
          location: '',
          eventLink: '',
          additionalInfo: ''
        });
      }, 300);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const PAYLOAD_URL = import.meta.env.VITE_PAYLOAD_URL || 'https://admin.unchartedcomedy.com';

    try {
      const response = await fetch(`${PAYLOAD_URL}/api/room-submissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventName: formData.eventName,
          location: formData.location,
          eventLink: formData.eventLink,
          additionalInfo: formData.additionalInfo,
          status: 'new'
        }),
      });

      if (response.ok) {
        setSuccess(true);
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error(error);
      alert('Error connecting to server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange} >
      <DialogTrigger asChild >
        <Button variant="default" size="sm" className="gap-2 cursor-pointer"  >
          <PlusCircle className="h-4 w-4" />
          <span className="hidden sm:inline" > Add Room </span>
        </Button>
      </DialogTrigger>
      <DialogContent >
        <DialogHeader>
          <DialogTitle>Submit a Comedy Room </DialogTitle>
          <DialogDescription>
            Know a spot we missed?
          </DialogDescription>
        </DialogHeader>
        {
          success ? (
            <div className="py-8 flex flex-col items-center gap-4 text-center animate-in fade-in-50" >
              <div className="rounded-full bg-green-100 p-3 text-green-600 dark:bg-green-900/30" >
                <PlusCircle className="h-8 w-8" />
              </div>
              < div className="space-y-2" >
                <h3 className="font-semibold text-lg" > Submission Received! </h3>
                < p className="text-muted-foreground text-sm mx-auto" >
                  Thanks for helping the scene grow.We'll review it and add it to the map shortly.
                </p>
              </div>
              < Button variant="secondary" className="mt-2" onClick={() => setIsOpen(false)
              }>
                Close
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2" >
              <div className="grid gap-2" >
                <Label htmlFor="eventName" > Event Name * </Label>
                < Input
                  id="eventName"
                  required
                  placeholder="e.g. Comedy at the Basement"
                  value={formData.eventName}
                  onChange={(e) => setFormData({ ...formData, eventName: e.target.value })
                  }
                />
              </div>

              < div className="grid gap-2" >
                <Label htmlFor="location" > City & Country * </Label>
                < Input
                  id="location"
                  required
                  placeholder="e.g. Melbourne, Australia"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>

              < div className="grid gap-2" >
                <Label htmlFor="eventLink" > Link(Social or Tickets) </Label>
                < Input
                  id="eventLink"
                  type="url"
                  placeholder="https://instagram.com/..."
                  value={formData.eventLink}
                  onChange={(e) => setFormData({ ...formData, eventLink: e.target.value })}
                />
              </div>

              < div className="grid gap-2" >
                <Label htmlFor="additionalInfo" > Additional Details</Label>
                < Textarea
                  id="additionalInfo"
                  placeholder="What day is it on? What time? Is it free?"
                  className="min-h-[100px]"
                  value={formData.additionalInfo}
                  onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                />
              </div>

              < DialogFooter className="mt-4" >
                <DialogClose asChild >
                  <Button type="button" variant="ghost" > Cancel </Button>
                </DialogClose>
                < Button type="submit" disabled={loading} >
                  {
                    loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Room'
                    )}
                </Button>
              </DialogFooter>
            </form>
          )}
      </DialogContent>
    </Dialog>
  );
}