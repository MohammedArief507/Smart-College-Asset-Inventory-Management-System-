// src/constants/navigation.js
import {
  LayoutDashboard,
  Users,
  Building2,
  FlaskConical,
  Package,
  ClipboardList,
  FileText,
  Bell,
  Settings,
  History,
} from "lucide-react";

import { ROLES } from "./roles.js";

export const NAV_ITEMS = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
    roles: [ROLES.ADMIN, ROLES.ADMIN_MANAGER, ROLES.HOD, ROLES.LAB_INCHARGE, ROLES.STAFF],
  },
  {
    label: "Users",
    icon: Users,
    path: "/users",
    roles: [ROLES.ADMIN],
  },
  {
    label: "Departments",
    icon: Building2,
    path: "/departments",
    roles: [ROLES.ADMIN, ROLES.ADMIN_MANAGER],
  },
  {
    label: "Laboratories",
    icon: FlaskConical,
    path: "/laboratories",
    roles: [ROLES.ADMIN, ROLES.ADMIN_MANAGER, ROLES.HOD],
  },
  {
    label: "Assets",
    icon: Package,
    path: "/assets",
    roles: [ROLES.ADMIN, ROLES.ADMIN_MANAGER, ROLES.HOD, ROLES.LAB_INCHARGE],
  },
  {
    label: "Requests",
    icon: ClipboardList,
    path: "/requests",
    roles: [ROLES.ADMIN, ROLES.ADMIN_MANAGER, ROLES.HOD, ROLES.LAB_INCHARGE, ROLES.STAFF],
  },
  {
    label: "Reports",
    icon: FileText,
    path: "/reports",
    roles: [ROLES.ADMIN, ROLES.ADMIN_MANAGER, ROLES.HOD],
  },
  {
    label: "Activity Logs",
    icon: History,
    path: "/activity-logs",
    roles: [ROLES.ADMIN],
  },
  {
    label: "Notifications",
    icon: Bell,
    path: "/notifications",
    roles: [ROLES.ADMIN, ROLES.ADMIN_MANAGER, ROLES.HOD, ROLES.LAB_INCHARGE, ROLES.STAFF],
  },
  {
    label: "Settings",
    icon: Settings,
    path: "/settings",
    roles: [ROLES.ADMIN],
  },
];
