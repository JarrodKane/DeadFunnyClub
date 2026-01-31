import { useState } from 'react';
import { Flag } from 'lucide-react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from './ui/dialog';

interface ReportIssueModalProps {
  roomName: string;
  roomId: string;
}

export function ReportIssueModal({ roomName, roomId }: ReportIssueModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form State
  const [type, setType] = useState('incorrect_info');
  const [details, setDetails] = useState('');

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setSuccess(false);
      setDetails('');
      setType('incorrect_info');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('https://admin.unchartedcomedy.com/api/suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          room: roomId,
          roomName: roomName,
          type: type,
          details: details,
          status: 'new'
        }),
      });

      if (response.ok) {
        setSuccess(true);
        // No timeout here anymore. The user can read the success message
        // and close the modal manually when they are ready.
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
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon-sm" className="h-6 w-6 text-muted-foreground hover:text-destructive cursor-pointer" title="Report Issue">
          <Flag className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report Issue</DialogTitle>
          <DialogDescription>
            Flagging changes for: <span className="font-semibold text-foreground">{roomName}</span>
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-6 flex flex-col items-center gap-4 text-center">
            <span className="text-green-600 font-medium">✅ Thanks! We'll look into it.</span>
            {/* Optional: Add a Close button for better UX */}
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="type" className="text-sm font-medium">Issue Type</label>
              <select
                id="type"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="incorrect_info">Incorrect Info</option>
                <option value="closed">Room Closed / Cancelled</option>
                <option value="duplicate">Duplicate Listing</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="details" className="text-sm font-medium">Details</label>
              <textarea
                id="details"
                required
                placeholder="e.g. This room actually starts at 8pm now..."
                className="flex min-h-20 w-full rounded-md border border-input px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
              />
            </div>

            <DialogFooter className="mt-2">
              <DialogClose asChild>
                <Button type="button" variant="ghost">Cancel</Button>
              </DialogClose>
              <Button type="submit" variant='default' disabled={loading}>
                {loading ? 'Sending...' : 'Submit Report'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}