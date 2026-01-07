import * as Yup from "yup";

export const SCHEMA = Yup.object().shape({
  compName: Yup.string().required("Tên công ty không được để trống"),

  mobilizationInfo: Yup.object().shape({
    timeOfDeparture: Yup.date()
      .min(new Date(), "Thời gian khởi hành không hợp lệ")
      .required("Thời gian khởi hành dự kiến không được để trống")
      .test(
        "is-before-end-datetime",
        "Thời gian khởi hành phải trước thời gian đến nơi dự kiến",
        function (value) {
          const { estimatedTimeOfArrival } = this.parent; // Access sibling field estimatedTimeOfArrival
          return !estimatedTimeOfArrival || value < estimatedTimeOfArrival;
        },
      ),
    UN_LOCODE_DepartureLocation: Yup.string().required(
      "UN/LOCODE điểm khởi hành không được để trống",
    ),
    departureLocation: Yup.string().required(
      "Tên điểm khởi hành không được để trống",
    ),

    estimatedTimeOfArrival: Yup.date()
      .required("Thời gian đến nơi dự kiến không được để trống")
      .test(
        "is-after-start-datetime",
        "Thời gian đến nơi dự kiến phải sau thời gian khởi hành",
        function (value) {
          const { timeOfDeparture } = this.parent; // Access sibling field timeOfDeparture
          return !timeOfDeparture || value > timeOfDeparture;
        },
      ),
    UN_LOCODE_ArrivalLocation: Yup.string().required(
      "UN/LOCODE điểm đến không được để trống",
    ),
    arrivalLocation: Yup.string().required("Tên điểm đến không được để trống"),
  }),
});
