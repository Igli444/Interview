import lang from '../../../../lang/it.json';
let autocomplete = {};
let locations;
let sortedLocations;
let pdpLocations = [];
let currencyCode = document.querySelector("#main-content").getAttribute("data-currency-code");
const bookProdContainer = document.querySelector("#book-product");
const currencySymbols = {
    "EUR": "€",
    "USD": "$"
}
let currencySymbol = currencySymbols[currencyCode];
let productId = document.querySelector("#productId")?.value;
let updatedLocations;
let switchEl = document.querySelector('#filter-switch-PDP');
import baseUrl from "./../constants";
const { integration_url } = baseUrl();


window.initializeSlick = function(id, config) {
    $(id).slick(config)
}

let locationSearchHP = document.querySelector('#locationSearchAutocomplete');
let locationSearchPDP = document.querySelector('#locationSearchAutocomplete-PDP');

if(locationSearchHP){
    locationSearchHP.addEventListener('focus', function() {
            this.value = '';
    });
}
if (locationSearchPDP){
    locationSearchPDP.addEventListener('focus', function() {
            this.value = '';
    });
}

export async function getStoresApi(){

    if ( window.getAuthToken){
         const token = await getAuthToken();

        const pointsOfSaleUrl = `${integration_url}/api/points-of-sale`;

        fetch(pointsOfSaleUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        }) .then(response => response.json())
            .then(pointsOfSaleData => {
                //get locations from GET Request
                locations = pointsOfSaleData;
            })
            .catch(error => {
                console.error('Error fetching points of sale:', error);
            });
    }

}

export function getLocations() {
    return locations;
}

