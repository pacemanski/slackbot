
class DuplicatedReaction extends Error {
    constructor(id){
        super('There is an user with id: ' + id + ' already');
    }
}

class ReactionsDAO {

    store = {}

    save(reaction) {
        if(this.store[reaction.reactionId] != undefined){
            throw new DuplicatedReaction
        }
        this.store[reaction.reactionId] = reaction
    }

    get(reactionId) {
        return this.store[reactionId]
    }

}

module.exports = new ReactionsDAO()