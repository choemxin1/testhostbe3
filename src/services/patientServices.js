import db from "../models/index";
require('dotenv').config();
import emailService from './emailService';
import { v4 as uuidv4 } from 'uuid';

let buildUrlEmail = (doctorId, token) => {
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`
    return result;
}


let postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId ||
                !data.timeType || !data.date || 
                !data.fullName || !data.selectedGender
                || !data.address) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            }
            else {
                let token = uuidv4();
                console.log('check token',token)
                data.link = buildUrlEmail(data.doctorId, token);
                await emailService.sendSimpleEmail(data);

                let [user, isCreated] = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: { email: data.email, 
                        roleId: 'R3',
                        gender:data.selectedGender,
                        address: data.address,
                        firstName : data.fullName
                     },
                     
                });
                console.log('»» hoi dan it check user  date: ', user) //create it :rd if (user && user[0]) { await db.Booking.findOrCreate({ 
                if (user) {
                    await db.Booking.findOrCreate({
                        where: { patientId: user.id },
                        defaults: {
                            statusId: 'S1',
                            doctorId: data.doctorId,
                            patientId: user.id,
                            date: data.date,
                            timeType: data.timeType,
                            token: token
                        }
                    })
                }
                let abc = await db.Booking.findOne({
                    where: { patientId: user.id }
                })
                console.log('check date từ sever', abc)
                resolve({
                    errCode: 0, errMessage: 'Save infor patient succeed,'
                })
            }
        } catch (error) {
            console.log('Error : ', error)
            reject(error);
        }
    })
}
let checksendEmail = async (data) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports 
        auth: {
            user: 'nhat.nguyen1235813@hcmut.edu.vn', // generated ethereal user 
            pass: 'mimnxulcnhpwbszk', // generated ethereal passwo 
        },
    });;
    // send mail with defined transport object 
    let info = await transporter.sendMail({
        from: '"Bệnh viện đa khoa" <nhat.nguyen1235813@hcmut.edu.vn>', // sender address 
        to: `${data.email}`, // list of receivers 
        subject: "Hello ✓", // Subject line 

        html: `<h3>Bệnh viện đa khoa quốc tế PS </h3>

    <p>Chào mừng bạn đến với bệnh viện đa khoa quốc tế PS.</p>
    <p> Thân gửi ${data.fullName},</p>
    <p>Bạn đã đăng ký đặt lịch khám bệnh thành công.</p>
    
    
    <p><b>Nội dung đặt lịch khám bệnh:</b></p>
    
    <p><b>1. Thông tin bệnh nhân:</b></p>
    
    <div>Họ và tên: ${data.fullName}</div>
    <div>Ngày sinh: ${moment(data.date).format('DD/MM/YYYY')}</div>
    <div>Giới tính: ${data.selectedGender}</div>
    <div>Số điện thoại: ${data.phoneNumber}</div>
    <div>Email: ${data.email}</div>
    <div>Địa chỉ: ${data.address}</div>
    <div><b>2. Chuyên khoa: Da liễu
    
    <div><b>3. Bác sĩ: ${data.nameEn}</b></div>
    
    <div><b>4. Ngày khám:   ${moment(data.time.date).locale('vi').format('dddd-DD/MM/YYYY')}</b></div>
    
    <div><b>5. Giờ khám: ${data.time.valueVi}</b></div>
    
    <div><b>6. Lý do khám: ${data.reason}</b></div>
    
    <div> <b>7. Ghi chú: (Có thể bỏ qua nếu không có)</b></div>
    
    
    
    <div><b>8. Xác nhận:</b></div>
    
    Tôi đã đọc và đồng ý với các quy định của bệnh viện. Tôi cam đoan rằng thông tin cung cấp là chính xác.
    
    Ký tên:
    
    Nguyễn Văn A
    <div><b><a href=${data.link} target="_blank">Click here</a></b></div>
   
    
    <div><b>9. Kênh đặt lịch:</b></div>
    
    
    
    Email: abc@gmail.com ", // html body IN. 
    Địa chỉ: Số 458 Minh Khai, Hai Bà Trưng, Hà Nội
    
    Website: https://www.ps.com/
    
    Hotline: 0xx xxxx xxxx`
    })
}
let postVerifyBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.token || !data.doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            }
            else {
               
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        token: data.token,
                        statusId: 'S1'
                    },
                    raw: false
                }
                )
                if (appointment) {
                    appointment.statusId = 'S2'
                    await appointment.save();
                    resolve({
                        errCode: 0,
                        errMessage: 'Update the appoint succeed'
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Appoint is not exist or has been activated'
                    })
                }
            }
        } catch (error) {
            console.log('Error : ', error)
            reject(error);
        }
    }
    )
}
module.exports = {
    postBookAppointment: postBookAppointment,
    postVerifyBookAppointment: postVerifyBookAppointment
}