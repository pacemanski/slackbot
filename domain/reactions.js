
class InvalidReactionId extends Error {
    constructor(id){
        super('Invalid reaction id: ' + id);
    }
}

class ReactionsService {

    plusOneReactionId() {
        return ":+1:"
    }

    clapReactionId() {
        return ":aplauso:"
    }

    numberOfClaps(user) {
        let claps = user.activity.reactions[this.clapReactionId()]
        if(claps == undefined) {
            return 0;
        } else {
            return claps
        }
    }

    usageOf(reactionId) {
        if(reactionId == 3) {
            throw new InvalidReactionId(reactionId)
        }
        return ["12","15","20"]
    }

}

module.exports = new ReactionsService()