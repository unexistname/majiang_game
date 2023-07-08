

export default class UserModel {
    userId: string = "";
    userName: string = "";
    headImgUrl: string = "";
    coins: number = 0;
    gems: number = 0;
    sex: number = 0;

    isMale() {
        return this.sex == 1;
    }

    isFamale() {
        return this.sex == 0;
    }
}