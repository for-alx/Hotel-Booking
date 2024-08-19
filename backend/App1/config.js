import dotenv from "dotenv"

dotenv.config()

export default {
    PORT: process.env.PORT || 5000,
    MONGODB_URL: process.env.MONGODB_URL || "mongodb://localhost:27017/test2",
    JWT_SECRET: process.env.JWT_SECRET || "12345678",
    CHAPA_S_KEY: process.env.CHAPA_S_KEY || "CHASECK_TEST-Ag3A2p7ENjlUATWyRBHgpC5LmevIjRnv",
    CHAPA_P_KEY: process.env.CHAPA_P_KEY || "CHAPUBK_TEST-lVUfN2URiqgEn3UulEhXAZs3laRHEsKM",
    CHAPA_E_KEY: process.env.CHAPA_E_KEY || "Xy0LtDJx2bCB0B0hcW85NRom",
    ALLOWED_ORIGINS: ["http://192.168.1.1:5000", "http://localhost:5000" ,"http://192.168.1.1:3000", "http://localhost:3000"]
}
