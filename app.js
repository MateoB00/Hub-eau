let departement = '33'
let villeCode = '05025600'


getDepartement(departement)



async function getDepartement(departement) {
    let url = 'https://hubeau.eaufrance.fr/api/v1/temperature/station?code_departement=' + departement + '&size=20&exact_count=true&format=json&pretty';
    try {
        let res = await fetch(url);
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}

async function getVille(villeCode) {
    let urlVille = 'https://hubeau.eaufrance.fr/api/v1/temperature/chronique?code_station=' + villeCode + '&size=1&sort=desc&pretty'
    try {
        let res = await fetch(urlVille);
        return await res.json();
    } catch (error) {
        console.log(error);
    }

}

async function renderVilles() {
    let villes = await getDepartement(departement);
    let html = '<option id="null" class="text-center" value="undefined">-- Selectionner --</option>';
    Object.keys(villes.data).forEach(key => {
        let htmlSegment = `
            <option type="checkbox" name="codeStation" id="codeStation" value ='${villes.data[key].code_station}'>${villes.data[key].libelle_station}</option>
            `;

        html += htmlSegment;

    });


    let container = document.getElementById('liste');
    container.innerHTML = html;

}

function choice() {

    var selectedList = [],
        selectBox = document.getElementById("liste"),
        i;
    for (i = 0; i < selectBox.length; i++) {
        if (selectBox[i].selected) {
            selectedList.push(selectBox[i].value);
        }
    }
    async function renderVille() {
        let ville = await getVille(selectedList[0])
        if (selectedList[0] === 'undefined') {
            document.querySelector('#ville').textContent = 'Veuillez Choisir Un Cours D\'eau'
            document.querySelector('#temperature_label').textContent = ' xx.x'
        } else {
            document.querySelector('#ville').textContent = ville.data[0].libelle_station
            document.querySelector('#temperature_label').textContent = Math.round(ville.data[0].resultat)
        }
    }
    renderVille()
}

choice()


let buttonDepartement = document.querySelector('#changerDepartement');
buttonDepartement.addEventListener('click', () => {
    departement = prompt('Choisissez un département (ex : 91) :');
    async function renderTitre() {
        if (!departement === "" || departement.length < 3) {
            let titre = await getDepartement(departement)
            document.querySelector('#titre').textContent = `Température des eaux | Département : ${titre.data[0].libelle_departement}`
            document.querySelector('#ville').textContent = 'Veuillez Choisir Un Cours D\'eau'
            document.querySelector('#temperature_label').textContent = ' xx.x'
        } else {
            alert('Erreur dans la manipulation veuillez saisir un département, exemple : 95 | Pour le Val d\'Oise')
            renderVilles()
        }
    }
    renderTitre()
    renderVilles()
});



renderVilles()