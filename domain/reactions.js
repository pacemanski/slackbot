const usersDao = require('./persistence/users_dao');

class ReactionsService {

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