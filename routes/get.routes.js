const { Router } = require('express');
const router = Router();
const Data = require('../models/Data')

router.get('', async (req, res) => {
  try {
    const { data } = req.query;
    if (!data) {
      return res.status(400).json({message: 'Ошибка!', data: 'Отсутствует поле data в параметрах запроса'});
    }
    const row = await Data.find({$or: [{code: {$regex: data, $options:"$i"}}, {name: {$regex: data, $options:"$i"}}]});
    res.json({message: 'ok', data: row});
  } catch(e) {
    res.status(500).json({message: 'Ошибка!', data: 'Что-то пошло не так...'});
  }
});

module.exports = router;