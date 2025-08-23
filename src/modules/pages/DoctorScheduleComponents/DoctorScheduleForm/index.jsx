import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, Button, Box, FormControl, InputLabel, Select, MenuItem, CircularProgress, TableFooter } from '@mui/material';
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import moment from 'moment';
import { ROLE_DOCTOR } from '../../../../lib/constants';
import useDoctorSchedule from '../hooks/useDoctorSchedule';
import { useEffect, useMemo } from 'react';
import DoctorCalendar from '../DoctorCalendar';
import SkeletonDoctorScheduleList from '../../../common/components/skeletons/pages/doctor-schedules';

const DoctorScheduleForm = ({ doctor }) => {
    const { onSubmit, setSelectedWeek, existSchedule, selectedWeek, selectedYear, isLoading } = useDoctorSchedule();
    const { t, tReady } = useTranslation(['doctor-schedule', 'common']);
    
    const methods = useForm({
        mode: "onSubmit",
        defaultValues: {
            doctorID: doctor.id,
            weekly_schedule: {}
        }
    });

    // Memoize static data
    const days = useMemo(() => [
        t('doctor-schedule:monday'), t('doctor-schedule:tuesday'),
        t('doctor-schedule:wednesday'), t('doctor-schedule:thursday'),
        t('doctor-schedule:friday'), t('doctor-schedule:saturday')
    ], [t]);

    const sessions = ['morning', 'afternoon'];

    // Memoize week dates calculation
    const { startOfSelectedWeek, daysOfSelectedWeek, currentWeekDates } = useMemo(() => {
        const start = moment().year(selectedYear).isoWeek(selectedWeek).startOf('isoWeek');
        return {
            startOfSelectedWeek: start,
            daysOfSelectedWeek: Array.from({ length: 6 }, (_, i) => 
                start.clone().add(i, 'days').format('DD/MM/YYYY')),
            currentWeekDates: Array.from({ length: 6 }, (_, i) => 
                start.clone().add(i, 'days').format('YYYY-MM-DD'))
        };
    }, [selectedWeek, selectedYear]);

    // Check if week has existing schedule
    const hasExistingSchedule = useMemo(() => 
        currentWeekDates.some(date => 
            existSchedule?.[doctor.email]?.[date]?.morning ||
            existSchedule?.[doctor.email]?.[date]?.afternoon
        ), [currentWeekDates, existSchedule, doctor.email]);

    // Update form when schedule changes
    useEffect(() => {
        const doctorSchedule = existSchedule?.[doctor.email];
        if (doctorSchedule) {
            methods.reset({
                doctorID: doctor.id,
                weekly_schedule: doctorSchedule
            });
        }
    }, [existSchedule, doctor, methods]);

    const renderCheckbox = (date, session) => {
        const isDisabled = moment(date).isSameOrBefore(moment(), 'day');
        return (
            <Controller
                name={`weekly_schedule.${date}.${session}`}
                control={methods.control}
                defaultValue={{ session, is_off: true }}
                render={({ field }) => (
                    <Checkbox
                        {...field}
                        checked={!field.value.is_off}
                        onChange={(e) => field.onChange({ ...field.value, is_off: !e.target.checked })}
                        disabled={isDisabled}
                    />
                )}
            />
        );
    };

    if (tReady || isLoading) {
        return (
            <Box>
                <SkeletonDoctorScheduleList />
            </Box>
        );
    }

    return (
        <Box>
            {/* Week Selector and Calendar */}
            <Box>
                <Box className="ou-flex ou-justify-end ou-p-5">
                    <FormControl variant="outlined" size="small">
                        <InputLabel>{t('doctor-schedule:week')}</InputLabel>
                        <Select 
                            value={selectedWeek}
                            onChange={(e) => setSelectedWeek(e.target.value)}
                            label={t('doctor-schedule:week')}
                            sx={{ minWidth: 120 }}
                        >
                            {Array.from({ length: 52 }, (_, i) => (
                                <MenuItem key={i + 1} value={i + 1}>
                                    {t('doctor-schedule:week')} {i + 1}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
                <DoctorCalendar 
                    selectedWeek={selectedWeek}
                    selectedYear={selectedYear}
                    scheduleData={existSchedule}
                />
            </Box>
            
            {/* Schedule Form */}
            <form onSubmit={methods.handleSubmit(onSubmit)} className="ou-p-8">
                <TableContainer component={Paper} className="ou-mb-5">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>{t('doctor-schedule:time')}</TableCell>
                                {daysOfSelectedWeek.map((day, index) => (
                                    <TableCell key={index} className='!ou-text-center'>
                                        <span className='ou-font-bold'>{days[index]}</span>
                                        <br />
                                        <span>({day})</span>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sessions.map((session) => (
                                <TableRow key={session}>
                                    <TableCell>
                                        {t(`doctor-schedule:${session}`)}
                                    </TableCell>
                                    {currentWeekDates.map((date, index) => (
                                        <TableCell key={index} className='!ou-text-center'>
                                            {renderCheckbox(date, session)}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {doctor.role === ROLE_DOCTOR && (
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
                            <Button 
                                type="submit" 
                                variant="contained" 
                                color={hasExistingSchedule ? "primary" : "success"}
                                disabled={isLoading}
                            >
                                {t(hasExistingSchedule ? 'common:update' : 'common:submit')}
                            </Button>
                        </Box>
                    )}
                </TableContainer>
            </form>
        </Box>
    );
};

export default DoctorScheduleForm;