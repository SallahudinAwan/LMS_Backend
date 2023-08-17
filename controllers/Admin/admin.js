const mysql = require("mysql2");
const fs = require("fs");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "awansallahudin",
  database: "lms",
});

module.exports.signIn = (req, res) => {
  const { username, password } = req.body;
  const sqlSignin = "select * from admin where username = ?";
  db.query(sqlSignin, [username], (err, data) => {
        if (data && data[0]) {
          if (data[0].password === password) {
            res.send({ code: 200, message: "Successfully Login" });
          } else {
            res.send({ code: 100, message: "Password Incorrect" });
          }
        } else {
          res.send({ code: 300, message: "User Not Exist" });
        } 
  });
};

module.exports.getAlluserData = (req, res) => {
  const sqlAlldataRetrievel = "select * from lmsuser ORDER BY ID DESC";
  db.query(sqlAlldataRetrievel, (err, data) => {
    if (err) {
      res.send({ code: 100, message: "NOT SUCCESSFULL, Server Error" });
    } else {
      data.forEach((d) => {
        if (d["avatar"]) {
          const base64 = fs.readFileSync(d["avatar"], "base64");
          d["avatar"] = "data:image/png;base64," + base64;
        }
      });
      res.send(data);
    }
  });
};

module.exports.findUserbyID = (req, res) => {
  const { id } = req.body;
  const sqlinsert = "select * from lmsuser where ID= ?";
  db.query(sqlinsert, [id], (err, data) => {
    if (err) {
      res.send({ code: 100, message: "NOT SUCCESSFULL, Server Error" });
    } else {
      if (data[0]["avatar"]) {
        const base64 = fs.readFileSync(data[0]["avatar"], "base64");
        data[0]["avatar"] = "data:image/png;base64," + base64;
      }
      res.send(data[0]);
    }
  });
};

module.exports.deleteuser = (req, res) => {
  const { id } = req.body;
  const sqlinsert1 = "select * from lmsuser where ID= ? ";
  const sqlinsert = "DELETE from lmsuser where ID= ? ";
  db.query(sqlinsert1, [id], (err, data1) => {
     db.query(sqlinsert, [id], (err, data) => {
       if (data1[0].avatar) {
            var va = "./images/" + id + ".png";
            fs.unlinkSync(va);
            res.send({ code: 200, message: "Successfully Deleted" });
          } else {
            res.send({ code: 200, message: "Successfully Deleted" });
          }
      });
  });
};

module.exports.edituser = (req, res) => {
  const { id, firstname, lastname, avatar, email, phoneno, gender } = req.body;
  var filePath = "";
  var val = 0;
  const sqlFindQuery = "select * from lmsuser where ID= ? ";
  db.query(sqlFindQuery, [id], (err, data1) => {
    if (data1[0].avatar) {
      val = 1;
    }
  });
  if (val) {
    fs.unlinkSync("./images/" + id + ".png");
  }
  
  if (avatar) {
    let position = avatar.search(",");
    let result = avatar.slice(position + 1);
    let buff = Buffer.from(result, "base64");
    filePath = "./images/" + id + ".png";
    fs.writeFileSync(filePath, buff);
  }
  const sqlUpdate =
    "UPDATE `lms`.`lmsuser` SET `firstname` = ?, `lastname` = ? , `avatar` = ?,`email` =?,`phoneno` = ?, `gender` = ? WHERE `ID` =?;";
  db.query(
    sqlUpdate,
    [firstname, lastname, filePath, email, phoneno, gender, id],
    (err, data) => {
      if (err) {
        res.send({ code: 100, message: "NOT Edited SUCCESSFULL" });
      } else {
        res.send({ code: 200, message: "Successfully Data Entered" });
      }
    }
  );
};


module.exports.adduser = (req, res) => {
  const { firstname, lastname, avatar, email, phoneno, gender } = req.body;
  var filepath = "";
  const sqlinsert ="INSERT INTO lmsuser ( firstname,lastname,avatar,email,phoneno,gender) VALUES (?,?,?,?,?,?)";
  db.query(
    sqlinsert,
    [firstname, lastname, filepath, email, phoneno, gender],
    (err, data) => {
        if (avatar) {
          const sqlinsert ="UPDATE `lms`.`lmsuser` SET  `avatar` =? WHERE `ID` =?;"
          var newId=data.insertId;
          db.query(sqlinsert, ["./images/"+newId+".png", newId], (err, data) => {
            if (err) {
              res.send({ code: 100, message: "NOT Edited SUCCESSFULL" });
            } else {
              res.send({code: 200, message: newId });
            }
          });
        } else {
          res.send({ code: 200, message: "Successfully Data Entered" });
        }
    }
  );
};
