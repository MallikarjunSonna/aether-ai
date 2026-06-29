import { LogOut, Settings, User } from "lucide-react";
import { useState, useRef, useEffect } from "react";

import { useAuth } from "../../hooks/useAuth";

export function UserMenu() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Escape") {
      setOpen(false);
      buttonRef.current?.focus();
    }
  }

  const initials = user?.id ? user.id.slice(0, 2).toUpperCase() : "U";

  const items = [
    { label: "Profile", icon: User, href: "/dashboard/profile" },
    { label: "Settings", icon: Settings, href: "/dashboard/settings" },
    { label: "Logout", icon: LogOut, href: "/logout" },
  ];

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setOpen(!open)}
        onKeyDown={handleKeyDown}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="User menu"
        className="flex h-8 w-8 items-center justify-center rounded-md border border-line bg-surface text-xs font-semibold text-ink transition-colors duration-fast hover:border-neutral-500"
      >
        {initials}
      </button>

      {open && (
        <div
          ref={menuRef}
          role="menu"
          aria-label="User options"
          onKeyDown={handleKeyDown}
          className="absolute right-0 top-10 z-dropdown w-48 overflow-hidden rounded-lg border border-line bg-surface shadow-lg"
        >
          {items.map((item) => (
            <a
              key={item.label}
              href={item.href}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-muted transition-colors duration-fast hover:bg-neutral-800 hover:text-ink focus-visible:outline-none focus-visible:bg-neutral-800"
            >
              <item.icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