export function getHomeStructure(location) {

    let store_url = (window.location.origin + '/' + location.city.replace(/\s+/g, '-') + '-' + location.code).toLowerCase();

    store_url = store_url
        .replace(/(\w)\'(\w)/g, '$1-$2') // Replace apostrophe between words with hyphen
        .replace(/\'$/, '')              // Remove apostrophe at the end
        .replace(/\'(?=-)/g, '')         // Remove apostrophe followed by a hyphen
        .replace(/-+/g, '-');            // Replace multiple consecutive hyphens with a single hyphen

    let volantino_active = location.custom_attributes.volantino_attivo;
    let hiddenClassVolantino = '';

    if (volantino_active === "false") {
        hiddenClassVolantino ='hidden'
    }
    else {
        hiddenClassVolantino = '';
    }


    let volantinoText = location.volantino?.titolo || "";
    let cardHtml = "";
    if (volantinoText === ""){
       cardHtml =  `
        <input class="storeName" type="hidden" value="${location.city}">
        <input class="storeCode" type="hidden" value="${location.code}">
        <input class="storeStreet" type="hidden" value="${location.street}">
        <input class="storeId" type="hidden" value="${location.id}">
        <input class="storeState" type="hidden" value="${location.state}">
        <input class="codeOriginale" type="hidden" value="${location.code_original}">
        
      
        <div class="search-result-data border-grey">
            <!--Title & Distance-->
            <div class="data-row data-row-flex">
                <div class="data-row-text">
                    <p class="text-roboto-m-bold">${location.city}</p>
                    <p class="text-roboto-s-regular">${location.street}</p>
                </div>
                <div class="data-row-distance">
                    <div class="distance-icon">
                        <svg><use href="#icon-distance" /></svg>
                    </div>
                    <div class="distance-nuber text-roboto-s-bold">${location.distance.toFixed(1)}km</div>
                </div>
            </div>
            <!--Hours-->
            <div class="data-row open-hours">
                <div class="open-hours-layout">
                    <div class="hours-icon">
                     <svg><use href="#icon-clock" /></svg>
                    </div>
                    <div class="hours-text text-roboto-s-medium">${lang.session_store.hours}</div>
                    <div class="hours-icon hours-icon-arrow">
                        <svg><use href="#icon-chevron-down" /></svg>
                    </div>
                </div>
                <div class="open-hours-below hidden">
                    ${generateHoursHTML(location.custom_attributes.orari)}
                </div>
            </div>
            <!--Texts-->
            <div class="data-row">
                <div class="data-row-texts">
                 <a href="${location.custom_attributes.volantino_url}" class="text-roboto-s-regular ${hiddenClassVolantino}">${lang.session_store.flyer}</a>
                 <a href="${store_url}" class="text-roboto-s-regular">${lang.session_store.tab}</a>
                </div>
            </div>
             <!--Button-->
             <div class="data-row">
                <a  class="selectStoreButton button main-button-rounded">
                    <span class="not-selected-text">${lang.session_store.select_store}</span>
                    <span class="selected-text">${lang.session_store.select_store_selected}</span>                     
                    <svg class="select-shop-button-icon"><use href="#icon-check-background" /></svg>
                </a>
            </div>
        </div>
    `;
    }else {
        cardHtml = `
        <input class="storeName" type="hidden" value="${location.city}">
        <input class="storeCode" type="hidden" value="${location.code}">
        <input class="storeStreet" type="hidden" value="${location.street}">
        <input class="storeId" type="hidden" value="${location.id}">
        <input class="storeState" type="hidden" value="${location.state}">
        <input class="codeOriginale" type="hidden" value="${location.code_original}">
        
        
        <div class="search-result-title text-roboto-xs-bold">
            ${lang.session_store.store}
            <span>${volantinoText}</span>
        </div>
        <div class="search-result-data">
            <!--Title & Distance-->
            <div class="data-row data-row-flex">
                <div class="data-row-text">
                    <p class="text-roboto-m-bold">${location.city}</p>
                    <p class="text-roboto-s-regular">${location.street}</p>
                </div>
                <div class="data-row-distance">
                    <div class="distance-icon">
                        <svg><use href="#icon-distance" /></svg>
                    </div>
                    <div class="distance-nuber text-roboto-s-bold">${location.distance.toFixed(1)}km</div>
                </div>
            </div>
            <!--Hours-->
            <div class="data-row open-hours">
                <div class="open-hours-layout">
                    <div class="hours-icon">
                     <svg><use href="#icon-clock" /></svg>
                    </div>
                    <div class="hours-text text-roboto-s-medium">${lang.session_store.hours}</div>
                    <div class="hours-icon hours-icon-arrow">
                        <svg><use href="#icon-chevron-down" /></svg>
                    </div>
                </div>
                <div class="open-hours-below hidden">
                    ${generateHoursHTML(location.custom_attributes.orari)}
                </div>
            </div>
            <!--Texts-->
            <div class="data-row">
                <div class="data-row-texts">
                 <a href="${location.custom_attributes.volantino_url}" class="text-roboto-s-regular ${hiddenClassVolantino}">${lang.session_store.flyer}</a>
                 <a href="${store_url}" class="text-roboto-s-regular">${lang.session_store.tab}</a>
                </div>
            </div>
             <!--Button-->
             <div class="data-row">
                <a  class="selectStoreButton button main-button-rounded">
                    <span class="not-selected-text">${lang.session_store.select_store}</span>
                    <span class="selected-text">${lang.session_store.select_store_selected}</span>                     
                    <svg class="select-shop-button-icon"><use href="#icon-check-background" /></svg>
                </a>
            </div>
        </div>
    `;
    }

    return  cardHtml;
}

export function getPDPStructure(location) {

    let prodAvailability = '';
    let buttonAvailability = '';
    let productSku = document.getElementById("productSku").value;

    if (location.stock > 1 && location.days_available > 0) {
        prodAvailability = `
            <div class="prod-availability-wrapper">
                <div class="prod-available-icon"></div>
                <p class="text-input">${lang.book_product.available} ${location.days_available}gg</p>
            </div>
            <div class="prodPrice">${location.price} ${currencySymbol}</div>
        `;
        buttonAvailability = `
            <div class="data-row">
                <a href="/booking-checkout/?ProductRefID=${productSku}@Trony-B2C&StoreID=${location.code}" class="selectStoreButton button main-button-rounded">
                    Continua con questo negozio
                </a>
                <input class="hidden" data-value-price value="${location.price} ${currencySymbol}">
            </div>
        `;
    } else {
        prodAvailability = `
            <div class="prod-notAvailable">
                <div class="prod-not-available-icon"></div>
                <p class="text-input">${lang.book_product.not_available}</p>
            </div>
        `;
        buttonAvailability = `
            <div class="data-row">
                <button class="selectStoreButton button main-button-rounded" disabled>
                    Continua con questo negozio
                </button>
            </div>
        `;
    }

    let productPromo = '';

    if (location.volantini_title !== "") {
        productPromo = `
            <div class="search-result-title">
                <span class="text-roboto-xs-bold color-white-100">Volantino:</span>
                <span class="text-roboto-xs-regular color-white-100">${location.volantini_title}</span>
            </div>
        `;
    }

    return `
        <input class="storeName" type="hidden" value="${location.city}">
        <input class="storeCode" type="hidden" value="${location.code}">
        <input class="storeStreet" type="hidden" value="${location.street}">
        <input class="storeId" type="hidden" value="${location.id}">
        <input class="storeState" type="hidden" value="${location.state}">
        
        ${productPromo !== '' ? productPromo : ''}

        <div class="search-result-data">
            <!-- Title & Distance -->
            <div class="data-row data-row-flex">
                <div class="data-row-text">
                    <p class="text-roboto-m-bold color-digital-blue-100">${location.city}</p>
                    <p class="text-roboto-s-regular color-digital-blue-100">${location.street}</p>
                </div>
                <div class="data-row-distance">
                    <div class="distance-icon">
                        <svg><use href="#icon-distance" /></svg>
                    </div>
                    <div class="distance-nuber text-roboto-s-bold">${location.distance.toFixed(1)}km</div>
                </div>
            </div>
            <!-- Hours -->
            <div class="data-row open-hours">
                <div class="open-hours-layout">
                    <div class="hours-icon">
                        <svg><use href="#icon-clock" /></svg>
                    </div>
                    <div class="hours-text text-roboto-s-medium">${lang.session_store.hours}</div>
                    <div class="hours-icon hours-icon-arrow">
                        <svg><use href="#icon-chevron-down" /></svg>
                    </div>
                </div>
                <div class="open-hours-below hidden">
                    ${generateHoursHTML(location.custom_attributes.orari)}
                </div>
            </div>
            <!-- Availability and price -->
            <div class="availability-wrapper">
                ${prodAvailability}
            </div>
            <!-- Button -->
            ${buttonAvailability}
        </div>
    `;
}

// Initialize Autocomplete when the page is loaded
export const initAutocomplete = (elementId) => {
    const mapsInterval = setInterval(() => {
        if (google && google.maps && google.maps.places) {
            clearInterval(mapsInterval);
            autocomplete[elementId] = new google.maps.places.Autocomplete(
                document.getElementById(elementId),
                {
                    types: ['(cities)'],
                    componentRestrictions: { country: 'it' }
                }
            );
            autocomplete[elementId].addListener('place_changed', () => handlePlaceChanged(autocomplete, elementId));
        }
    }, 500);
};


// export function to handle changes in the selected place
const handlePlaceChanged = async (autocomplete, id) => {
    const place = autocomplete[id].getPlace();

    if (!place.geometry) {
        return;
    }

    // Get latitude and longitude of the selected place
    const searchLat = place.geometry.location.lat();
    const searchLng = place.geometry.location.lng();

    // Sort locations by distance and display the results
    let sortedLocations = sortLocationsByDistance(locations, searchLat, searchLng);
    const topSortedLocations = sortedLocations.slice(0, 10);

    if (id.includes('PDP')) {
        const sortedLocationIds = topSortedLocations.map(location => location.code);
        try {
            const storeData = await fetchStoreData(productId, sortedLocationIds);

            if(switchEl.classList.contains('filter-switch-checked')) {
                handleDataAfterFetch(storeData, topSortedLocations , true);
            } else{
                handleDataAfterFetch(storeData, topSortedLocations ,false);
            }
        } catch (error) {
            console.error('Error fetching store data:', error);
        }
    } else {
        displayResults(topSortedLocations, location => getHomeStructure(location), false);
    }
};

function handleDataAfterFetch(storeData, locations ,filtered) {
     updatedLocations = locations
        .map(location => {
            const matchingStore = storeData.find(store => store.store_code === location.code);
            if (matchingStore) {
                return {
                    ...location,
                    ...matchingStore
                };
            }
            // return null;
        }).filter(value => value);
    pdpLocations = updatedLocations;
    if (filtered){
        displayResults(updatedLocations.filter(location => location.stock !== 0), location => getPDPStructure(location), true);
    }else {
        displayResults(updatedLocations, location => getPDPStructure(location), true);
    }
}

function filterPdp() {

    if(switchEl.classList.contains('filter-switch-checked')) {
        displayResults(pdpLocations, location => getPDPStructure(location), true);
    } else{
        displayResults(pdpLocations.filter(location => location.stock !== 0), location => getPDPStructure(location),true);
    }
}


export function handleStoreNameChange() {
    const storeName = localStorage.getItem('storeDataLocal');
    if(storeName) {
        document.querySelector('.navUser-action-text-text').innerText = JSON.parse(storeName).storeName;
    }
}

export function handleStoreNameSelected(){
    const storeNameSelected = localStorage.getItem('storeDataLocal');
    if(storeNameSelected) {
        let selectedStore = JSON.parse(storeNameSelected).storeName;
        let searchResult = document.querySelectorAll("#searchResults .search-result-layout");
        let errorMessage = document.querySelectorAll(".errorMessageLocation");
        errorMessage.forEach(errorMessage => {
            errorMessage.classList.add("hidden");
        });

        searchResult.forEach(el => {
            if (el.querySelector(".storeName").value === selectedStore) {
                el.classList.add("active");
            }
        });
    }
}

export const handleUserLocation = async (isPdp) => {
    const locationAutocompleteInput = document.getElementById('locationSearchAutocomplete');
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;
                sortedLocations = sortLocationsByDistance(locations, userLat, userLng);
                const updatedUserLocationsId = sortedLocations.slice(0, 10).map(location => location.code);

                // Update the value of the input field with "Your current position"
                locationAutocompleteInput.value = 'La tua posizione attuale';

                if (isPdp) {
                    try {
                        const userLocationStores = await fetchStoreData(productId, updatedUserLocationsId);
                        handleDataAfterFetch(userLocationStores, sortedLocations.slice(0, 10), false);
                    } catch (error) {
                        console.error('Error fetching store data:', error);
                    }
                } else {
                    displayResults(sortedLocations.slice(0, 10), location => getHomeStructure(location), false);
                }
            },
            (error) => {
                if (error.code === error.PERMISSION_DENIED) {
                    let errorMessage = document.querySelectorAll(".errorMessageLocation");

                    errorMessage.forEach(errorMessage => {
                        errorMessage.classList.remove("hidden");
                    });
                }else {
                    let errorMessage = document.querySelectorAll(".errorMessageLocation");
                    errorMessage.forEach(errorMessage => {
                        errorMessage.classList.add("hidden");
                    });
                }
            }
        );
    }
};

