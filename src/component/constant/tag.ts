export const STATUS_COLORS : Record<string, string> = {
  ACTIVE: "bg-success/10 text-success border border-success/20",
  CLOSED: "bg-muted/10 text-muted border border-muted/20",
  COMPLETED: "bg-info/10 text-info border border-info/20",
  CANCELLED: "bg-error/10 text-error border border-error/20",
};

export const TYPE_COLORS:Record<string, string> = {
  ONE_TIME: "bg-primary/10 text-primary border border-primary/20",
  RECURRING: "bg-info/10 text-info border border-info/20",
};

export const BILLING_MODE_TAGS:Record<string, { label: string; className: string }> = {
  PACKAGE : {
    label: "Package",
    className: "bg-warning/10 text-warning border border-warning/20",
  },
  PER_VISIT: {
    label: "Per Visit",
    className: "bg-surface text-foreground border border-border",
  },
};
