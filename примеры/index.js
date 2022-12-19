//GET
const getCats = async () => {
    const responce = await fetch('https://cats.petiteweb.dev/api/single/ashvedov/show', {
      method: 'GET'
    });
    const data = await responce.json();
  
    console.log(data)
  }
  
  //POST
  const newCat = {
    name: "новый кот",
    id: 343,
    image: "тест",
    age: 20,
    rate: 1,
    favorite: false,
    description: "кот для удаления"
  }
  
  const addCat = async () => {
    const responce = await fetch('https://cats.petiteweb.dev/api/single/ashvedov/add', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newCat)
    });
    const data = await responce.json();
  
    console.log(data)
  }
  
  //PUT
  const changeidObj = { id: 7 }
  
  const changeCat = async () => {
    const responce = await fetch('https://cats.petiteweb.dev/api/single/ashvedov/update/600', {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(changeidObj)
    });
    const data = await responce.json();
  
    console.log(data)
  }
  
  const api = new Api('ashvedov');
  
  //на промисах
  api.getCats()
    .then(res => res.json())
    .then(data => console.log(data))
  
  // на async/await
  const getting = async () => {
    const res = await api.getCats();
    const data = await res.json()
  
    console.log(data);
  }
  
  const adding = async (body) => {
    const res = await api.addCat(body);
    const data = await res.json();
  
    console.log(data);
  }
//   adding(newCat)
  
  const deleting = async (id) => {
    const res = await api.delCat(id);
    const data = await res.json();
  
    console.log(data);
  }
//   deleting(343)