export function sortLocationsByDistance(locations, searchLat, searchLng) {
    const allLocations = [...locations];
    return allLocations.sort((a, b) => {
        const distanceA = calculateDistance(searchLat, searchLng, a.custom_attributes.latitudine, a.custom_attributes.longitudine);
        const distanceB = calculateDistance(searchLat, searchLng, b.custom_attributes.latitudine, b.custom_attributes.longitudine);
        a['distance'] = distanceA;
        b['distance'] = distanceB;
        return distanceA - distanceB;
    });
}

export function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

export async function displayResults(results, htmlStructure, isPDP) {
    let resultContainerId = isPDP ? 'searchStores-PDP' : 'searchResults';
    const resultsContainer = document.getElementById(resultContainerId);
    resultsContainer.innerHTML = ''; // Clear previous results

    for (let i = 0; i < results.length; i++) {
        const location = results[i];
        const resultItem = document.createElement('div');
        resultItem.classList.add("search-result-layout");

        const locationHTML = htmlStructure(location);
        resultItem.innerHTML = locationHTML;

        resultsContainer.appendChild(resultItem);

        //check if store is selected add class active
        handleStoreNameSelected();
    }

    const hoursIconArrow = document.querySelectorAll('.open-hours-layout');
    hoursIconArrow.forEach((arrow) => {
        arrow.addEventListener('click', function () {
            const hoursTableBelow = event.target.closest(".data-row.open-hours").querySelector(".open-hours-below ");
            if (hoursTableBelow) {
                hoursTableBelow.classList.toggle('hidden');
            }
        });
    });

    const selectStoreButtons = document.querySelectorAll(".search-result-layout .selectStoreButton");
    selectStoreButtons.forEach(storeButton => {
        storeButton.addEventListener("click", async (event) => {
            // Remove the active class for all
            selectStoreButtons.forEach(button => {
                let storeParent = button.parentElement.parentElement.parentElement;
                if (storeParent) {
                    storeParent.classList.remove('active');
                }
            });

            let selectedStore = storeButton.closest(".search-result-layout");

            // Set the current button as active
            selectedStore.classList.add('active');


            // Retrieve store information directly from the clicked button
            let storeName = selectedStore.querySelector(".storeName").value;
            let storeCode = selectedStore.querySelector(".storeCode").value;
            let storeStreet = selectedStore.querySelector(".storeStreet").value;
            let storeId = selectedStore.querySelector(".storeId").value;
            let storeState = selectedStore.querySelector(".storeState").value;
            let storeCodePromo = selectedStore.querySelector(".codeOriginale").value;
            let storeCodeArray = [storeCode];

            // Store the information in local storage
            let storeDataLocal = { storeName, storeCode, storeStreet, storeId, storeState, storeCodePromo};
            localStorage.setItem("storeDataLocal", JSON.stringify(storeDataLocal));

            try {
                if (productId){
                    const productInformation = await fetchStoreData(productId, storeCodeArray);
                    updatePDP(true, productInformation, storeDataLocal);
                }


                let localStorageCheck = window.checkLocalStorage;

                if (localStorageCheck){
                   window.checkLocalStorage();
                }

                const searchSidebar = document.querySelector("#sidebar-storeLocator-PDP");
                const htmlElement = document.querySelector("html");
                if (searchSidebar) {
                    searchSidebar.addEventListener("click", () => {

                        const matchingElement = document.querySelector(`[data-sidebar="sidebar-storeLocator-PDP"]`);
                        const closestCustomOverlay = matchingElement.nextElementSibling;

                        if (matchingElement) {
                            matchingElement.classList.add("is-open");
                            htmlElement.classList.add("noScroll");
                            closestCustomOverlay.classList.add('custom-overlay-visible');
                        }
                    });
                }
                const  closeSidebar = document.querySelector(".close-sidebar-PDP");

                if(closeSidebar){
                    closeSidebar.addEventListener("click", () => {
                        const sidebarContainer = document.querySelector(`[data-sidebar="sidebar-storeLocator-PDP"]`);

                        htmlElement.classList.remove("noScroll");
                        sidebarContainer.classList.remove("is-open");
                        sidebarContainer.nextElementSibling.classList.remove("custom-overlay-visible");
                    });
                }
            } catch (error) {
                console.error('Error fetching store data:', error);
            }

            let closeButton = document.querySelector("#sessionStoreModal .modal-close");
            if (closeButton) {
                closeButton.click();
            }

            handleStoreNameChange();

            // createSlick();

            let slickData = {
                "infinite": true,
                "dots": false,
                "slidesToShow": 1,
                "slidesToScroll": 1
            };
            let slickContainer = document.querySelector("#flyer-card-slick");
            if (slickContainer) {
                slickContainer.setAttribute("data-slick", JSON.stringify(slickData));
            }
        });
    });
}


