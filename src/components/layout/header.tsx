import { Link } from '@tanstack/react-router';
import { ThemeToggle } from '../theme/theme-toggle';
import { SubmitRoomModal } from '../SubmitRoomModal';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '../ui/navigation-menu';

export function Header() {
  return (
    <header className="w-full border-b bg-background">
      <div className="container flex h-16 items-center px-4">
        {/* Left: Navigation Links */}
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link to="/">Home</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link to="/melbourne">Melbourne</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link to="/melbourne/map">Map</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right: Actions (Pushed to the end) */}
        <div className="ml-auto flex items-center gap-2">
          <SubmitRoomModal />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}