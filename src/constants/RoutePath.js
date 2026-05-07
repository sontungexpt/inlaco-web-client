const RoutePath = {
  Home: "/",
  E403: "/403",
  Account: "/account",
  ShipSchedule: {
    Root: "/shipschedule",
    Index: "/shipschedule",
    Form: "/shipschedule/form",
    Detail: (id = ":id") => `/shipschedule/${id}`,
  },

  Login: "/login",
  SignUp: "/sign-up",
  VerifyEmailConfirmation: "/verify-email-confirmation",

  Crew: {
    Root: "/crews",

    Index: "/crews",

    Add: (candidateId = ":candidateID") => `/crews/add/${candidateId}`,
    Detail: (id = ":id") => `/crews/${id}`,
    MyProfile: "/crews/my-profile",
  },

  Mobilization: {
    Root: "/mobilizations",
    Index: "/mobilizations",

    Children: {
      Form: "/form",
      Detail: (id = ":id") => `/detail/${id}`,
    },

    Form: "/mobilizations/form",
    Detail: (id = ":id") => `/mobilizations/${id}`,
    My: "/mobilizations/my-mobilizations",
  },

  Contract: {
    Index: "/contracts",
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
