export interface State {
  pending: boolean;
  loaded: boolean;
  error?: string | null;
  data: { [key: string]: any };
}
