const sqlite3 = require("sqlite3").verbose();

const dbname = "Management_System";
// 创建并连接一个数据库
const db = new sqlite3.Database(dbname);

// 创建一个user表   id:INTEGER PRIMARY KEY(自增长数值)； user、password：TEXT（文本字符串）
db.serialize(() => {
    const sql = `
        CREATE TABLE IF NOT EXISTS userList
        (id INTEGER PRIMARY KEY,user TEXT,password TEXT,user_group TEXT)
    `;
    // 如果没有userList表,创建一个
    db.run(sql);
});

// userList API
class userList {
    // 获取所有用户
    static login(data,cb) {
        // 使用sqlite3的all
        db.all("SELECT password FROM userList WHERE user = ?", data.user, cb);
    }
    // 获取所有用户
    static all(cb) {
        // 使用sqlite3的all
        db.all("SELECT * FROM userList", cb);
    }
    // 根据用户名 获取用户id
    static find(user, cb) {
        // 使用sqlite3的get
        db.get("SELECT id FROM userList WHERE user = ?", user, cb);
    }
    // 添加一个用户
    static create(data, cb) {
        const sql = `
                INSERT INTO 
                userList(user,password) 
                VALUES(?,?) 
                ;select last_insert_rowid();`;
        db.run(sql, data.user, data.password, cb);
    }
    // 删除一个用户
    static delete(id, cb) {
        if (!id) return cb(new Error(`缺少参数id`));
        db.run("DELETE FROM userList WHERE id=?", id, cb);
    }
    // 更改用户账户密码
    static update(data, cb) {
        const sql = `
            UPDATE userList
            SET user=?,password=?
            WHERE id=?
        `;
        db.run(sql, data.user, data.password, data.id, cb);
    }
}
module.exports.userList = userList;
