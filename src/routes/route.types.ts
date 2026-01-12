export type AppRoute = {
  path?: string;
  index?: boolean;
  element?: React.LazyExoticComponent<any> | React.FC;
  children?: AppRoute[];
  roles?: string[] | ((hasRole, roles) => boolean);

  // layout === false => no layout
  // layout === null => default to MainLayout
  // layout === any other value => custom layout
  //
  // roles === null => no access control
  // roles === [...] => access control
  layout?: Boolean | Function;
  public?: boolean;
};
