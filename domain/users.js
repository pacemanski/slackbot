const dao = require('./persistence/users_dao');
const reactionsService = require('./reactions')

class InvalidUserId extends Error {
    constructor(id){
        super('Invalid user id: ' + id);
    }
}

class UserService {

    // As Slack connection is not working
    simulateEventsForTesting() {
        this.onNewUser(10)
        this.onNewUser(15)
        this.onNewUser(20)
        this.onNewUser(25)

        for (let i =0; i <= 11; i++) {
            this.onChannelCall(10)
        }

        var longMessage = ''
        for (let i =0; i <= 520; i++) {
            longMessage = longMessage + ' DO'
        }
        this.onMessageSent(15,longMessage)
        this.onMessageSent(15,longMessage)
        this.onMessageSent(15,longMessage)
        this.onMessageSent(15,longMessage)

        this.onMessageSent(20,'just three words')
        this.onMessageSent(20,'just three words')
        this.onMessageSent(20,'just three words')
        this.onMessageSent(20,'just three words')

        for (let i =0; i <= 22; i++) {
            this.onReaction(20,reactionsService.plusOneReactionId())
        }

        this.onReaction(10, reactionsService.clapReactionId())
        this.onReaction(10, reactionsService.clapReactionId())
        this.onReaction(15, reactionsService.clapReactionId())
        this.onReaction(15, reactionsService.clapReactionId())
        this.onReaction(15, reactionsService.clapReactionId())
        this.onReaction(20, reactionsService.clapReactionId())
        this.onReaction(20, reactionsService.clapReactionId())
        this.onReaction(20, reactionsService.clapReactionId())
        this.onReaction(20, reactionsService.clapReactionId())
    }

    onNewUser(userId) {
        dao.save(this.createUser(userId))
    }

    createUser(userId) {
        return {
            userId:userId,
            activity: {
                wallOfTexts : 0,
                channelCalls : 0,
                reactions: {}
            }
        }
    }

    onChannelCall(userId) {
        let user = this.getUser(userId)
        user.activity.channelCalls = user.activity.channelCalls + 1
        dao.update(user)
    }

    onReaction(userId,reactionId) {
        let user = this.getUser(userId)
        if(user.activity.reactions[reactionId] == undefined) {
            user.activity.reactions[reactionId] = 1
        } else {
            user.activity.reactions[reactionId] = user.activity.reactions[reactionId] + 1
        }
        dao.update(user)
    }

    onMessageSent(userId,message) {
        if(this.countWords(message) > 500) {
            let user = this.getUser(userId)
            user.activity.wallOfTexts = user.activity.wallOfTexts + 1
            dao.update(user)
        }
    }

    countWords(string) {
        const pattern = /[^\s]+(?=\s*)/g
        return string.match(pattern).length
    }

    findClappers(top) {
        return dao.getAll()
            .filter(function (a) {
                return reactionsService.numberOfClaps(a) != 0
            })
            .sort(function(a,b) {
                if(reactionsService.numberOfClaps(a) > reactionsService.numberOfClaps(b)) {
                    return -1;
                } else {
                    return 1;
                }
            })
            .slice(0,top)
    }

    findClappers2(top) {
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

    getUser(userId) {
        var user = dao.get(userId)
        if(user == undefined) {
            throw new InvalidUserId(userId)
        }
        return user
    }

}

module.exports = new UserService()