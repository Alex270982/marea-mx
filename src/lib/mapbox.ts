/* Mapbox access token. The placeholder is swapped for a real public
   token (pk....) at deploy time; until then the SVG map renders. */

export const MAPBOX_TOKEN = "pk.eyJ1IjoiYWxleDUwNTAiLCJhIjoiY21ycXcwNWdmMGZkZjMwb25pZ2I4c25qYiJ9.GO3jhWR34uQJgV7M2Ga-5g"; // swapped for the real pk. token later

export const mapboxEnabled = () => MAPBOX_TOKEN.startsWith("pk.");
