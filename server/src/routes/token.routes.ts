import { Router } from "express";
import { getTokenChat, getTokenGuest, getTokenUser } from "../controllers/token.controller"


const tokenRouter = Router()

tokenRouter.route("/get-token-user").get(getTokenUser)
tokenRouter.route("/get-token-guest").post(getTokenGuest)
tokenRouter.route("/get-token-chat").post(getTokenChat)

export default tokenRouter