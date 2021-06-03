import axios from 'axios';

const baseUrl = "http://localhost:31286/api/";

export default {
    dGuest(url = baseUrl + 'guest/') {
        return {
            fetchAll: () => axios.get(url),
            fetchById: id => axios.get(url + id),
            create: newRecord => axios.post(url, newRecord),
            update: (id, updateRecord) => axios.put(url + id, updateRecord),
            delete: id => axios.delete(url + id)
        }
    },
    Admin(url = baseUrl + 'admin/') {
        return {
            fetchAdmin: () => axios.get(url)
        }
    }
}