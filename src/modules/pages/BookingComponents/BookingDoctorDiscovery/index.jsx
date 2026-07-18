import {
  Autocomplete,
  Box,
  Button,
  Chip,
  TextField,
  Typography,
} from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import moment from "moment"
import { CURRENT_DATE } from "../../../../lib/constants"
import { fetchSchedulesForDoctors } from "../services"
import BookingForm from "../BookingForm"
import Loading from "../../../common/components/Loading"

const QUICK_CHIP_LIMIT = 6
const VISIBLE_SPECIALTY_TAGS = 3

const doctorDisplayName = (doctor) => {
  const u = doctor?.user_display || {}
  return `${u.first_name || ""} ${u.last_name || ""}`.trim()
}

const doctorHasOpenSession = (schedules) =>
  Array.isArray(schedules) &&
  schedules.some((s) => s && s.is_off === false)

const popularSpecialtyIds = (doctors, limit) => {
  const counts = new Map()
  ;(doctors || []).forEach((d) => {
    ;(d.specializations || []).forEach((s) => {
      if (s?.id == null) return
      counts.set(s.id, (counts.get(s.id) || 0) + 1)
    })
  })
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0])))
    .slice(0, limit)
    .map(([id]) => id)
}

/**
 * Specialty search + name/date filters → pick one doctor → BookingForm.
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
    return Array.from(map.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => String(a.name).localeCompare(String(b.name)))
  }, [doctors])

  const showQuickChips = specialtyOptions.length > 12

  const autocompleteOptions = useMemo(
    () => [{ id: "all", name: t("booking:allSpecialties") }, ...specialtyOptions],
    [specialtyOptions, t]
  )

  const selectedSpecialtyOption = useMemo(
    () =>
      autocompleteOptions.find((o) => String(o.id) === String(specialtyId)) ||
      autocompleteOptions[0],
    [autocompleteOptions, specialtyId]
  )

  const quickSpecialtyOptions = useMemo(() => {
    if (!showQuickChips) return []
    const popularIds = popularSpecialtyIds(doctors, QUICK_CHIP_LIMIT)
    const byId = new Map(specialtyOptions.map((s) => [s.id, s]))
    return popularIds.map((id) => byId.get(id)).filter(Boolean)
  }, [doctors, specialtyOptions, showQuickChips])

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
        <Box className="ou-flex ou-justify-between ou-items-center ou-mb-3">
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
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          display: "grid",
          gap: 1.5,
          gridTemplateColumns: {
            xs: "1fr",
            md: "minmax(200px, 1.1fr) minmax(200px, 1.2fr) minmax(160px, 0.9fr)",
          },
          alignItems: "center",
          mb: showQuickChips ? 1.5 : 2,
          p: { xs: 1.5, sm: 2 },
          borderRadius: 2,
          bgcolor: "#fafbfc",
          border: "1px solid #e8ecf0",
        }}
      >
        <Autocomplete
          size="small"
          options={autocompleteOptions}
          value={selectedSpecialtyOption}
          onChange={(_, value) => setSpecialtyId(value?.id ?? "all")}
          getOptionLabel={(option) => option?.name || ""}
          isOptionEqualToValue={(a, b) => String(a?.id) === String(b?.id)}
          renderInput={(params) => (
            <TextField {...params} label={t("booking:specialtySearch")} />
          )}
        />
        <TextField
          size="small"
          fullWidth
          label={t("booking:searchDoctor")}
          value={nameQuery}
          onChange={(e) => setNameQuery(e.target.value)}
        />
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <TextField
            size="small"
            fullWidth
            type="date"
            label={t("booking:filterByDate")}
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            inputProps={{
              min: moment(CURRENT_DATE).format("YYYY-MM-DD"),
              max: moment(CURRENT_DATE).add(30, "days").format("YYYY-MM-DD"),
            }}
          />
          {filterDate ? (
            <Button size="small" onClick={() => setFilterDate("")} sx={{ flexShrink: 0 }}>
              {t("booking:clearDateFilter")}
            </Button>
          ) : null}
        </Box>
      </Box>

      {showQuickChips ? (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
          <Chip
            size="small"
            label={t("booking:allSpecialties")}
            color={specialtyId === "all" ? "primary" : "default"}
            onClick={() => setSpecialtyId("all")}
            variant={specialtyId === "all" ? "filled" : "outlined"}
          />
          {quickSpecialtyOptions.map((s) => (
            <Chip
              key={s.id}
              size="small"
              label={s.name}
              color={String(specialtyId) === String(s.id) ? "primary" : "default"}
              onClick={() => setSpecialtyId(s.id)}
              variant={String(specialtyId) === String(s.id) ? "filled" : "outlined"}
            />
          ))}
        </Box>
      ) : null}

      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
        {t("booking:doctorResultCount", {
          shown: visibleDoctors.length,
          total: doctors.length,
        })}
      </Typography>

      {dateFilterLoading ? (
        <Box className="ou-py-6">
          <Loading />
        </Box>
      ) : visibleDoctors.length === 0 ? (
        <Typography color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
          {t("booking:noDoctorMatch")}
        </Typography>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 1.5,
            maxHeight: { xs: 480, md: 440 },
            overflowY: "auto",
            pr: 0.5,
          }}
        >
          {visibleDoctors.map((d) => {
            const tags = d.specializations || []
            const shown = tags.slice(0, VISIBLE_SPECIALTY_TAGS)
            const extra = tags.length - shown.length
            return (
              <Box
                component="button"
                type="button"
                key={d.id}
                onClick={() => setSelectedDoctorId(d.id)}
                sx={{
                  textAlign: "left",
                  cursor: "pointer",
                  border: "1px solid",
                  borderColor: "#bfdbfe",
                  borderRadius: 2,
                  px: 2,
                  py: 1.5,
                  bgcolor: "#fff",
                  transition: "background-color 0.15s, border-color 0.15s, box-shadow 0.15s",
                  "&:hover": {
                    bgcolor: "#f8fbff",
                    borderColor: "primary.main",
                    boxShadow: "0 2px 8px rgba(29, 78, 216, 0.08)",
                  },
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ color: "primary.dark", fontWeight: 700, lineHeight: 1.3 }}
                >
                  {doctorDisplayName(d)}
                </Typography>
                {shown.length > 0 ? (
                  <Box
                    sx={{
                      mt: 0.75,
                      display: "flex",
                      alignItems: "center",
                      gap: 0.75,
                      flexWrap: "wrap",
                    }}
                  >
                    {shown.map((s) => (
                      <Chip
                        key={`${d.id}-${s.id}`}
                        size="small"
                        label={s.name}
                        sx={{
                          height: 22,
                          fontSize: "0.7rem",
                          bgcolor: "#eff6ff",
                          color: "#1d4ed8",
                        }}
                      />
                    ))}
                    {extra > 0 ? (
                      <Typography variant="caption" color="text.secondary">
                        {t("booking:moreSpecialtyCount", { count: extra })}
                      </Typography>
                    ) : null}
                  </Box>
                ) : null}
              </Box>
            )
          })}
        </Box>
      )}
    </Box>
  )
}

export default BookingDoctorDiscovery
