
class InvalidReactionId extends Error {
    constructor(id){
        super('Invalid reaction id: ' + id);
    }
}

class ReactionsService {

    usageOf(reactionId) {
        if(reactionId == 3) {
            throw new InvalidReactionId(reactionId)
        }
        return ["12","15","20"]
    }

}

module.exports = new ReactionsService()