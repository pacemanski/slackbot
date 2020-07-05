const usersDao = require('./persistence/users_dao');
const dao = require('./persistence/reactions_dao');

class InvalidReactionId extends Error {
    constructor(id){
        super('Invalid reaction id: ' + id);
    }
}

class ReactionsService {

    simulateCreationForTesting() {
        this.onNewReaction(this.plusOneReactionId())
        this.onNewReaction(this.clapReactionId())
    }

    onNewReaction(reactionId) {
        dao.save({reactionId:reactionId})
    }

    plusOneReactionId() {
        return ":+1:"
    }

    clapReactionId() {
        return ":aplauso:"
    }

    numberOfClaps(user) {
        return this.numberOfReactions(user,this.clapReactionId())
    }

    numberOfReactions(user,reactionId) {
        let claps = user.activity.reactions[reactionId]
        if(claps == undefined) {
            return 0;
        } else {
            return claps
        }
    }

    usageOf(reactionId) {
        if(dao.get(reactionId) == undefined) {
            throw new InvalidReactionId(reactionId)
        }
        let self = this
        return usersDao.getAll().filter(function (user) {
                    return self.numberOfReactions(user,reactionId) > 0
                }).map(function (user) {
                    return {
                        userId: user.userId,
                        times: self.numberOfReactions(user,reactionId)
                    }
                })
    }

}

module.exports = new ReactionsService()