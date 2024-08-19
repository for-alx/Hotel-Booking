import RoomBooking from "../models/RoomBooking.js"
import Room from "../models/Room.js"
import Payment from "../models/Payment.js"
import CustomAPIError from "../errors/index.js"
import { StatusCodes } from "http-status-codes"
import { initiatePayment } from "../utils/payment.js"

// Utility functions
const isRoomAvailable = async (roomId, checkInDate, checkOutDate) => {
    const overlappingBookings = await RoomBooking.find({
        room: roomId,
        $or: [
            {
                checkIn: { $lt: checkOutDate },
                checkOut: { $gt: checkInDate }
            }
        ],
        status: { $nin: ["canceled", "checkedOut"] }
    })

    return overlappingBookings.length === 0
}


const listAvailableRooms = async (checkInDate, checkOutDate) => {
    // this variable is used to reduce backend exposure
    const availability = {
        availableStyles: [],
        availableRoom: []
    }
    const availableRooms = []
    const allRoom = await Room.find({status: {$nin: ["beingServiced", "notAvailable", ]}}, {createdAt: 0, updatedAt: 0, __v: 0})

    for (const room of allRoom) {
        const available = await isRoomAvailable(room._id, checkInDate, checkOutDate)
        if (available) {
            if (!availability.availableStyles.includes(room.style)) {
                availability.availableStyles.push(room.style)
                availability.availableRoom.push(room)
            }
            availableRooms.push(room)
        }
    }

    return { availableRooms, availability }
}

const dayRange = async (checkIn, checkOut) => {
    const difference = Math.abs(checkOut - checkIn)
    const range = Math.ceil(difference / (1000 * 3600 * 24))
    return range
}
// Utility functions end


const createBooking = async (req, res) => {
    // Not completed yet
    const { roomId } = req.params
    let { checkInDate, checkOutDate } = req.body

    if (!roomId || !checkInDate || !checkOutDate) {
        throw new CustomAPIError.BadRequest("Please provide information properly")
    }

    try {
        checkInDate = new Date(checkInDate)
        checkOutDate = new Date(checkOutDate)
    } catch (err) {
        throw new CustomAPIError.BadRequest("Unsupported date format")
    }

    const currentDate = new Date()
    currentDate.setHours(0)
    currentDate.setMinutes(0)
    currentDate.setSeconds(0)
    currentDate.setMilliseconds(0)

    if (checkInDate < currentDate) {
        throw new CustomAPIError.BadRequest("Check in date must be equal or greater than current date")
    }

    if (checkInDate > checkOutDate) {
        throw new CustomAPIError.BadRequest("Check in date must be greater than check out date")
    }

    if (checkOutDate < currentDate) {
        throw new CustomAPIError.BadRequest("Check out date must be greater than current date")
    }

    const isRoomExist = await Room.findById(roomId)

    if (!isRoomExist) {
        throw new CustomAPIError.BadRequest("Room doesn't exist please try again")
    }

    const RoomAvailable = await isRoomAvailable(isRoomExist._id, checkInDate, checkOutDate)

    if (!RoomAvailable) {
        throw new CustomAPIError.BadRequest("Room not available for this day try another day")
    }

    const newBooking = new RoomBooking({
        user: req?.user?.user?.userId,
        room: isRoomExist._id,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        durationInDays: await dayRange(checkInDate, checkOutDate),
        status: "requested",
    })

    const paymentDetail = new Payment({
        booking: newBooking._id,
        price: isRoomExist.bookingPrice
    })

    let paymentURL
    try {
        paymentURL = await initiatePayment(isRoomExist.bookingPrice, req.user.user, String(paymentDetail._id), String(newBooking._id))
        paymentURL = JSON.parse(paymentURL)
    } catch (err) {
        console.log("Payment initialization error: ", err)
        throw new CustomAPIError.BadRequest("Something went wrong please try again later")
    }

    paymentDetail.checkOutURL = paymentURL?.data?.checkout_url

    await paymentDetail.save()
    await newBooking.save()

    res.status(StatusCodes.OK).json({ success: true, msg: "Redirected to payment gateway...", data: {paymentURL: paymentURL?.data?.checkout_url } })
}

const checkAvailability = async (req, res) => {
    let { checkInDate, checkOutDate, numberOfAdult, numberOfChild } = req.body

    if (!checkInDate || !checkOutDate) {
        throw new CustomAPIError.BadRequest("Please provide information properly")
    }

    try {
        checkInDate = new Date(checkInDate)
        checkOutDate = new Date(checkOutDate)
    } catch (err) {
        throw new CustomAPIError.BadRequest("Unsupported date format")
    }

    const currentDate = new Date()
    currentDate.setHours(0)
    currentDate.setMinutes(0)
    currentDate.setSeconds(0)
    currentDate.setMilliseconds(0)

    if (checkInDate < currentDate) {
        throw new CustomAPIError.BadRequest("Check in date must be equal or greater than current date")
    }

    if (checkInDate > checkOutDate) {
        throw new CustomAPIError.BadRequest("Check in date must be greater than check out date")
    }

    // availableRooms contains all available rooms
    // availability holds only one for each room type
    const { availableRooms, availability } = await listAvailableRooms(checkInDate, checkOutDate)

    if (availableRooms.length === 0) {
        res.status(StatusCodes.OK).json({ success: false, msg: "Room not available." })
    }

    res.status(StatusCodes.OK).json({ success: true, data: availability })
}

const bookingHistory = async (req, res) => {
    let history = []
    const booking = await RoomBooking.find({ user: req.user.userId}, { __v: 0, startDate: 0, updatedAt: 0, user: 0 }).populate("room", { roomNumber: 1 })

    for (const book of booking) {
        const payment = await Payment.findOne({ booking: book._id }, { status: 1, price: 1 })
        history.push({ ...book._doc, "payment": { ...payment._doc } })
    }

    res.status(StatusCodes.OK).json({ success: true, data: history })
}

// For admin dashboard
const getLatestBookings = async (req, res) => {
    const { size } = req.param
    const oneDay = 86400000 * 100
    const currentDate = Date.now()

    const latestBookings = await RoomBooking.find({ startDate: {$gt: currentDate - (oneDay * 100)} }).populate("user", { _id: 1, firstName: 1, lastName: 1, middleName: 1 }).populate("room").sort({ startDate: -1 })
    res.status(StatusCodes.OK).json({ success: true, data: latestBookings })
}

const getBookingInfo = async(req, res) => {
    const { bookingId } = req.params

    if (!bookingId) {
        throw new CustomAPIError.BadRequest("Booking id doesn't exist")
    }

    let bookingInfo = await RoomBooking.findById(bookingId, {createdAt: 0, updatedAt: 0, __v: 0}).populate("user", { _id: 1, firstName: 1, lastName: 1, middleName: 1, email: 1, phone: 1})

    if (!bookingInfo) {
        throw new CustomAPIError.BadRequest("Unknown booking id")
    }

    if (req.user.user?.userId !== String(bookingInfo.user._id)) {
        throw new CustomAPIError.UnauthorizedError("You don't have permission to this booking")
    }

    let roomInfo = await Room.findById(bookingInfo.room, { roomNumber: 1, bookingPrice: 1 }).populate("hotelLocation", { name: 1 })

    res.status(StatusCodes.OK).json({ success: true, data: { ...bookingInfo._doc, room: { ...roomInfo._doc } }})
}


export {
    createBooking,
    checkAvailability,
    bookingHistory,
    getLatestBookings,
    getBookingInfo
}
