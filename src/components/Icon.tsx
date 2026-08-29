import {
  Award,
  BadgeCheck,
  Briefcase,
  Building2,
  CalendarRange,
  CheckCircle2,
  ClipboardCheck,
  Home,
  KeyRound,
  Leaf,
  MapPin,
  MessageSquare,
  Phone,
  Mail,
  ShieldCheck,
  Snowflake,
  Sparkles,
  Sprout,
  Sun,
  Users,
  type LucideIcon,
} from 'lucide-react';

export const iconMap = {
  Award,
  BadgeCheck,
  Briefcase,
  Building2,
  CalendarRange,
  CheckCircle2,
  ClipboardCheck,
  Home,
  KeyRound,
  Leaf,
  MapPin,
  MessageSquare,
  Phone,
  Mail,
  ShieldCheck,
  Snowflake,
  Sparkles,
  Sprout,
  Sun,
  Users,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof iconMap;

type IconProps = {
  name: IconName;
  className?: string;
  strokeWidth?: number;
};

export default function Icon({ name, className, strokeWidth = 1.6 }: IconProps) {
  const Component = iconMap[name];
  return <Component className={className} strokeWidth={strokeWidth} aria-hidden="true" />;
}
