const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const router = Router();
const Data = require('../models/Data');

router.put(
  '', 
  [
    check('name', 'Некорректное наименование')
      .not().isEmpty()
      .trim()
      .escape()
      .exists(),
    check('code', 'Некорректный код подразделения')
      .not().isEmpty()
      .trim()
      .escape()
      .exists()
      .isLength({ min: 7, max: 7 }),
  ], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Ошибка!', data: errors.array() });
    }
    const { name, code } = req.body;
    const row = await Data.find({code});
    if (row.length > 0) {
      // если найдена запись с таким кодом - смотрим сколько записей с таким же именем
      const differenceName = row.reduce((acc, el) => (el.name.toLowerCase() === name.toLowerCase() ? ++acc : acc), 0);
      // если записей с таким же именем нет - добавляем новую
      if (differenceName === 0) {        
        const newRow = new Data({name, code});
        await newRow.save();
        return res.status(201).json({message: 'ok', data: newRow});
      }
      // иначе код с данным наименованием имеется
      return res.status(200).json({message: 'ok', data: row});
    }
    // если такого кода нет - добавляем вместе с наименованием
    const newRow = new Data({name, code});
    await newRow.save();
    res.status(201).json({message: 'ok', data: newRow});
  } catch(e) {
    res.status(500).json({message: 'Ошибка!', data: 'Что-то пошло не так...'});
  }
});

module.exports = router;