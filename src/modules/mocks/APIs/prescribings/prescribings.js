export const samplePrescribingList = [
    {
    "id": 34,
    "examination": {
        "id": 135,
        "active": true,
        "created_date": "2024-12-07T08:00:00+07:00",
        "updated_date": "2025-08-07T23:51:35.374637+07:00",
        "description": "Demo with bác sĩ userDemo",
        "mail_status": true,
        "user": {
            "id": 123,
            "first_name": "userDemo",
            "last_name": "userDemo",
            "email": "userDemo@gmail.com",
            "phone_number": "0123456789",
            "date_of_birth": "2001-02-27T02:33:10+07:00",
            "locationGeo": {
                "lat": 10.123,
                "lng": 106.123,
                "address": "tp.HCM",
                "district": {
                "id": 13,
                "name": "Quận 12"
                },
                "city": {
                "id": 1,
                "name": "Hồ Chí Minh"
                }
            },
            "date_joined": "2023-06-02T02:29:51+07:00",
            "gender": 0,
            "avatar_path": "https://res.cloudinary.com/dl6artkyb/ftavohbedij5uk7gdqzb",
            "is_admin": false,
            "role": "ROLE_USER"
        },
        "patient": {
            "id": 101,
            "active": true,
            "first_name": "patientDemo",
            "last_name": "patientDemo",
            "phone_number": "0123456789",
            "email": "patientDemo@gmail.ccom",
            "gender": 0,
            "date_of_birth": "2001-12-06T00:00:00+07:00",
            "address": "tp.HCM",
            "user": 19
        },
        "wage": 20000,
        "reminder_email": false,
        "schedule_appointment": {
            "id": 45,
            "day": "2024-12-07",
            "start_time": "09:00:00",
            "end_time": "10:00:00",
            "doctor_id": 20,
            "email": "doctorDemo@gmail.com",
            "first_name": "doctorDemo",
            "last_name": "doctorDemo"
        },
        "diagnosis_info": [
            {
                "id": 34,
                "sign": "chẩn đoán triệu chứng của bác sĩ Thảo với bệnh nhân Hê",
                "diagnosed": "Mắc bênh ABC"
            }
        ]
    },
    "user": {
        "id": 20,
        "first_name": "doctorDemo",
        "last_name": "doctorDemo",
        "email": "doctorDemo@gmail.com",
        "locationGeo": {
        "lat": 10.123,
        "lng": 106.123,
        "district": {
            "id": 13,
            "name": "Quận 12"
        },
        "city": {
            "id": 1,
            "name": "Hồ Chí Minh"
        }
        }
    },
    "patient": {
        "id": 101,
        "active": true,
        "first_name": "patientDemo",
        "last_name": "patientDemo",
        "phone_number": "0123456789",
        "email": "patientDemo@gmail.ccom",
        "gender": 0,
        "date_of_birth": "2001-12-06T00:00:00+07:00",
        "address": "tp.HCM",
        "user": 20
    },
    "prescribing_info": [
        {
        "id": 39,
        "bill_status": null,
        "created_date": "2025-08-07T23:54:49.757587+07:00",
        "updated_date": "2025-08-07T23:54:49.757604+07:00",
        "active": true,
        "diagnosis": 34,
        "user": 20
        }
    ],
    "created_date": "2025-08-07T23:53:57.025339+07:00",
    "updated_date": "2025-08-07T23:53:57.025362+07:00",
    "active": true,
    "sign": "chẩn đoán triệu chứng của bác sĩ Thảo với bệnh nhân Hê",
    "diagnosed": "Mắc bênh ABC"
    }
]