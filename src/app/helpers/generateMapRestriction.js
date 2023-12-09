/*global google*/
const QUERY_RADIUS_M = process.env.NEXT_PUBLIC_QUERY_RADIUS_M;

const generateMapRestriction = (center) => {
  if (!google.maps.geometry) {
    if (QUERY_RADIUS_M) {
      throw Error(
        "Geometry library missing. Add 'geometry' to the libraries array of the Google Maps 'Provider' component."
      );
    } else {
      throw Error("ENV variable value for 'QUERY_RADIUS_M' is missing");
    }
  } else if (QUERY_RADIUS_M) {
    const {computeOffset} = google.maps.geometry.spherical;
    const radiusM = Number(QUERY_RADIUS_M) + 50; // add margin

    return {
      latLngBounds: {
        north: computeOffset(center, radiusM, 0).lat(),
        south: computeOffset(center, radiusM + 100, 180).lat(), // Extra margin for input form…
        east: computeOffset(center, radiusM, 90).lng(),
        west: computeOffset(center, radiusM, -90).lng()
      }
    };
  }
};

export default generateMapRestriction;