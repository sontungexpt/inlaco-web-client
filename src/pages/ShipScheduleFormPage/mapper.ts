import { CreateShipScheduleRequest } from "@/types/api/ship-schedule.api";
import { FormValues } from "./schema";
import { datetimeToISO } from "@/utils/converter";

export function mapValuesToRequestBody(
  values: FormValues,
  shipImageAssetId?: string,
): CreateShipScheduleRequest {
  return {
    shipInfo: {
      name: values.shipInfo.name,
      imoNumber: values.shipInfo.imoNumber,
      countryISO: values.shipInfo.countryISO,
      type: values.shipInfo.type,
      image: shipImageAssetId,
    },

    route: values.route,

    departurePort: values.departurePort,
    arrivalPort: values.arrivalPort,

    departureTime: datetimeToISO(values.departureTime) as string,
    arrivalTime: datetimeToISO(values.arrivalTime) as string,

    crews: values.crews?.map((crew) => ({
      employeeCardId: crew.employeeCardId,
      rankOnBoard: crew.rankOnBoard,

      boardingTime: datetimeToISO(crew.boardingTime) as string,
      disembarkTime: datetimeToISO(crew.disembarkTime) as string,

      boardingPort: crew.boardingPort,
      disembarkPort: crew.disembarkPort,

      note: crew.note,
    })),
  };
}
