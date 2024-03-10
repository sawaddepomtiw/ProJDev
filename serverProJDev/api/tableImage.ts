import mysql from 'mysql';
import { ImageModel } from '../../src/app/model/getpostputdelete';
import { dbconn, queryPromise } from "../dbconnects";
import express from "express";

export const router = express.Router();

router.get("/select-all", (req, res)=>{
    if (req.query){

        dbconn.query('SELECT * FROM image', (err, result)=>{
            res.status(201).json(result);
        });
    } else {
        res.status(201).send("error!");
    }
});

router.get("/select/:id", (req, res) => {
    let id = req.params.id;
    dbconn.query("SELECT * FROM image WHERE imid = ?" , [id], (err, result) => {
    if (err) throw err;
      res.json(result);
    });
});
router.put("update/:id", (req, res) => {
    let id = +req.params.id;
    let image: ImageModel = req.body;
    let sql = "UPDATE `image` set (`score`, `voteTOTAL` ) WHERE `imid` VALUES (?,?,?)";
    sql = mysql.format(sql, [
        image.score,
        image.voteTOTAL,
        id
    ]);
    dbconn.query(sql, (err, result) => {
      if (err) throw err;
      res
        .status(201)
        .json({ affected_row: result.affectedRows });
    });
  });

  router.put("/:id",async(req, res)=>{
    //1 
    const id = req.params.id; //ตัวแปรโง่    
    let image : ImageModel = req.body; //อีกตัว

    //Query original data by id
    let imageModel : ImageModel | undefined;
    let sql = mysql.format("select * from image where imid = ?",[id]);
    let result = await queryPromise(sql);
    const jsonStr = JSON.stringify(result);
    const jsonObj = JSON.parse(jsonStr);
    const rawData = jsonObj;
    imageModel = rawData[0];

    //merge recive
    const updateTrip = {...imageModel, ...image};
    sql ="update `image` set `score`= ?, `voteTOTAL`= ? where `imid`= ?";

    //update
    sql = mysql.format(sql, [
        updateTrip.score, updateTrip.voteTOTAL, id
    ]);
    dbconn.query(sql, (err, result)=>{
        if (err) throw err;
        res.status(200).json({
            affected_row: result.affectedRows
        });
    })
});

router.get("/selectemail", (req, res) => {
    dbconn.query(
        "SELECT * FROM user WHERE email = ?",
        [req.query.email],
        (err, result) => {
            if (err) throw err;
            res.json(result);
        }
    );
});

router.post("/insertImg", (req, res) => {

    if (req.query){

        const Img: ImageModel = req.body;
        let sql = `INSERT INTO image (uid, name, score, voteTOTAL, url)
                    SELECT ?, ?, ?, ?, ?
                    FROM DUAL
                    WHERE NOT EXISTS (
                        SELECT 1
                        FROM image
                        WHERE uid = ?
                        HAVING COUNT(*) >= 5)`;
        sql = mysql.format(sql, [
            Img.uid,
            Img.name,
            Img.score,
            Img.voteTOTAL,
            Img.url,
            Img.uid,
        ]);
        dbconn.query(sql, (err, result) =>{
            if (err) throw err;
            res.status(201).json({
                affected_rows: result.affectedRows,
                last_idx: result.insertId
            });            
        });
    } else {
        res.status(201).send("error!");
    }
});

router.get("/count/:uid", (req, res) => {
    let uid = req.params.uid;
    dbconn.query("SELECT COUNT(*) AS count FROM image WHERE uid = ?", [uid], (err, result) => {
      if (err) throw err;
      res.json(result[0]);
    });
});