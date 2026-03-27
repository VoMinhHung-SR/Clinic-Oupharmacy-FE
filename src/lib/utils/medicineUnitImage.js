/**
 * @param {{ image_url?: string, image_path?: string, images?: Array<string|{url?: string, link?: string}> }} unit
 * @returns {string}
 */
export function getMedicineUnitImageUrl(unit) {
  if (!unit) return "";
  if (unit.image_url) return unit.image_url;
  if (unit.image_path) return unit.image_path;
  const first = unit.images?.[0];
  if (first == null) return "";
  if (typeof first === "string") return first;
  return first?.url ?? first?.link ?? "";
}
