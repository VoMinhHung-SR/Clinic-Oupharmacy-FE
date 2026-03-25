// API: GET /prescribing/{prescribingId}/get-pres-detail/
// EX: PrescriptionID = 1
export const samplePrescriptionDetailByPrescribingId =  [
//     {
//         "id": 1,
//         "prescribing": {
//             "id": 1,
//             "bill_status": {
//                 "id": 1,
//                 "amount": 485000.0
//             },
//             "created_date": "2023-02-22T04:45:05.163528+07:00",
//             "updated_date": "2023-02-22T04:45:05.163586+07:00",
//             "active": true,
//             "diagnosis": 1,
//             "user": 2
//         },
//         "medicine_unit": {
//             "id": 2,
//             "price": 28000.0,
//             "in_stock": 99,
//             "packaging": "Bottle",
//             "medicine": {
//                 "id": 2,
//                 "name": "Bổ phế Nam Hà chỉ khái lộ (Chai 125ml)",
//                 "effect": "Chữa ho tiêu đờm, chuyên trị ho cảm, ho gió, ho khan, viêm phế quản",
//                 "contraindications": "Mẫn cảm với bất cứ thành phần nào của thuốc."
//             },
//             "category": {
//                 "id": 1,
//                 "name": "Thực phẩm chức năng"
//             },
//             "image_path": "https://res.cloudinary.com/dl6artkyb/dtqpybvdwwcna74ovnvn"
//         },
//         "created_date": "2023-02-22T04:45:05.489822+07:00",
//         "updated_date": "2023-02-22T04:45:05.489851+07:00",
//         "active": true,
//         "quantity": 3,
//         "uses": "2"
//     },
//     {
//         "id": 2,
//         "prescribing": {
//             "id": 1,
//             "bill_status": {
//                 "id": 1,
//                 "amount": 485000.0
//             },
//             "created_date": "2023-02-22T04:45:05.163528+07:00",
//             "updated_date": "2023-02-22T04:45:05.163586+07:00",
//             "active": true,
//             "diagnosis": 1,
//             "user": 2
//         },
//         "medicine_unit": {
//             "id": 1,
//             "price": 127000.0,
//             "in_stock": 99,
//             "packaging": "Box",
//             "medicine": {
//                 "id": 1,
//                 "name": "Acritel 10g (Hộp 6 vỉ x 10 viên)",
//                 "effect": "Điều trị viêm mũi dị ứng theo mùa và viêm mũi dị ứng kinh niên, mày đay vô căn mạn tính",
//                 "contraindications": "Mẫn cảm với levocetirizin, cetirizin, bất kỳ dẫn xuất hydroxyzin hoặc piperazin nào hoặc bất kỳ thành phần nào của thuốc."
//             },
//             "category": {
//                 "id": 2,
//                 "name": "Thuốc kê đơn"
//             },
//             "image_path": "https://res.cloudinary.com/dl6artkyb/ykli50tu9dehgcsr9ydj"
//         },
//         "created_date": "2023-02-22T04:45:05.623496+07:00",
//         "updated_date": "2023-02-22T04:45:05.623523+07:00",
//         "active": true,
//         "quantity": 3,
//         "uses": "2"
//     }
// ]
// NEW PAYLOAD FROM STORE
    {
        "id": 273,
        "prescribing": {
            "id": 43,
            "bill_status": null,
            "created_date": "2026-03-25T23:23:52.943318+07:00",
            "updated_date": "2026-03-25T23:23:52.943350+07:00",
            "active": true,
            "diagnosis": 37,
            "user": 20
        },
        "product_variant": {
            "id": 20760,
            "product_id": 6892,
            "product": {
                "id": 6892,
                "name": "Thuốc Acenocoumarol 4 SPM điều trị và ngăn ngừa bệnh nghẽn mạch (3 vỉ x 10 viên)",
                "web_name": "Thuốc Acenocoumarol 4 SPM điều trị và ngăn ngừa bệnh nghẽn mạch (3 vỉ x 10 viên)"
            },
            "packing": "Hộp 3 Vỉ x 10 Viên",
            "price_value": 0.0,
            "unit_name": "Hộp",
            "quantity_in_base": 1,
            "in_stock": 265,
            "category": {
                "id": 202,
                "name": "Thuốc chống đông máu"
            }
        },
        "product_variant_unit": {
            "id": 16637,
            "product_id": 6892,
            "product": {
                "id": 6892,
                "name": "Thuốc Acenocoumarol 4 SPM điều trị và ngăn ngừa bệnh nghẽn mạch (3 vỉ x 10 viên)",
                "web_name": "Thuốc Acenocoumarol 4 SPM điều trị và ngăn ngừa bệnh nghẽn mạch (3 vỉ x 10 viên)"
            },
            "packing": "Hộp 3 Vỉ x 10 Viên",
            "price_value": 0.0,
            "unit_name": "Hộp",
            "quantity_in_base": 1,
            "in_stock": 265,
            "category": {
                "id": 202,
                "name": "Thuốc chống đông máu"
            },
            "price_display": "CONSULT",
            "unit_order": 0,
            "is_default": true,
            "is_published": true
        },
        "created_date": "2026-03-25T23:23:53.356284+07:00",
        "updated_date": "2026-03-25T23:23:53.356307+07:00",
        "active": true,
        "quantity": 1,
        "uses": "1",
        "product_id": 6892,
        "product_variant_id": 20760,
        "product_variant_unit_id": 16637,
        "item_name_snapshot": "Thuốc Acenocoumarol 4 SPM điều trị và ngăn ngừa bệnh nghẽn mạch (3 vỉ x 10 viên)",
        "unit_name_snapshot": "Hộp",
        "unit_price_snapshot": "0.00",
        "quantity_in_base_snapshot": 1
    }
]