// export function to generate HTML for displaying hours
export function generateHoursHTML(hours) {
    const daysOfWeek = ['lunedi', 'martedi', 'mercoledi', 'giovedi', 'venerdi', 'sabato', 'domenica'];
    let hoursHTML = '';
    for (const day of daysOfWeek) {
        hoursHTML += `<span class="day text-roboto-s-regular">${day}: </span> <span class="hours  text-roboto-s-bold">${hours[day]}</span>`;
    }
    return hoursHTML;
}

export async function fetchStoreData(productId, storeIds, isProductId = true) {
    if (window.getAuthToken) {
        const token = await getAuthToken();


        const productAndStock = `${integration_url}/api/catalog/products/qty-and-price`;


        const propertyName = isProductId ? 'bc_reference' : 'product_sku';
        const data = fetch(productAndStock, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            // body: JSON.stringify({ store_ids: storeIds}),
            body: JSON.stringify({ [propertyName]: productId, "store_codes": storeIds }),
        })
            .then(response => response.json())
            .then(responseData => {
                if (responseData.error) {
                    throw new Error(responseData.error.bcReference[0]);
                } else {
                    return responseData.data.storesData;
                }
            })
            .catch(error => {
                const errorMessage = `
    <div class="alertBox productAttributes-message" >
        <div class="alertBox-column alertBox-icon">
            <icon glyph="ic-success" class="icon" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path></svg></icon>
        </div>
        <p class="alertBox-column alertBox-message">${error}</p>
    </div>
    `
                bookProdContainer.innerHTML = errorMessage;
            });
        return data;

    }

}

