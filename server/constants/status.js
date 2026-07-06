export const ASSET_STATUS = Object.freeze({
  AVAILABLE: "Available",
  ISSUED: "Issued",
  DAMAGED: "Damaged",
  UNDER_REPAIR: "Under Repair",
  SCRAPPED: "Scrapped",
  LOST: "Lost",
});

export const ASSET_CONDITION = Object.freeze({
  NEW: "New",
  GOOD: "Good",
  FAIR: "Fair",
  POOR: "Poor",
  DAMAGED: "Damaged",
});

export const REQUEST_STATUS = Object.freeze({
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  ISSUED: "Issued",
  CANCELLED: "Cancelled",
  RETURNED: "Returned",
});

export const REPAIR_STATUS = Object.freeze({
  PENDING: "Pending",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  SCRAPPED: "Scrapped",
});

export const DEFAULT_CATEGORIES = [
  "Laptop", "Desktop", "Monitor", "Printer", "Projector",
  "Chair", "Table", "Router", "Switch", "Keyboard",
  "Mouse", "UPS", "Lab Equipment", "Furniture", "Others",
];
