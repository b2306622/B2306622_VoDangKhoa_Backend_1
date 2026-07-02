const { ObjectId } = require("mongodb");

class ContactService {
    constructor(client) {
        this.Contact = client.db().collection("contacts");
    }

    extractContactData(payload) {
        const contact = {
            name: payload.name,
            email: payload.email,
            address: payload.address,
            phone: payload.phone,
            favorite: payload.favorite,
        };

        Object.keys(contact).forEach(
            (key) => contact[key] === undefined && delete contact[key]
        );

        return contact;
    }

    // Thêm contact
    async create(payload) {
        const contact = this.extractContactData(payload);

        return await this.Contact.findOneAndUpdate(
            contact,
            {
                $set: {
                    favorite: contact.favorite === true,
                },
            },
            {
                returnDocument: "after",
                upsert: true,
            }
        );
    }

    // Lấy tất cả contact
    async find(filter) {
        return await this.Contact.find(filter).toArray();
    }

    // Tìm theo tên
    async findByName(name) {
        return await this.find({
            name: {
                $regex: new RegExp(name),
                $options: "i",
            },
        });
    }

    // Tìm theo ID
    async findById(id) {
        return await this.Contact.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    // Cập nhật
    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };

        const update = this.extractContactData(payload);

        return await this.Contact.findOneAndUpdate(
            filter,
            {
                $set: update,
            },
            {
                returnDocument: "after",
            }
        );
    }

    // Xóa một contact
    async delete(id) {
        return await this.Contact.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    // Xóa tất cả
    async deleteAll() {
        const result = await this.Contact.deleteMany({});
        return result.deletedCount;
    }

    // Danh sách yêu thích
    async findFavorite() {
        return await this.find({
            favorite: true,
        });
    }
}

module.exports = ContactService;