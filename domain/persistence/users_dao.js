
class DuplicatedUser extends Error {
    constructor(id){
        super('There is an user with id: ' + id + ' already');
    }
}

class UsersDAO {

    store = {}

    save(user) {
        if(this.store[user.userId] != undefined){
            throw new DuplicatedUser
        }
        this.store[user.userId] = user
    }

    update(user) {
        this.store[user.userId] = user
    }

    get(userId) {
        return this.store[userId]
    }

    getAll() {
        return Object.values(this.store)
    }

}

module.exports = new UsersDAO()