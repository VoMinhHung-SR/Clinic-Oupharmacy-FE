const pickProductName = (variant = {}) => {
  const product = variant.product || {}
  return product.web_name || product.name || ""
}

const pickCategory = (variant = {}) => {
  if (variant.category && typeof variant.category === "object") {
    return {
      id: variant.category.id,
      name: variant.category.name || "",
    }
  }
  if (variant.category_info && Array.isArray(variant.category_info.category)) {
    const arr = variant.category_info.category
    const leaf = arr[arr.length - 1]
    if (leaf) {
      return { id: null, name: leaf.name || "" }
    }
  }
  return null
}

const pickPackaging = (variant = {}) => {
  return variant.packing || variant.package_size || variant.packaging || ""
}

const pickPriceValue = (variant = {}) => {
  if (variant.price_value != null) return Number(variant.price_value) || 0
  if (variant.price != null) return Number(variant.price) || 0
  return 0
}

const saleUnitOptions = (variant = {}) =>
  Array.isArray(variant.unit_options) ? variant.unit_options : []

/** Resolve ProductVariantUnit id (store sale unit) for prescribing payload. */
export const resolveProductVariantUnitId = (variant = {}, preferredUnitId = null) => {
  const options = saleUnitOptions(variant)
  if (preferredUnitId != null) {
    const match = options.find((o) => o.unit_id === preferredUnitId)
    if (match) return preferredUnitId
  }
  if (variant.default_unit_id != null) return variant.default_unit_id
  if (options.length > 0 && options[0].unit_id != null) return options[0].unit_id
  return null
}

export const getSaleUnitById = (variant = {}, unitId = null) => {
  const resolvedId = resolveProductVariantUnitId(variant, unitId)
  return saleUnitOptions(variant).find((o) => o.unit_id === resolvedId) ?? null
}

export const getQuantityInBase = (variant = {}, unitId = null) => {
  const saleUnit = getSaleUnitById(variant, unitId)
  const qib = saleUnit?.quantity_in_base
  if (qib != null) return Number(qib) || 1
  return 1
}

/** Max sale quantity for a variant + unit given base stock (variant.in_stock). */
export const getMaxSaleQuantity = (variant = {}, unitId = null, baseStock = null) => {
  const inStock = baseStock != null ? Number(baseStock) : Number(variant.in_stock ?? 0)
  const qib = getQuantityInBase(variant, unitId)
  if (qib <= 0) return 0
  return Math.floor(inStock / qib)
}

/** Attach selected sale unit fields for prescribing submit. */
export const enrichVariantForPrescribing = (variant = {}, selectedSaleUnitId = null) => {
  const productVariantUnitId = resolveProductVariantUnitId(variant, selectedSaleUnitId)
  const saleUnit = getSaleUnitById(variant, productVariantUnitId)
  return {
    ...variant,
    product_variant_unit_id: productVariantUnitId,
    selectedSaleUnitId: productVariantUnitId,
    quantity_in_base: getQuantityInBase(variant, productVariantUnitId),
    selectedUnitName: saleUnit?.unit_name ?? variant.default_unit_name ?? variant.packaging ?? "",
    selectedUnitPrice: saleUnit?.price_value ?? variant.price_value ?? variant.price ?? 0,
  }
}

export const normalizeStoreVariant = (variant = {}) => {
  const medicine = {
    id: variant.product?.id ?? variant.product_id ?? variant.medicine?.id ?? variant.medicine ?? null,
    name: pickProductName(variant) || variant.medicine?.name || "",
  }

  const defaultUnitId = variant.default_unit_id ?? null
  const options = saleUnitOptions(variant)

  return {
    ...variant,
    medicine,
    packaging: pickPackaging(variant),
    package_size: pickPackaging(variant),
    price: pickPriceValue(variant),
    price_value: pickPriceValue(variant),
    in_stock: Number(variant.in_stock ?? 0),
    category: pickCategory(variant),
    default_unit_id: defaultUnitId,
    unit_options: options,
    default_unit_name: variant.default_unit_name ?? null,
  }
}

export const normalizeStoreVariantResponse = (payload) => {
  if (Array.isArray(payload)) {
    return payload.map(normalizeStoreVariant)
  }
  if (payload && Array.isArray(payload.results)) {
    return {
      ...payload,
      results: payload.results.map(normalizeStoreVariant),
    }
  }
  return payload
}

/**
 * Single rule for line unit price (aligned with BE resolved_unit_price when present).
 */
export const resolvePrescriptionDetailUnitPrice = (detail = {}) => {
  const resolved = detail.resolved_unit_price
  if (resolved != null && resolved !== "") {
    const n = Number(resolved)
    return Number.isFinite(n) ? n : 0
  }
  const mu = detail.medicine_unit || {}
  if (mu.price_value != null) return Number(mu.price_value) || 0
  if (mu.price != null) return Number(mu.price) || 0
  const pvu = detail.product_variant_unit || {}
  if (pvu.price_value != null) return Number(pvu.price_value) || 0
  const pv = detail.product_variant || {}
  if (pv.price_value != null) return Number(pv.price_value) || 0
  if (detail.unit_price_snapshot != null) return Number(detail.unit_price_snapshot) || 0
  return 0
}

export const resolveProductEntityId = (variant = {}) =>
  variant.product_entity_id ?? variant.product?.id ?? variant.medicine?.id ?? null

export const hasMultipleVariants = (variant = {}) => Number(variant.variant_count ?? 1) > 1

export const normalizePrescriptionDetailItem = (detail = {}) => {
  const source = detail.medicine_unit || detail.product_variant_unit || detail.product_variant || {}
  const normalized = normalizeStoreVariant(source)
  const resolved = detail.resolved_unit_price
  const priceValue =
    resolved != null && resolved !== ""
      ? Number(resolved) || 0
      : normalized.price_value
  return {
    ...detail,
    medicine_unit: {
      ...normalized,
      medicine: normalized.medicine,
      package_size: normalized.packaging,
      price_value: priceValue,
    },
  }
}
