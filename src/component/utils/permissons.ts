export const Permissions = {
  DASHBOARD: 'DASHBOARD',
  STAFF: 'STAFF',
  PATIENT: 'PATIENT',
  APPOINTMENT: 'APPOINTMENT',
  CLINIC: 'CLINIC',
  SERVICE: 'SERVICE',
  INVOICE: 'INVOICE',
  INVENTORY: 'INVENTORY',
  REPORT: 'REPORT',
  PAYMENT: 'PAYMENT'
} as const;

export type Permissions = (typeof Permissions)[keyof typeof Permissions];

export const permissionValues: Permissions[] = Object.values(Permissions);
