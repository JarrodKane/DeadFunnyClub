import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Filter } from "lucide-react"

export function FilterModal({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Desktop: Show filters inline */}
      <div className="hidden md:flex md:flex-wrap md:gap-4">
        {children}
      </div>

      {/* Mobile: Show filters in modal */}
      <div className="md:hidden">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[90vw] sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Filter Options</DialogTitle>
              <DialogDescription>
                Select your filter preferences
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              {children}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}