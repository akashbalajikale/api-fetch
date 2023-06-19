let cl = console.log;

const postForm =document.getElementById('postForm')
const titleControl =document.getElementById('title')
const contentControl =document.getElementById('content')
const creatBtn =document.getElementById('creatBtn')
const updatbtn =document.getElementById('updatbtn')
const postContainer =document.getElementById('postContainer')
const loader =document.getElementById('loader')
const cancelbtn = document.getElementById('cancelbtn')

const templating =(arr)=>{
    let result ='';
    arr.forEach(ele => {
        result += `
            <div class="card mb-4" id="${ele.id}">
            <div class="card-header">
                <h3>${ele.title}</h3>
            </div>
            <div class="card-body">
                <p>${ele.body}</p>
            </div>
            <div class="card-footer d-flex justify-content-between">
                <button class="btn btn-info" onclick="onEdit(this)">Edit</button>
                <button class="btn btn-danger"  onclick="onDelet(this)">Delete</button>

            </div>
            </div>

        `
    });
    postContainer.innerHTML=result;
}

let baseUrl =`https://fetch-api-df0b1-default-rtdb.asia-southeast1.firebasedatabase.app/`;
let postUrl = `${baseUrl}/movies.json`

 
 const makeApicall =(methodName, apiUrl, msgBody)=>{
    loader.classList.remove('d-none')
    return fetch(apiUrl, {
        method : methodName,
        body : msgBody,
        headers: {
            "Autharazation": "Bearer Token",
            "content-type": "application/json; charset=UTF-8"
        }
    })
      .then(res =>{
          return res.json()      
      })
 }

 makeApicall("GET", postUrl)
    .then(res =>{
        let arr =[]
        for(let k in res){
            arr.push({id:k, ...res[k]})
        }
        templating(arr)
    })
    .catch(cl)
    .finally(()=>{
    loader.classList.add('d-none')

    })

const onpostform =(eve)=>{
    eve.preventDefault();
    let obj ={
        title : titleControl.value,
        body : contentControl.value
    }
    makeApicall("POST", postUrl, JSON.stringify(obj))
            .then(res =>{
                cl(res.name)
                let card = document.createElement("div")
                card.className ="card mb-4"
                card.id = res.name
                card.innerHTML =`
                                <div class="card-header">
                                <h3>${obj.title}</h3>
                                </div>
                                <div class="card-body">
                                <p>${obj.body}</p>
                                </div>
                                <div class="card-footer d-flex justify-content-between">
                                <button class="btn btn-info" onclick="onEdit(this)">Edit</button>
                                <button class="btn btn-danger"  onclick="onDelet(this)">Delete</button>

                                </div>
                
                `
            postContainer.append(card)
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Post create successfully',
                showConfirmButton: false,
                timer: 1500
              })
            })
            .catch(cl)
            .finally(()=>{
                postForm.reset()
             loader.classList.add('d-none')

            })
}
 

const onEdit = (e)=>{
    let editId = e.closest(".card").id;
     
    localStorage.setItem("editId", editId)

    let editUrl =`${baseUrl}/movies/${editId}.json`
    makeApicall("GET", editUrl)
      .then(res =>{
            titleControl.value = res.title,
            contentControl.value = res.body
      })
      .catch(cl)
      .finally(()=>{
       loader.classList.add('d-none')
        creatBtn.classList.add("d-none")
        updatbtn.classList.remove("d-none")
      })

}

const onupDatebtn =()=>{
    let updateId = localStorage.getItem('editId')
    let updateUrl =`${baseUrl}/movies/${updateId}.json`
    let obj ={
        title : titleControl.value,
        body :contentControl.value
    }

makeApicall("PATCH", updateUrl, JSON.stringify(obj))
        .then(data =>{
            let child = [...document.getElementById(updateId).children];

            child[0].innerHTML =`<h3>${obj.title}</h3>`
            child[1].innerHTML =`<p>${obj.body}<p>`
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Your Post has been updated !!',
                showConfirmButton: false,
                timer: 1500
              })
        })
        .catch(cl)
        .finally(()=>{
            updatbtn.classList.add('d-none')
            creatBtn.classList.remove('d-none')
            postForm.reset()
            loader.classList.add('d-none')
        })
}

const onDelet =(e)=>{
   let deletId =e.closest('.card').id;
   let deletUrl = `${baseUrl}/movies/${deletId}.json`
   Swal.fire({
    title: 'Are you sure?',
    text: "your post will be deleted",
  
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
        makeApicall('DELETE', deletUrl)
     .then(res =>{
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Your post deleted successfully',
            showConfirmButton: false,
            timer: 1500
          })
        let card =document.getElementById(deletId)
        card.remove()
     })
     .catch(cl)
     .finally(()=>{
        postForm.reset()
        updatbtn.classList.add('d-none')
        creatBtn.classList.remove('d-none')
        loader.classList.add('d-none')
     })
    }else{
        return
    }
  })
  

}
const onCancel =()=>{
    postForm.reset()
    updatbtn.classList.add('d-none')
    creatBtn.classList.remove('d-none')

}
 postForm.addEventListener("submit", onpostform)
 updatbtn.addEventListener("click", onupDatebtn)
cancelbtn.addEventListener("click", onCancel)