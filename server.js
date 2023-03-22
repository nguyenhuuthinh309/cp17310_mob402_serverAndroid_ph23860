const express = require('express');
const multer = require('multer');
const app = express();
const sharp = require('sharp');
// set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads'); // thư mục lưu trữ file
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); 
  }
});

// upload dưới 1mb
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1000000 
  }
}).single('file'); 

app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
    
       
        return res.send('tệp lớn hơn 1mb');
     
    } else {
        return res.send('thành công ! tệp nhỏ hơn 1mb');
    }
  })
})

// upload nhiều file
const upload1 = multer({ storage: storage }).array('files', 5); // 5 là số lượng file tối đa

app.post('/upload1', (req, res) => {
  upload1(req, res, (err) => {
    if (err) {
        return res.send(' thất bại !upload tối đa 5 file');
    } else {
        return res.send(' Thành công !');
    }
  })
})
//chỉ upload fiel ảnh jpeg
const storage1 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.jpg')
  }
})

const upload2 = multer({
  storage: storage1,
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg)$/)) {
      return cb(new Error('Chỉ cho phép tải lên file ảnh có định dạng JPG hoặc JPEG!'))
    }
    cb(null, true)
  }
}).single('files');

app.post('/upload2', function (req, res) {
  upload2(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // Nếu có lỗi trong quá trình tải lên
      res.send('lõi trong quá trình upload')
    } else if (err) {
      // Nếu có lỗi xử lý upload
      res.send('Chỉ cho phép tải lên file ảnh có định dạng JPG hoặc JPEG!')
    } else {
      // Nếu tải lên thành công
      res.send('Tải lên ảnh thành công!')
    }
  })
})



//Nếu người dùng Upload file ảnh GIF, PNG,... Thì phải đổi thành đuôi JPEG.
const storage2 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.jpg')
  }
})
const upload3 = multer({
  storage: storage2,
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Chỉ cho phép tải lên file ảnh có định dạng JPG, JPEG, PNG hoặc GIF!'))
    }
    cb(null, true)
  }
}).single('files');

app.post('/upload3', function (req, res) {
  upload3(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // Nếu có lỗi trong quá trình tải lên
      res.send('lỗi trong quá trình tải lên')
    } else if (err) {
      // Nếu có lỗi xử lý upload
      res.send('Chỉ cho phép tải lên file ảnh có định dạng JPG, JPEG, PNG hoặc GIF!')
    } else {
      // Nếu tải lên thành công
      let filePath = req.file.path;
      sharp(filePath)
        .jpeg()
        .toFile(`uploads${Date.now()}.jpg`, function(err) {
          if (err) {
            res.send(err);
          } else {
            res.send('Tải lên ảnh và đổi định dạng thành công!');
          }
        });
    }
  })
})



app.get('/', (req, res) => {
    res.sendFile(__dirname + '/upload.html');
});
app.listen(8000, () => {
 
})