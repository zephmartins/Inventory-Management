import multer from "multer";


//Define file storage

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, new Date().toISOString().replace(/:/g, "-") + "-" + file.fieldname ) // the iso.replce is to chnage the date format from this 20/11/2022 to 20-11-22
    }
  })

  // specify file format that can be saved
  function fileFilter (req, file, cb) {

    if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg"

    ){
        cb(null, true)
    }else{
        cb(null, false)
    }
  
   
  
  }
  
  const upload = multer({ storage, fileFilter }).single("image")


  const fileSizeFormatter = (bytes,decimal) =>{
    if(bytes === 0){
        return "0 Bytes"
    }

    const dm = decimal || 2;
    const sizes = ["Bytes", "KB", "MB", "GB","TB", "PB", "EB", "YB", "ZB" ];
    const index = Math.floor(Math.log(bytes) / Math.log(1000));
    return(
       `${parseFloat(bytes / Math.pow(1000, index).toFixed(dm))} ${sizes[index]}`
    );
  }



  export {upload, fileSizeFormatter} 