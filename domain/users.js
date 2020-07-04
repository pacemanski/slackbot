
class InvalidUserId extends Error {
    constructor(id){
        super('Invalid user id: ' + id);
    }
}

class UserService {

    findClappers(top) {
        return [
            {
                userId:70,
                times:15
            },
            {
                userId: 80,
                times: 10
            }]
    }

    classify(userId) {
        if(userId == 3) {
            throw new InvalidUserId(userId)
        }
        return "VOICE_OF_THE_CROWD"
    }

}

module.exports = new UserService()