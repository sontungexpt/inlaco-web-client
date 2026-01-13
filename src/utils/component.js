import React from "react";

export const resolveComponent = (component, props) => {
  // If already <Icon />
  if (React.isValidElement(component)) {
    return React.cloneElement(component, props);
  }

  // If component (function / memo / forwardRef)
  else if (typeof component === "function" || typeof component === "object") {
    return React.createElement(component, props);
  }

  return null;
};
