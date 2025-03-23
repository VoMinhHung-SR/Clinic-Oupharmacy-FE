import {Assignment, Accessibility, PersonAddAlt1, AssignmentTurnedIn} from '@mui/icons-material'
import { useContext } from 'react'
import BookingContext from '../../../../lib/context/BookingContext'
import clsx from 'clsx'
const BookingProcess = () => {
    const {state} = useContext(BookingContext)
    return (
        <ul className='ou-booking-progress-bar'>
            <li>
                <p className={clsx('ou-booking-progress-object',{
                  'ou-booking-progress-object__active': state >= 1})}>
                    <PersonAddAlt1 fontSize='medium'/>
                </p>
            </li>
            <li>
                <p className={clsx('ou-booking-progress-object',{
                  'ou-booking-progress-object__active': state >= 2})}>
                    <Accessibility fontSize='medium'/>
                </p>
            </li>
            <li>
                <p className={clsx('ou-booking-progress-object',{
                  'ou-booking-progress-object__active': state >= 3})}>
                    <Assignment fontSize='medium'/>
                </p>
            </li>
            <li>
                <p className={clsx('ou-booking-progress-object',{
                  'ou-booking-progress-object__active': state >= 4})}>
                    <AssignmentTurnedIn fontSize='medium'/>
                </p>
            </li>
        </ul>
    )
}

export default BookingProcess