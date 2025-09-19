import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface PaletteColor {
    main: string;
    light: string;
    dark: string;
    contrastText: string;
    subtle: string;
    hover: string;
    active: string;
  }

  interface SimplePaletteColorOptions {
    main?: string;
    light?: string;
    dark?: string;
    contrastText?: string;
    subtle?: string;
    hover?: string;
    active?: string;
  }

  interface TypeAction {
    active: string;
    hover: string;
    hoverOpacity: number;
    selected: string;
    selectedOpacity: number;
    disabled: string;
    disabledBackground: string;
    disabledOpacity: number;
    focus: string;
    focusOpacity: number;
    activatedOpacity: number;
    primaryHover: string;
    primarySelected: string;
    secondaryHover: string;
    secondarySelected: string;
  }
}
