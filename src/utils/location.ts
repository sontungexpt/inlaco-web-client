export async function getCurrentLocation() {
  if (!navigator.geolocation) {
    throw new Error("Geolocation is not supported");
  }

  return new Promise<{
    latitude: number;
    longitude: number;
    accuracy: number;
    locationString: string;
  }>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          locationString: `${position.coords.latitude},${position.coords.longitude},${position.coords.accuracy}`,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  });
}
