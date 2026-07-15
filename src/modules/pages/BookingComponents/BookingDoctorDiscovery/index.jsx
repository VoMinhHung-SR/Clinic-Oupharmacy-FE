import { Box, Button, Chip, TextField } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import moment from "moment"
import { CURRENT_DATE } from "../../../../lib/constants"
import { fetchSchedulesForDoctors } from "../services"
import BookingForm from "../BookingForm"
import Loading from "../../../common/components/Loading"

const doctorDisplayName = (doctor) => {
  const u = doctor?.user_display || {}
  return `${u.first_name || ""} ${u.last_name || ""}`.trim()
}

const doctorHasOpenSession = (schedules) =>
  Array.isArray(schedules) &&
  schedules.some((s) => s && s.is_off === false)

/**
 * P3 discovery: specialty + name + optional date → pick one doctor → single BookingForm.
 */
const BookingDoctorDiscovery = ({ doctors = [] }) => {
  const { t } = useTranslation(["booking", "common"])
  const [specialtyId, setSpecialtyId] = useState("all")
  const [nameQuery, setNameQuery] = useState("")
  const [filterDate, setFilterDate] = useState("")
  const [dateAvailableIds, setDateAvailableIds] = useState(null)
  const [dateFilterLoading, setDateFilterLoading] = useState(false)
  const [selectedDoctorId, setSelectedDoctorId] = useState(null)

  const specialtyOptions = useMemo(() => {
    const map = new Map()
    doctors.forEach((d) => {
      ;(d.specializations || []).forEach((s) => {
        if (s?.id != null && !map.has(s.id)) map.set(s.id, s.name)
      })
    })
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }))
  }, [doctors])

  const specialtyFiltered = useMemo(() => {
    let list = doctors
    if (specialtyId !== "all") {
      list = list.filter((d) =>
        (d.specializations || []).some((s) => String(s.id) === String(specialtyId))
      )
    }
    const q = nameQuery.trim().toLowerCase()
    if (q) {
      list = list.filter((d) => doctorDisplayName(d).toLowerCase().includes(q))
    }
    return list
  }, [doctors, specialtyId, nameQuery])

  const specialtyFilteredIdsKey = specialtyFiltered
    .map((d) => d.user_display?.id)
    .filter(Boolean)
    .join(",")

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      if (!filterDate) {
        setDateAvailableIds(null)
        return
      }
      setDateFilterLoading(true)
      try {
        const ids = specialtyFilteredIdsKey
          ? specialtyFilteredIdsKey.split(",").map((id) => Number(id))
          : []
        const rows = await fetchSchedulesForDoctors(filterDate, ids)
        if (cancelled) return
        const open = new Set(
          rows.filter((r) => doctorHasOpenSession(r.schedules)).map((r) => r.doctorId)
        )
        setDateAvailableIds(open)
      } catch {
        if (!cancelled) setDateAvailableIds(new Set())
      } finally {
        if (!cancelled) setDateFilterLoading(false)
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [filterDate, specialtyFilteredIdsKey])

  const visibleDoctors = useMemo(() => {
    if (!dateAvailableIds) return specialtyFiltered
    return specialtyFiltered.filter((d) =>
      dateAvailableIds.has(d.user_display?.id)
    )
  }, [specialtyFiltered, dateAvailableIds])

  const selectedDoctor = useMemo(
    () => doctors.find((d) => d.id === selectedDoctorId) || null,
    [doctors, selectedDoctorId]
  )

  if (selectedDoctor) {
    return (
      <Box>
        <Box className="ou-flex ou-justify-between ou-items-center ou-mb-3 ou-px-2">
          <span className="ou-text-sm ou-text-gray-600">
            {t("booking:selectedDoctor")}:{" "}
            <strong className="ou-text-blue-700">
              {doctorDisplayName(selectedDoctor)}
            </strong>
          </span>
          <Button size="small" variant="outlined" onClick={() => setSelectedDoctorId(null)}>
            {t("booking:changeDoctor")}
          </Button>
        </Box>
        <BookingForm doctorInfo={selectedDoctor} key={selectedDoctor.id} />
      </Box>
    )
  }

  return (
    <Box className="ou-w-full ou-text-left">
      <Box className="ou-mb-3 ou-px-1">
        <p className="ou-text-sm ou-font-semibold ou-mb-2">{t("booking:filterBySpecialty")}</p>
        <Box className="ou-flex ou-flex-wrap ou-gap-2">
          <Chip
            label={t("booking:allSpecialties")}
            color={specialtyId === "all" ? "primary" : "default"}
            onClick={() => setSpecialtyId("all")}
            variant={specialtyId === "all" ? "filled" : "outlined"}
          />
          {specialtyOptions.map((s) => (
            <Chip
              key={s.id}
              label={s.name}
              color={String(specialtyId) === String(s.id) ? "primary" : "default"}
              onClick={() => setSpecialtyId(s.id)}
              variant={String(specialtyId) === String(s.id) ? "filled" : "outlined"}
            />
          ))}
        </Box>
      </Box>

      <Box
        className="ou-flex ou-flex-col ou-gap-3 ou-mb-4 ou-px-1"
        sx={{ flexDirection: { sm: "row" }, alignItems: { sm: "center" } }}
      >
        <TextField
          size="small"
          fullWidth
          label={t("booking:searchDoctor")}
          value={nameQuery}
          onChange={(e) => setNameQuery(e.target.value)}
        />
        <TextField
          size="small"
          type="date"
          label={t("booking:filterByDate")}
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          inputProps={{
            min: moment(CURRENT_DATE).format("YYYY-MM-DD"),
            max: moment(CURRENT_DATE).add(30, "days").format("YYYY-MM-DD"),
          }}
          sx={{ minWidth: { sm: 200 } }}
        />
        {filterDate ? (
          <Button size="small" onClick={() => setFilterDate("")}>
            {t("booking:clearDateFilter")}
          </Button>
        ) : null}
      </Box>

      {dateFilterLoading ? (
        <Box className="ou-py-6">
          <Loading />
        </Box>
      ) : visibleDoctors.length === 0 ? (
        <p className="ou-text-center ou-text-gray-600 ou-py-6">{t("booking:noDoctorMatch")}</p>
      ) : (
        <Box className="ou-flex ou-flex-col ou-gap-2">
          {visibleDoctors.map((d) => (
            <button
              type="button"
              key={d.id}
              onClick={() => setSelectedDoctorId(d.id)}
              className="ou-w-full ou-text-left ou-border ou-border-blue-100 ou-rounded-md ou-p-3 hover:ou-bg-blue-50 ou-transition"
            >
              <div className="ou-font-semibold ou-text-blue-700">{doctorDisplayName(d)}</div>
              <div className="ou-flex ou-flex-wrap ou-gap-1 ou-mt-1">
                {(d.specializations || []).map((s) => (
                  <span
                    key={`${d.id}-${s.id}`}
                    className="ou-bg-blue-50 ou-text-blue-700 ou-px-2 ou-py-0.5 ou-rounded ou-text-xs"
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </Box>
      )}
    </Box>
  )
}

export default BookingDoctorDiscovery
