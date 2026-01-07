const Regex = {
  VN_PHONE: /^(\+84|0)(3[2-9]|5[2689]|7[06-9]|8[1-9]|9[0-46-9])\d{7}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])[A-Za-z\d@$!%*?&]{8,}$/,
  CI_NUMBER: /^\d{12}$/,
  ISO_REGEX:
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?(Z|[+-]\d{2}:\d{2})$/,
};

export default Regex;
