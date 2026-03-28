export * from "./datetime";
export * from "./currency";

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
