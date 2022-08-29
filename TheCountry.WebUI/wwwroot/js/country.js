
const uri = 'https://localhost:7106/';
var activeModal;
var currentPage = 1;

function getCountries(page) {
    var search = document.getElementById("search").value;
    fetch(uri + `getallcountries?search=${search}&page=${page}`)
        .then(response => response.json())
        .then(data => buildTable(data))
        .catch(error => console.error('Unable to get countries.', error));
}

function getSelectedCountry(country) {
    const response = fetch(uri + `getcountry/${country}`)
        .then(response => response.json())
        .then(data => buildCountry(data))
        .catch(error => console.error('Unable to get country.', error));

    return response;
}

function getSelectedRegion(region) {
    const response = fetch(uri + `getregion/${region}`)
        .then(response => response.json())
        .then(data => buildRegion(data))
        .catch(error => console.error('Unable to get region.', error));

    return response;
}

function getSelectedSubregion(region, subregion) {
    var regionEnc = encodeURIComponent(region)
    var subregionEnc = encodeURIComponent(subregion)
    const response = fetch(uri + `getsubregion?region=${regionEnc}&subregion=${subregionEnc}`)
        .then(response => response.json())
        .then(data => buildSubregion(data))
        .catch(error => console.error('Unable to get subregion.', error));

    return response;
}

$(function () {
    getCountries(1);
});

function buildTable(data) {

    let dataJSON = JSON.parse(data);

    var options = {
        currentPage: dataJSON.pagenation.currentpage,
        totalPages: dataJSON.pagenation.pagetotal,
        onPageClicked: function (e, originalEvent, type, page) {
            getCountries(page);
        }
    }

    $('#pager').bootstrapPaginator(options);

    var table = document.getElementById("table_countries");
    $('#table_countries tbody').empty();

    for (var country of dataJSON.countrylist) {
        var row = table.getElementsByTagName('tbody')[0].insertRow();

        var cell = row.insertCell();

        var a = document.createElement('a');
        var cellText = document.createTextNode(country.name);
        a.appendChild(cellText);
        a.title = "country";
        a.href = `javascript:getSelectedCountry('${country.name}');`;
        cell.appendChild(a);

        cell = row.insertCell();
        var a = document.createElement('a');
        var cellText = document.createTextNode(country.region);
        a.appendChild(cellText);
        a.title = "region";
        a.href = `javascript:getSelectedRegion('${country.region}');`;
        cell.appendChild(a);

        cell = row.insertCell();
        var a = document.createElement('a');
        var cellText = document.createTextNode(country.subregion);
        a.appendChild(cellText);
        a.title = "subregion";
        a.href = `javascript:getSelectedSubregion('${country.region}','${country.subregion}');`;
        cell.appendChild(a);
    }
}

function buildCountry(data) {

    let country = JSON.parse(data);

    var name = document.getElementById('country_name_value');
    var capital = document.getElementById('country_capital_value');
    var population = document.getElementById('country_population_value');
    var currencies = document.getElementById('country_currencies_value');
    var languages = document.getElementById('country_languages_value');
    var borders = document.getElementById('country_borders_value');

    var heading = document.getElementById('CountryModalHeading');
    heading.innerHTML = `${country.name}`;

    name.innerHTML = `${country.name}`;
    capital.innerHTML = `${country.capital.toString()}`;
    population.innerHTML = `${country.population}`;
    currencies.innerHTML = `${country.currencies.toString()}`;
    languages.innerHTML = `${country.languages.toString()}`;

    if (country.borders.length > 0) {
        borders.parentElement.style.display = "block";
        borders.innerHTML = `${country.borders.toString()}`;
    } else {
        borders.parentElement.style.display = "none";
    }

    switchModal('Modal-Country');
}

function buildRegion(data) {

    let region = JSON.parse(data);

    var name = document.getElementById('region_name_value');
    var countries = document.getElementById('region_countries_value');
    var population = document.getElementById('region_population_value');
    var subregions = document.getElementById('region_subregions_value');

    var heading = document.getElementById('RegionModalHeading');
    heading.innerHTML = `${region.name}`;

    name.innerHTML = `${region.name}`;
    population.innerHTML = `${region.population}`;

    var countriesLinks = [];
    for (var country of region.countrylist) {
        var a = `<a title="country" href="javascript:getSelectedCountry('${country}');">${country}</a>`;
        countriesLinks.push(a);
    }
    countries.innerHTML = countriesLinks.toString();

    if (region.subregionlist.length > 0) {
        subregions.parentElement.style.display = "block";
        if (region.subregionlist.toString() != "") {

            var subregionLinks = [];
            for (var subregion of region.subregionlist) {
                var a = `<a title="subregion" href="javascript:getSelectedSubregion('${region.name}','${subregion}');">${subregion}</a>`;
                subregionLinks.push(a);
            }
            subregions.innerHTML = subregionLinks.toString();
        } else {
            subregions.innerHTML = `N/A`;
        }

    } else {
        subregions.parentElement.style.display = "none";
    }

    switchModal('Modal-Region');
}

function buildSubregion(data) {

    let subregion = JSON.parse(data);

    var name = document.getElementById('subregion_name_value');
    var population = document.getElementById('subregion_population_value');
    var region = document.getElementById('subregion_region_value');
    var countries = document.getElementById('subregion_countries_value');

    var heading = document.getElementById('SubregionModalHeading');
    heading.innerHTML = `${subregion.name}`;

    name.innerHTML = subregion.name;
    population.innerHTML = subregion.population;
    region.innerHTML = `<a title="subregion" href="javascript:getSelectedRegion('${subregion.region}');">${subregion.region}</a>`;

    var countriesLinks = [];
    for (var country of subregion.countrylist) {
        var a = `<a title="country" href="javascript:getSelectedCountry('${country}');">${country}</a>`;
        countriesLinks.push(a);
    }
    countries.innerHTML = countriesLinks.toString();

    switchModal('Modal-Subregion');
}

function switchModal(open) {
    if (typeof activeModal === 'undefined') {
        activeModal = open;
        $(`#${open}`).modal('show');
    } else {
        if ($(`#${activeModal}`).hasClass('show')) {
            $(`#${activeModal}`).modal('hide');
            activeModal = open;
            $(`#${open}`).modal('show');
        } else {
            activeModal = open;
            $(`#${open}`).modal('show');
        }
    }
}