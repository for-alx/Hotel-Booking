import { StatusCodes } from "http-status-codes"
import CustomAPIError from "../errors/index.js"
import Room from "../models/Room.js"
import HotelLocation from "../models/HotelLocation.js"

const availableStyles = ["standard", "deluxe", "family", "business"]
const availableStatus = ["available", "reserved", "occupied", "notAvailable", "beingServiced", "other"]

const createRoom = async (req, res) => {
    let { hotelLocation, roomNumber, style, bookingPrice, isSmoking } = req.body

    console.log("Debug info: ", hotelLocation, roomNumber, style, bookingPrice, isSmoking);

    if (!roomNumber || !hotelLocation || !style || !bookingPrice) {
        throw new CustomAPIError.BadRequest("Please provide registration information properly")
    }

    style = String(style).toLocaleLowerCase()

    if (!availableStyles.includes(style)) {
        throw new CustomAPIError.BadRequest("Style doesn't exist")
    }

    const hotelLoc = await HotelLocation.findById(hotelLocation)
    if (!hotelLoc) {
        throw new CustomAPIError.BadRequest("Hotel doesn't exist")
    }

    const existingRoom = await Room.findOne({ roomNumber: roomNumber })
    if ( existingRoom ) {
        throw new CustomAPIError.BadRequest("Room number already exists")
    }

    const newRoom = new Room({
        hotelLocation: hotelLoc._id,
        roomNumber: roomNumber,
        style: style,
        bookingPrice: bookingPrice,
        isSmoking: isSmoking ? true : false 
    })

    await newRoom.save()

    res.status(StatusCodes.OK).json({ success: true, msg: "Room created successfully", data: { newRoom } })
}


const editRoom = async (req, res) => {
    const { roomId } = req.params
    let { roomNumber, style, bookingPrice, status, isSmoking } = req.body

    if (!roomNumber || !style || !bookingPrice || !status) {
        throw new CustomAPIError.BadRequest("Please provide information properly")
    }

    style = String(style).toLocaleLowerCase()

    if (!availableStyles.includes(style)) {
        throw new CustomAPIError.BadRequest("Style doesn't exist")
    }
    
    status = String(status).toLocaleLowerCase()
    console.log(roomId, roomNumber, style, bookingPrice, status, isSmoking);
    if (!availableStatus.includes(status)) {
        throw new CustomAPIError.BadRequest("Status doesn't exist")
    }

    const room = await Room.findById(roomId)
    if (!room) {
        throw new CustomAPIError.BadRequest("Room doesn't exist")
    }
    room.roomNumber = roomNumber
    room.style = style
    room.bookingPrice = bookingPrice
    room.status = status
    room.isSmoking = isSmoking ? true : false

    await room.save()

    res.status(StatusCodes.OK).json({ success: true, msg: "Room updated successfully", data: { room } })
}

const changeStatus = async (req, res) => {
    const { roomId } = req.params
    let { status } = req.body
    
    if (!status) {
        throw new CustomAPIError.BadRequest("Please provide registration information properly")
    }

    status = String(status).toLocaleLowerCase()

    if (!availableStatus.includes(status)) {
        throw new CustomAPIError.BadRequest("Style doesn't exist")
    }

    const room = await Room.findById(roomId)

    if (!room) {
        throw new CustomAPIError.BadRequest("Room doesn't exist")
    }
    
    room.status = status
    await room.save()

    res.status(StatusCodes.OK).json({ success: true, msg: "Room updated successfully", data: { room } })
}


const allRooms = async (req, res) => {
    const allRooms = await Room.find({}, { createdAt: 0, updatedAt: 0, __v: 0 })

    res.status(StatusCodes.OK).json({ success: true, data: {allRooms}})
}


const roomDetail = async (req, res) => {
    const { roomId } = req.params

    const room = await Room.findById(roomId, { createdAt: 0, updatedAt: 0, __v: 0 })

    res.status(StatusCodes.OK).json({ success: true, data: room })
}

// Temporary to this file
const getAllLocation = async (req, res) => {
    const allLocation = await HotelLocation.find({}, {__v: 0, updatedAt: 0})
    res.status(StatusCodes.OK).json({ success: true, data: allLocation })
}

export {
    createRoom,
    editRoom,
    changeStatus,
    allRooms,
    roomDetail,
    getAllLocation
}
