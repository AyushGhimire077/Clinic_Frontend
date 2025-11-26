import type { AlertColor } from "@mui/material";

 
export interface IToasterData {
  message: string | null;
  severity: AlertColor | undefined;
  open: boolean;
}
export interface IToaster {
  data: IToasterData;
  close: (value: boolean) => void;
}

export interface ToasterState {
  toasterData: IToasterData;
  setToasterData: (data: IToasterData) => void;
  closeToaster: () => void;
}

 