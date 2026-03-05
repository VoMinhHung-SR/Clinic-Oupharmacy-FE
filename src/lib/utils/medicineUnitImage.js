/**
 * @param {{ image_path?: string, image?: string, images?: Array<string|{url?: string, link?: string}> }} unit - medicine unit từ API
 * @returns {string}
 */
export function getMedicineUnitImageUrl(unit) {
  if (!unit) return "";
  if (unit.image_path) return unit.image_path;
  const first = unit.images?.[0];
  if (first == null) return "";
  if (typeof first === "string") return first;
  return first?.url ?? first?.link ?? "";
}
