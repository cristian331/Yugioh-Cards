const API = 'https://db.ygoprodeck.com/api/v7/cardinfo.php'
const API_Random = 'https://db.ygoprodeck.com/api/v7/randomcard.php'

const seccionDiv = document.getElementById('SeccionSelectCards');

const btnRandomCard = document.getElementById('btnRandomCard');
const btnNormalMonster = document.getElementById('btnNormalMonster');
const btnEffectMonster = document.getElementById('btnEffectMonster');
const btnSpellCard = document.getElementById('btnSpellCard');
const btnTrapCard = document.getElementById('btnTrapCard')

const btnAddCard1 = document.getElementById('btnAddCard1');
const btnAddCard2 = document.getElementById('btnAddCard2');
const btnAddCard3 = document.getElementById('btnAddCard3');

btnRandomCard.addEventListener('click', fetchRandomcard)
btnNormalMonster.addEventListener('click', fetchNormalMonster);
btnEffectMonster.addEventListener('click', fetchEffectMonster);
btnSpellCard.addEventListener('click', fetchSpellCard)
btnTrapCard.addEventListener('click', fetchTrapCard)

btnAddCard1.addEventListener('click', addtoDeck);
btnAddCard2.addEventListener('click', addtoDeck);
btnAddCard3.addEventListener('click', addtoDeck);

let randomCardImages = [];

function addToLocalStorage (selectCard) {

    let savedCards = JSON.parse(localStorage.getItem('YGH-saveCargs')) || [] ;
    savedCards = [selectCard, ...savedCards]

    const cardsToSave = JSON.stringify(savedCards);
    localStorage.setItem('YGH-saveCargs', cardsToSave);
    renderSaveCards();
}

function renderSaveCards () {

    seccionDiv.innerHTML = ''
    const toRender = [];
    const saveCards = JSON.parse(localStorage.getItem('YGH-saveCargs'));
    // console.log(saveCards)

    if(saveCards){
        saveCards.forEach(ImgUrl => {
            const div = document.createElement('div');
            const img = document.createElement('img');
            const btn = document.createElement('button');
            const btnText = document.createTextNode('X');

            btn.append(btnText);
            btn.classList.add('bntRemoveCard')
            btn.onclick = () => removeCardAdded(ImgUrl)
            img.src = ImgUrl;
            img.classList.add('selectCardImage')

            div.append(img, btn);
            div.classList.add('selectCardImageBox')
            toRender.push(div);

            seccionDiv.append(...toRender);
        })
    };
}

function addtoDeck(e){

    const btnOnClickIs = e.target.accessKey;
    const selectCardIs = randomCardImages[btnOnClickIs-1]

    addToLocalStorage(selectCardIs)
}

function removeCardAdded (ImgUrl) {
    const saveCards = JSON.parse(localStorage.getItem('YGH-saveCargs'));
    const indexCard = saveCards.findIndex(item => item == ImgUrl);
    saveCards.splice(indexCard,1);
    localStorage.setItem('YGH-saveCargs', JSON.stringify(saveCards));

    renderSaveCards();
}


async function renderRandonImages (urlApi){
    randomCardImages.splice(0,3);

    for(i=0; i<3;i++){
        const urlImg = await loadRandomCards(urlApi);
        const img = document.getElementById(`img${i+1}`);
        img.src = await urlImg
    }
}

function fetchRandomcard(){
    renderRandonImages(API_Random)
};

function fetchNormalMonster(){
    const queryParam = 'type=Normal%20Monster'
    renderRandonImages(`${API}?${queryParam}`)
}

function fetchEffectMonster(){
    const queryParam = 'type=Effect%20Monster'
    renderRandonImages(`${API}?${queryParam}`)    
}

function fetchSpellCard(){
    const queryParam = 'type=Spell%20Card'
    renderRandonImages(`${API}?${queryParam}`)    
}

function fetchTrapCard(){
    const queryParam = 'type=Trap%20Card'
    renderRandonImages(`${API}?${queryParam}`)    
}


function aleatorio(max, min = 0) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

async function loadRandomCards(urlApi) {
    try {
    const resText = await fetch(urlApi);
    const res = await resText.json(); // objeto
        if (res.data){
            const dataCard = await res.data // array
            const long = await dataCard.length
            const randomCard = await dataCard[aleatorio(long)];
            const imagenRandomCard = await randomCard.card_images[0].image_url;
            const randomCardName = await randomCard.name;
            randomCardImages.push(imagenRandomCard);
            return await imagenRandomCard
        
        } else {
            const imagenRandomCard = await res.card_images[0].image_url;
            const randomCardName = await res.name;
            randomCardImages.push(imagenRandomCard);
            return await imagenRandomCard;
        }
    } catch(error){
        console.log(error)
    }
}
fetchRandomcard();
renderSaveCards();

// async function loadSelecCard(urlApi) {
//     try {
//         const resText = await fetch(urlApi);
//         const res = await resText.json(); // objeto
//         const infoCard = await res.data
//         const imagenRandomCard = await infoCard[0].card_images[0].image_url;
//         // const randomCardName = await infoCard[0].name;
//         const imgAdded = document.getElementById('addedCard1');
//         imgAdded.src = await imagenRandomCard;
//     } catch(error){
//         console.log(error)
//     }
// }
