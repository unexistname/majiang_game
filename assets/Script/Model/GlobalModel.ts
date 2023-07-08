import { Combine } from "../Util/Combine";
import UserModel from "../Room/UserModel";

export default class GlobalModel {
    @Combine
    userModel: UserModel = null;
}