const express = require('express');
const router = express.Router();
const Log = require('../../models/Log');

router.get('/', (req, res) => {
  Log.find()
    .sort({ date: -1 })
    .then(logs => res.json(logs))
    .catch(err => res.status(404).json({ nologsfound: 'No logs found' }));
});

// router.get('/:id', (req, res) => {
//   Log.findById(req.params.id)
//     .then(log => res.json(log))
//     .catch(err =>
//       res.status(404).json({ nologfound: 'No log found with that ID' }
//       )
//     );
// });

router.get("/:songNum", (req, res) => {
  // console.log(res);
  Log.find({ 'songNumber': parseInt(req.params.songNum) }).limit(1).sort({ date: -1 })
    .then(log => res.json(log))
    .catch(err => (
      res.status(404).json({ nosongfound: "No song found with that song number" })
    ));
})

router.post('/', (req, res) => {
  const newLog = new Log({
    songName: req.body.songName,
    songNumber: req.body.songNumber,
    col1: req.body.col1,
    col2: req.body.col2,
    col3: req.body.col3,
    col4: req.body.col4,
  });
  newLog.save().then(log => res.json(log));
});

// router.patch("/MARUTSUKE", (req, res) => {
//   let log = Log.findOne({ "songNumber": 1 });
//   log.col1 = req.body.col1;
//   log.col2 = req.body.col2;
//   log.col3 = req.body.col3;
//   log.col4 = req.body.col4;
//   log.save().then(log => res.json(log));
// });

module.exports = router;