export * from "./datetime";
export * from "./currency";

export function formatTruncatedVND(value) {
  value = parseInt(value);

  if (value < 0) return null;

  const thousands = Math.floor(value / 1000);
  const remainder = value % 1000;

  if (remainder === 0) {
    return `${thousands}`;
  }

  const formattedRemainder = remainder.toString().slice(0, -2); // Remove trailing zero

  const result = `${thousands},${formattedRemainder}`;
  return result;
}

export function formatTruncateWithCommaVND(value) {
  value = parseInt(value);

  if (value < 0) return null;

  const thousands = Math.floor(value / 1000);
  const remainder = value % 1000;

  if (remainder === 0) {
    return `${thousands}`;
  }

  const formattedRemainder = remainder.toString().slice(0, -2); // Remove trailing zero

  const result = `${thousands},${formattedRemainder}`;
  return result;
}

export function formatDateTimeFromDateObject(value) {
  try {
    // Parse the ISOString date time into a Date object
    const date = new Date(value);
    // Extract and format date components according to your custom format
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Add leading zero if needed
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    const result = `${day}/${month}/${year} ${hours}:${minutes}`;
    return result;
  } catch (error) {
    console.error("Error parsing Date object:", error);
    return null; // Return None on parsing errors
  }
}

export function formatDateTime(value) {
  try {
    // Parse the ISOString date time into a Date object
    const date = new Date(value);

    // Extract and format date components according to your custom format
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Add leading zero if needed
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    const result = `${hours}:${minutes} - ${day}/${month}/${year}`;
    return result;
  } catch (error) {
    console.error("Error parsing ISOString date:", error);
    return null; // Return None on parsing errors
  }
}

export function formatDate(value) {
  try {
    // Parse the ISOString date time into a Date object
    const date = new Date(value);

    // Extract and format date components according to your custom format
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Add leading zero if needed
    const day = String(date.getDate()).padStart(2, "0");

    const result = `${day}/${month}/${year}`;
    return result;
  } catch (error) {
    console.error("Error parsing ISOString date:", error);
    return null; // Return None on parsing errors
  }
}

export function dateStringToISOString(dateString) {
  //convert "yyyy-mm-dd" to "yyyy-mm-ddT00:00:00.000Z"
  try {
    // Create a new Date object using the date string
    const date = new Date(dateString);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date");
    }

    // Return the ISO string representation of the date
    return date.toISOString();
  } catch (error) {
    console.error("Error converting date string to ISOString:", error);
    return null; // Return null on errors
  }
}

export function dateTimeStringToISOString(dateTimeString) {
  try {
    // Split date and time parts
    const [datePart, timePart] = dateTimeString.split("T");
    const [year, month, day] = datePart.split("-").map(Number);
    const [hours, minutes] = timePart.split(":").map(Number);

    // Create date in UTC
    const date = new Date(Date.UTC(year, month - 1, day, hours, minutes));

    // Check if date is valid
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date");
    }

    return date.toISOString();
  } catch (error) {
    console.error("Error converting datetime string to ISOString:", error);
    return null;
  }
}

export function isoToMUIDateTime(isoString, showTime = true) {
  try {
    const date = new Date(isoString);

    if (isNaN(date.getTime())) {
      throw new Error("Invalid ISO string");
    }

    // Extract date components
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    if (!showTime) {
      // Return in MUI date format
      return `${year}-${month}-${day}`;
    }

    // Extract time components
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    // Return in MUI datetime format
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  } catch (error) {
    return "";
  }
}

//convert "yyyy-mm-ddT00:00:00.000Z" to "yyyy-mm-dd"
export function isoStringToDateString(isoString, showTime) {
  try {
    // Create a new Date object using the ISO string
    const date = new Date(isoString);
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      throw new Error("Invalid ISO string");
    }

    // Extract and format date components
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Add leading zero if needed
    const day = String(date.getDate()).padStart(2, "0");

    // The formatted date string in "yyyy-mm-dd" format
    let result = `${year}-${month}-${day}`;

    if (showTime) {
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      result += ` ${hours}:${minutes}`;
    }

    return result;
  } catch (error) {
    console.error("Error converting ISOString to date string:", error);
    return null; // Return null on errors
  }
}

///convert "yyyy-mm-ddT00:00:00.000Z" to "dd-mm-yyyy"
export function isoStringToAppDateString(isoString) {
  try {
    // Create a new Date object using the ISO string
    const date = new Date(isoString);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      throw new Error("Invalid ISO string");
    }

    // Extract and format date components
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Add leading zero if needed
    const day = String(date.getDate()).padStart(2, "0");

    // Return the formatted date string in "yyyy-mm-dd" format
    return `${day}-${month}-${year}`;
  } catch (error) {
    console.error("Error converting ISOString to date string:", error);
    return null; // Return null on errors
  }
}

export function formatDateString(value) {
  try {
    // Split the input date string by the hyphen
    const [year, month, day] = value.split("-");

    // Return the formatted date string in "dd/mm/yyyy" format
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error("Error formatting date string:", error);
    return null; // Return null on formatting errors
  }
}

export function getTime(value) {
  try {
    // Parse the ISOString date time into a Date object
    const date = new Date(value);

    // Extract and format date components according to your custom format
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  } catch (error) {
    console.error("Error parsing ISOString date:", error);
    return null; // Return None on parsing errors
  }
}
