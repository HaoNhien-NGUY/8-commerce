import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouteMatch } from "react-router-dom";
import axios from 'axios';

const CreateImage = () => {
    const [picture, setPicture] = useState([]);

    let idproduct = useRouteMatch("/admin/create/image/:idproduct").params.idproduct;
    console.log(idproduct);
    const onFileChange = (e) => {
        let files = e.target.files || e.dataTransfer.files;
        setPicture(files);
        if (!files.length) {
            console.log('no files');
        }
        console.log(files);
        console.log(files[0])
    }
    const sendImage = () => {
        if(picture.length === 0) return alert('You need to pick a photo');
        let fileExtension =  picture[0].name.split('.').pop();
        let exts = ['jpg', 'jpeg', 'png']
        if(!exts.includes(fileExtension)){
          return alert('Your picture need to have the \'jpg\', \'jpeg\',\'png\' extension')
        }
        const bodyFormData = new FormData();
        bodyFormData.append('image',picture[0]);
        bodyFormData.append('color', 'default');
       
        const config = {
            headers: {
                'content-type': 'multipart/form-data',
            }
        }
        axios
        .post('http://localhost:8000/api/product/'+idproduct+'/image', bodyFormData, config)
        .then(response => {
          setPicture([]);
          console.log(response);
         // document.location.reload();
        })
        .catch((error) => {
          console.log(error.response);
        })
      }
    
    console.log(picture);
    
    return(
        <div>
            <ToastContainer />
            <div className="btnLink">
                <button onClick={() => window.location.href='/admin'} className='btn btn-warning margin-righ mb-5'> Back to dashboard </button>
            </div>
             <input id="my-file-selector" type="file" name="file" onChange={onFileChange} />
             <button className='btn btn-primary' onClick={sendImage}> Send image </button>
        </div>
    )
}

export default CreateImage;