window.getAuthToken = async () => {
    const sessionToken = sessionStorage.getItem('auth-token');
    if(sessionToken) return sessionToken;

    const url = `${integration_url}/api/authenticate`;

    const params = {
        email: 'tech@eurostep.it',
        password: '1Trony2024!!'
    };
    const token = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(params),
    })
        .then(response => response.json())
        .then(data => {
            sessionStorage.setItem('auth-token', data.token);
            return data.token;
        })
        .catch(error => {
            // Handle errors
            console.error('Error:', error);
        });
    return token;
}
export function updatePDP(hasStore, prodInfo, storeInfo) {
    if (hasStore && prodInfo) {
        let prodStock = prodInfo[0].stock;
        let prodDaysAvailable = prodInfo[0].days_available;
        let prodPrice = prodInfo[0].price;
        let storeAddress = storeInfo.storeStreet;
        let storeCity = storeInfo.storeName;
        let storeCode = storeInfo.storeCode;
        let volantinoTitle = prodInfo[0].volantini_title;
        let productSku = document.getElementById("productSku").value;
        let availableCard;
        let notAvailableCard;


        if (prodStock > 1 && prodDaysAvailable > 0) {
            availableCard = `
                ${volantinoTitle ? `
                <div class="volantiniTitle">
                    <p class="text-roboto-xxs-bold color-white-100">Volantino:</p>
                    <p class="text-roboto-xxs-regular color-white-100">${volantinoTitle}</p>
                </div>` : ''}
                <div class="productCard-container border-digital-blue-20">
                    <div class="book-product-title-wrapper">
                        <div class="book-product-title">
                            <p class="color-digital-blue-100 text-roboto-l-bold"> ${lang.book_product.promo_header}</p>
                        </div>
                        <div class="store-details">
                            <div class="book-product-store-name">
                                <p class="text-roboto-s-bold color-grey-100 storeCity">${storeCity}</p>
                                <p class="text-roboto-s-regular color-grey-100">${storeAddress}</p>
                            </div>
                            <div class="change-store-button">
                                <a id="sidebar-storeLocator-PDP" class="text-roboto-s-medium color-bright-blue-100">${lang.book_product.cambia_negozio}</a>
                                <svg><use href="#icon-admin-edit"></use></svg>
                            </div>
                        </div>
                    </div>
                    <div class="prod-availability">
                        <div class="prod-availability-wrapper">
                            <div class="prod-available-icon"></div>
                            <p class="text-roboto-s-regular color-grey-100">${lang.book_product.available} ${prodDaysAvailable}gg</p>
                        </div>
                        <div class="product-price">
                            <p class="text-anton-xl-regular color-digital-red-100 prodPrice" id="productPrice">${prodPrice} ${currencySymbol}</p>
                        </div>
                    </div>
                    <div class="book-product-search-negozi">
                        <a href="/booking-checkout/?ProductRefID=${productSku}@Trony-B2C&StoreID=${storeCode}" id="prenota-ritiro" class="selectStoreButton button second-button-rounded border-digital-red-100">${lang.book_product.prenota_button} <svg><use href="#icon-shop-pdp"></use></svg></a>
                        <input class="hidden" data-value-price value="${prodPrice} ${currencySymbol}">
                    </div>
                </div>
            `;
            bookProdContainer.innerHTML = availableCard;
        } else {
            notAvailableCard = `
                ${volantinoTitle ? `
                <div class="volantiniTitle">
                    <p class="text-roboto-xxs-bold color-white-100">Volantino:</p>
                    <p class="text-roboto-xxs-regular color-white-100">${volantinoTitle}</p>
                </div>` : ''}
                <div class="productCard-container not-availableStore border-digital-blue-20">
                    <div class="productCard-title-wrapper">
                        <div class="book-product-title">
                            <p class="color-digital-blue-100 text-roboto-l-bold">${lang.book_product.promo_header}</p>
                        </div>
                        <div class="productCard-infos">
                            <div class="book-product-store-name">
                                <p class="text-roboto-s-bold color-grey-100"><b>${storeCity}</b></p>
                                <p class="address-text text-roboto-s-regular color-grey-100">${storeAddress}</p>
                            </div>
                            <div class="productCard-changeStore">
                                <a id="sidebar-storeLocator-PDP" class="text-roboto-s-medium color-bright-blue-100">${lang.book_product.cambia_negozio}</a>
                                <svg><use href="#icon-admin-edit"></use></svg>
                            </div>
                        </div>
                    </div>
                    <div class="content-wrapper">
                        <div class="prod-notAvailable">
                            <div class="prod-not-available-icon"></div>
                            <p class="text-roboto-s-regular color-grey-100">${lang.book_product.not_available}</p>
                        </div>
                    </div>
                </div>
            `;
            bookProdContainer.innerHTML = notAvailableCard;
        }
    } else {
        const storeNotSelected = `
            <div class="notSelectedStore-card">
                <div class="book-product-title">
                    <p class="text-roboto-l-bold color-digital-blue-100">${lang.book_product.promo_header}</p>
                </div>
                <p class="text-roboto-s-regular color-grey-100 notSelectedStore-text">Verifica disponibilità e promozioni del tuo punto vendita</p>
                <div class="book-product-search-negozi">
                    <button class="button second-button-rounded border-bright-blue-100 color-bright-blue-100 text-roboto-s-bold" id="sidebar-storeLocator-PDP">
                        Scegli negozio <svg><use href="#icon-shop-pdp-blue"/></svg>
                    </button>
                </div>
            </div>
        `;
        if (bookProdContainer){
            bookProdContainer.innerHTML = storeNotSelected;
        }
    }
}


handleStoreNameChange();

let filterSwitch = document.getElementById('filter-switch-PDP');

if (filterSwitch) {
    filterSwitch.addEventListener('click', () => filterPdp());
}
document.getElementById('userLocationBtn').addEventListener('click', () => handleUserLocation(false));
// Call the initAutocomplete export function when the page is loaded
window.addEventListener('load', initAutocomplete('locationSearchAutocomplete'));



