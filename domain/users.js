const dao = require('./persistence/users_dao');
const reactionsService = require('./reactions')

class InvalidUserId extends Error {
    constructor(id){
        super('Invalid user id: ' + id);
    }
}

class UserService {

    getUser(userId) {
        let user = dao.get(userId)
        if(user == undefined) {
            throw new InvalidUserId(userId)
        }
        return user
    }

    onChannelCall(userId) {
        let user = this._getAndOrCreate(userId)
        user.activity.channelCalls = user.activity.channelCalls + 1
        dao.update(user)
    }

    onReaction(userId,reactionId) {
        let user = this._getAndOrCreate(userId)
        if(user.activity.reactions[reactionId] == undefined) {
            user.activity.reactions[reactionId] = 1
        } else {
            user.activity.reactions[reactionId] = user.activity.reactions[reactionId] + 1
        }
        dao.update(user)
    }

    onMessageSent(userId,message) {
        if(this._countWords(message) > 500) {
            let user = this._getAndOrCreate(userId)
            user.activity.wallOfTexts = user.activity.wallOfTexts + 1
            dao.update(user)
        }
    }

    findClappers(top) {
        return dao.getAll()
            .filter(function (user) {
                return reactionsService.numberOfClaps(user) != 0
            })
            .sort(function(userA,userB) {
                if(reactionsService.numberOfClaps(userA) > reactionsService.numberOfClaps(userB)) {
                    return -1;
                } else {
                    return 1;
                }
            })
            .slice(0,top)
    }

    classify(userId) {
        let user = this.getUser(userId);
        let activity = user.activity;
        if(activity.channelCalls > 10) {
            return "VOICE_OF_THE_CROWD"
        } else if (activity.wallOfTexts > 3){
            return "TRYING_TO_CONVINCE_YOU"
        } else if (activity.reactions[reactionsService.plusOneReactionId()] != undefined
                    && activity.reactions[reactionsService.plusOneReactionId()] > 20) {
            return "YES_TO_EVERYTHING"
        }
        return "JUST_NORMAL_GUY"
    }

    // --------------------------
    // PRIVATE METHODS

    _getAndOrCreate(userId) {
        let user = dao.get(userId)
        if(user == undefined) {
            let newUser = this._createUser(userId)
            dao.save(newUser)
            return newUser
        }
        return user
    }

    _createUser(userId) {
        return {
            userId:userId,
            activity: {
                wallOfTexts : 0,
                channelCalls : 0,
                reactions: {}
            }
        }
    }

    _countWords(string) {
        const pattern = /[^\s]+(?=\s*)/g
        return string.match(pattern).length
    }


}

module.exports = new UserService()