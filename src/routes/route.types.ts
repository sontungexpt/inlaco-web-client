export type AppRoute = {
  path?: string;
  index?: boolean;
  element?: React.LazyExoticComponent<any> | React.FC;
  children?: AppRoute[];
  roles?: string[] | ((hasRole, roles) => boolean);
  layout?: "main" | "blank";
};
