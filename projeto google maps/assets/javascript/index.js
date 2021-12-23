let map;
let centerMarker;
let marker;
let newMarker;
let saveMarker;

function initMap() {
  centerMarker = new google.maps.LatLng(-6.892216009370435, -38.55855970419098 )
  map = new google.maps.Map(document.getElementById("map"), {
    center: centerMarker,
    zoom: 14,
    mapTypeId: 'hybrid'
  });


  marker = new google.maps.Marker({
    position: centerMarker,
    map:map,
    draggable: true,
  });

  marker.addListener('click',()=>{
    openWindowInfo()
  })

  map.addListener("click", event =>{
    alterarMarcador(event);
    openModal();
  })
}

window.addEventListener('load',()=>{
  getPontos()
})


function getPontos(){
    fetch('http://localhost:3000/getPontos')
    .then((res)=>{
      return res.json()
    }).then((response)=>{
        console.log(response)
        let arrayPontos = []
        for(let i=0; i<response.length;i++){
          let pontosCriados = new google.maps.LatLng(response[i].lat, response[i].lng)
              arrayPontos.push(saveMarker = new google.maps.Marker({
                position: pontosCriados,
                map:map,
                draggable: false,
              }));
        }
        openWindowInfo(arrayPontos, response)
    })
}

function salvar(){
    let input = document.querySelector('#nome').value;
    let obj = {
      nomeLocal: input,
      desc: document.querySelector('textarea').value,
      lat: marker.getPosition().lat(),
      lng: marker.getPosition().lng()
    }

    fetch("http://localhost:3000/pontos", {
      method: 'POST',
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(obj)
    }).then((response =>{alert('inserido')}))
    .catch(error =>{alert('Falha ao salvar' + error)})

      input = ''
    let textarea = document.querySelector('textarea').value
        textarea = ''
    closeModal()
      // criar função para mostrar pontos toda vez q salva mais um --- showPontos()
}

function closeModal(){
  event.preventDefault()
  let input = document.querySelector('#nome');
      input.value = ''
  let textarea = document.querySelector('textarea')
    textarea.value = ''
  let modal = document.querySelector('.container')
      modal.classList.remove('mostrar')
}

function openModal(){
  let div = document.querySelector('.container')
    div.classList.add('mostrar')
}

function alterarMarcador(event){
  marker.setPosition(event.latLng)
}

function openWindowInfo(arrayPontos, response){
  for(let i = 0;i<arrayPontos.length;i++){
    arrayPontos[i].addListener('click', ()=>{
      const contentString = `<div id="content">
                                <h3>Nome:</h3>
                                <p>${response[i].nome}</p>
                                <h3>Descrição:</h3>
                                <p>${response[i].descricao}</p>
                              </div>`;
      const infowindow = new google.maps.InfoWindow({
          content: contentString,
        });
        infowindow.open(map, arrayPontos[i])
    })
  }
}
