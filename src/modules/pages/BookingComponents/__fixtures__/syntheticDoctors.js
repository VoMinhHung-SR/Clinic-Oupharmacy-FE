/**
 * Synthetic doctor/specialty payloads for local UI load checks.
 * Import manually in a throwaway branch or Node/REPL — not wired into /booking.
 *
 * Usage (scratch):
 *   import { buildSyntheticDoctors } from './syntheticDoctors'
 *   const list = buildSyntheticDoctors({ doctorCount: 20, specialtyCount: 50 })
 */
const SPECIALTY_NAMES = [
  "Nội khoa", "Ngoại khoa", "Nhi khoa", "Sản phụ khoa", "Da liễu",
  "Tai Mũi Họng", "Mắt", "Răng Hàm Mặt", "Thần kinh", "Tim mạch",
  "Hô hấp", "Tiêu hóa", "Nội tiết", "Cơ xương khớp", "Ung bướu",
  "Huyết học", "Thận", "Tiết niệu", "Chỉnh hình", "Phẫu thuật thẩm mỹ",
  "Y học cổ truyền", "Dinh dưỡng", "Tâm thần", "Lão khoa", "Dị ứng",
  "Miễn dịch", "Truyền nhiễm", "Hồi sức cấp cứu", "Gây mê", "Chẩn đoán hình ảnh",
  "Y học hạt nhân", "Phục hồi chức năng", "Vật lý trị liệu", "Xét nghiệm", "Giải phẫu bệnh",
  "Gan mật", "Đột quỵ", "Động mạch vành", "Tiểu đường", "Cao huyết áp",
  "Hen suyễn", "COPD", "Viêm gan", "HIV", "Lao",
  "Ung thư vú", "Ung thư phổi", "Thai sản", "Hiếm muộn", "Giấc ngủ",
]

const FIRST_NAMES = [
  "An", "Bình", "Chi", "Dũng", "Em", "Phúc", "Giang", "Hà", "Ian", "Khoa",
  "Lan", "Minh", "Nam", "Oanh", "Phương", "Quân", "Rạng", "Sơn", "Trang", "Uyên",
]

const LAST_NAMES = [
  "Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Huỳnh", "Phan", "Vũ", "Võ", "Đặng",
]

const buildSpecialties = (count = 50) =>
  Array.from({ length: count }, (_, i) => ({
    id: 9000 + i,
    name:
      SPECIALTY_NAMES[i % SPECIALTY_NAMES.length] +
      (i >= SPECIALTY_NAMES.length
        ? ` ${Math.floor(i / SPECIALTY_NAMES.length) + 1}`
        : ""),
  }))

/** Shape matches doctor-profile list items used by BookingDoctorDiscovery. */
export const buildSyntheticDoctors = ({
  doctorCount = 20,
  specialtyCount = 50,
} = {}) => {
  const specialties = buildSpecialties(specialtyCount)
  return Array.from({ length: doctorCount }, (_, i) => {
    const tagA = specialties[i % specialties.length]
    const tagB = specialties[(i * 3 + 7) % specialties.length]
    const tagC = specialties[(i * 5 + 11) % specialties.length]
    const uid = 91000 + i
    const tags = [tagA, tagB, tagC].filter(
      (s, idx, arr) => arr.findIndex((x) => x.id === s.id) === idx
    )
    return {
      id: uid,
      user_display: {
        id: uid,
        first_name: FIRST_NAMES[i % FIRST_NAMES.length],
        last_name: LAST_NAMES[i % LAST_NAMES.length],
        email: `doctor.loadtest.${i + 1}@example.local`,
      },
      specializations: tags,
    }
  })
}

export const mergeWithSyntheticDoctors = (realDoctors = [], options) => [
  ...(Array.isArray(realDoctors) ? realDoctors : []),
  ...buildSyntheticDoctors(options),
]
