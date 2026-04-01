type IconProps = {
  className?: string;
};

function Svg({
  className,
  children,
  viewBox = "0 0 24 24",
}: IconProps & {
  children: React.ReactNode;
  viewBox?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox={viewBox}
      className={className}
    >
      {children}
    </svg>
  );
}

export function MenuIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h10" />
    </Svg>
  );
}

export function SearchIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </Svg>
  );
}

export function ClipboardIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <rect x="6" y="5" width="12" height="15" rx="2" />
      <path d="M9 5.5A2.5 2.5 0 0 1 11.5 3h1A2.5 2.5 0 0 1 15 5.5V6H9v-.5Z" />
      <path d="M9 11h6" />
      <path d="M9 15h4" />
    </Svg>
  );
}

export function CompareIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M8 4v12" />
      <path d="M16 8v12" />
      <path d="m5 7 3-3 3 3" />
      <path d="m13 17 3 3 3-3" />
    </Svg>
  );
}

export function CartIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <circle cx="9" cy="19" r="1.5" />
      <circle cx="17" cy="19" r="1.5" />
      <path d="M3 5h2l2.2 9.5a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 8H6.2" />
    </Svg>
  );
}

export function HeartIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="m12 20-1.4-1.2C5.4 14.2 2 11.2 2 7.6 2 4.8 4.2 3 6.8 3c1.5 0 3 .7 4 1.8A5.4 5.4 0 0 1 15 3C17.8 3 20 4.8 20 7.6c0 3.6-3.4 6.6-8.6 11.2L12 20Z" />
    </Svg>
  );
}

export function UserIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </Svg>
  );
}

export function ArrowLeftIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M19 12H5" />
      <path d="m11 18-6-6 6-6" />
    </Svg>
  );
}

export function ArrowRightIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </Svg>
  );
}

export function CloseIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="m6 6 12 12" />
      <path d="M18 6 6 18" />
    </Svg>
  );
}

export function ChevronDownIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="m6 9 6 6 6-6" />
    </Svg>
  );
}

export function AppleIcon({ className }: IconProps) {
  return (
    <Svg className={className} viewBox="0 0 24 24">
      <path d="M15.4 4.2c-.8.9-2 1.5-3.1 1.4-.2-1.1.3-2.3 1-3 .8-.8 2-1.4 3-1.4.1 1-.2 2.1-.9 3Z" />
      <path d="M19.4 16.7c-.7 1-1 1.4-1.9 2.3-1.1 1.1-2 2-3.2 2-1 0-1.7-.3-2.8-.3s-1.8.3-2.8.3c-1.2 0-2.1-1-3.2-2-3-3.2-3.3-7-1.5-9.7 1.3-1.9 3.4-3 5.4-3 1.1 0 2.1.3 3 .6.9.3 1.4.5 2.2.5.7 0 1.1-.2 2-.5 1-.3 1.9-.7 3.1-.6 1 .1 2.4.4 3.6 1.8-2.8 1.5-2.3 5.5.1 6.6Z" />
    </Svg>
  );
}

export function PhoneIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M6.7 3.5h2.6l1.2 4.5-1.7 1.7a16.1 16.1 0 0 0 5.5 5.5l1.7-1.7 4.5 1.2v2.6A1.7 1.7 0 0 1 18.8 20C10.8 20 4 13.2 4 5.2a1.7 1.7 0 0 1 1.7-1.7Z" />
    </Svg>
  );
}

export function LocationIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M12 21s6-5.4 6-11a6 6 0 1 0-12 0c0 5.6 6 11 6 11Z" />
      <circle cx="12" cy="10" r="2.3" />
    </Svg>
  );
}

export function ClockIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 7.8v4.8l3 1.8" />
    </Svg>
  );
}

export function LockShieldIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M12 3 6.5 5.4v5.7c0 4 2.3 6.8 5.5 8.4 3.2-1.6 5.5-4.4 5.5-8.4V5.4L12 3Z" />
      <rect x="9.3" y="10.3" width="5.4" height="4.7" rx="1.1" />
      <path d="M10.2 10.3V9a1.8 1.8 0 0 1 3.6 0v1.3" />
    </Svg>
  );
}

export function HomeIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M3.5 10.5 12 4l8.5 6.5" />
      <path d="M6.5 9.5V20h11V9.5" />
    </Svg>
  );
}

export function GridIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <rect x="4" y="4" width="6.5" height="6.5" rx="1.2" />
      <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.2" />
      <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.2" />
      <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.2" />
    </Svg>
  );
}

export function BoltIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M13.5 2 6 13h4l-1.5 9L16 11h-4.5L13.5 2Z" />
    </Svg>
  );
}

export function PackageIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="m12 3 7 3.8v10.4L12 21l-7-3.8V6.8L12 3Z" />
      <path d="m5 6.8 7 4 7-4" />
      <path d="M12 10.8V21" />
    </Svg>
  );
}

export function NewspaperIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M6 5.5h11A1.5 1.5 0 0 1 18.5 7v10.5a2 2 0 0 1-2 2H7.5a2 2 0 0 1-2-2V7A1.5 1.5 0 0 1 7 5.5Z" />
      <path d="M8.5 9.5h7" />
      <path d="M8.5 13h7" />
      <path d="M8.5 16.5h4.5" />
    </Svg>
  );
}

export function MegaphoneIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M4.5 13.5V10a2 2 0 0 1 2-2h1.8L16.5 5v13l-8.2-3H6.5a2 2 0 0 1-2-1.5Z" />
      <path d="m8.5 15 1 4" />
      <path d="M18.5 9.5a3.5 3.5 0 0 1 0 7" />
    </Svg>
  );
}

export function TrendUpIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M4 17 10 11l4 4 6-8" />
      <path d="M14 7h6v6" />
    </Svg>
  );
}

export function DatabaseIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <ellipse cx="12" cy="6.5" rx="6.5" ry="3.5" />
      <path d="M5.5 6.5v5c0 1.9 2.9 3.5 6.5 3.5s6.5-1.6 6.5-3.5v-5" />
      <path d="M5.5 11.5v5c0 1.9 2.9 3.5 6.5 3.5s6.5-1.6 6.5-3.5v-5" />
    </Svg>
  );
}

export function EditIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M4 20h4l10-10-4-4L4 16v4Z" />
      <path d="m12.5 6.5 4 4" />
    </Svg>
  );
}

export function TrashIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M4.5 7.5h15" />
      <path d="M9.5 3.5h5l1 2H8.5l1-2Z" />
      <path d="M7 7.5 8 19a1.8 1.8 0 0 0 1.8 1.6h4.4A1.8 1.8 0 0 0 16 19l1-11.5" />
      <path d="M10 11.5v5" />
      <path d="M14 11.5v5" />
    </Svg>
  );
}

export function SparklesIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="m12 3 1.4 3.6L17 8l-3.6 1.4L12 13l-1.4-3.6L7 8l3.6-1.4L12 3Z" />
      <path d="m18.5 14 0.8 2 2 0.8-2 0.8-0.8 2-0.8-2-2-0.8 2-0.8 0.8-2Z" />
      <path d="m5.5 14 0.9 2.2L8.5 17l-2.1 0.8L5.5 20l-0.9-2.2L2.5 17l2.1-0.8 0.9-2.2Z" />
    </Svg>
  );
}
