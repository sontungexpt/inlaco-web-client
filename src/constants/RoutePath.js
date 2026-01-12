const RoutePath = {
  Home: "/",
  Login: "/login",
  SignUp: "/sign-up",
  VerifyEmailConfirmation: "/verify-email-confirmation",
  E403: "/403",

  Crew: {
    Root: "/crews",
    Add: (candidateId = ":candidateID") => `/crews/add/${candidateId}`,
    Detail: (id = ":id") => `/crews/${id}`,
    MyProfile: "/crews/my-profile",
  },

  Mobilization: {
    Root: "/mobilizations",
    Form: "/mobilizations/form",
    Detail: (id = ":id") => `/mobilizations/${id}`,
    My: "/mobilizations/my-mobilizations",
  },

  CrewContract: {
    Root: "/crew-contracts",
    Create: "/crew-contracts/form",
    Detail: (id = ":id") => `/crew-contracts/${id}`,
    Addendum: (id = ":id") => `/crew-contracts/${id}/create-addendum`,
  },

  SupplyContract: {
    Root: "/supply-contracts",
    Create: "/supply-contracts/form",
    Detail: (id = ":id") => `/supply-contracts/${id}`,
  },

  Posts: {
    Detail: (id = ":id") => `/posts/${id}`,
    Create: "/posts/create",
    Edit: (id = ":id") => `/posts/edit/${id}`,
  },
};

export const relative = (path) => path.replace(/^\/+/, "");

export default RoutePath;
