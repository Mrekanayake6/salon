
/* =========================================================
   KFC GOOGLE REVIEWS
   Google Maps JavaScript API
   Places API (New)
========================================================= */


/* =========================================================
   CONFIGURATION
========================================================= */

// We use Text Search (New) to find the KFC location.
//
// This avoids hard-coding a Place ID.
//
// If you already know the exact Place ID later,
// you can replace the search method with:
//
// new google.maps.places.Place({
//     id: "YOUR_PLACE_ID"
// });

const BUSINESS_QUERY = "KFC Colombo 1, Sri Lanka";


/* =========================================================
   DOM ELEMENTS
========================================================= */

const placeNameElement =
    document.getElementById("placeName");

const placeAddressElement =
    document.getElementById("placeAddress");

const placeRatingElement =
    document.getElementById("placeRating");

const ratingStarsElement =
    document.getElementById("ratingStars");

const reviewCountElement =
    document.getElementById("reviewCount");

const reviewsContainer =
    document.getElementById("reviewsContainer");

const googleMapsLink =
    document.getElementById("googleMapsLink");


/* =========================================================
   WAIT FOR GOOGLE MAPS
========================================================= */

window.addEventListener("load", () => {

    loadGoogleReviews();

});


/* =========================================================
   LOAD GOOGLE REVIEWS
========================================================= */

async function loadGoogleReviews() {

    try {

        showLoading();


        /*
         * Import the modern Places library.
         */

        const { Place } =
            await google.maps.importLibrary("places");


        /*
         * Search for the KFC business.
         *
         * We request only the fields needed to identify
         * the correct business.
         */

        const searchRequest = {

            textQuery: BUSINESS_QUERY,

            fields: [
                "id",
                "displayName",
                "formattedAddress",
                "location"
            ],

            language: "en",

            region: "LK",

            maxResultCount: 5

        };


        const searchResult =
            await Place.searchByText(searchRequest);


        const places =
            searchResult.places;


        /*
         * Make sure a result exists.
         */

        if (!places || places.length === 0) {

            throw new Error(
                "KFC Colombo 1 could not be found."
            );

        }


        /*
         * The first result should normally be the
         * requested KFC location.
         */

        const place =
            places[0];


        /*
         * Now request the detailed fields.
         *
         * Reviews are requested here.
         */

        await place.fetchFields({

            fields: [
                "displayName",
                "formattedAddress",
                "rating",
                "userRatingCount",
                "reviews",
                "googleMapsURI"
            ]

        });


        /*
         * Render place information.
         */

        renderPlace(place);


        /*
         * Render reviews.
         */

        renderReviews(place.reviews);


    } catch (error) {

        console.error(
            "Google Places error:",
            error
        );

        showError(error);

    }

}


/* =========================================================
   RENDER PLACE INFORMATION
========================================================= */

function renderPlace(place) {

    /*
     * Business name
     */

    placeNameElement.textContent =
        place.displayName || "KFC";


    /*
     * Address
     */

    placeAddressElement.textContent =
        place.formattedAddress ||
        "Colombo, Sri Lanka";


    /*
     * Rating
     */

    if (typeof place.rating === "number") {

        placeRatingElement.textContent =
            place.rating.toFixed(1);

        ratingStarsElement.textContent =
            createStars(place.rating);

    } else {

        placeRatingElement.textContent =
            "—";

        ratingStarsElement.textContent =
            "★★★★★";

    }


    /*
     * Review count
     */

    if (
        typeof place.userRatingCount === "number"
    ) {

        reviewCountElement.textContent =
            `${place.userRatingCount.toLocaleString()} Google Reviews`;

    } else {

        reviewCountElement.textContent =
            "Google Reviews";

    }


    /*
     * Google Maps link
     */

    if (place.googleMapsURI) {

        googleMapsLink.href =
            place.googleMapsURI;

    } else {

        googleMapsLink.href =
            "https://www.google.com/maps/search/?api=1&query=KFC+Colombo+1";

    }

}


/* =========================================================
   RENDER REVIEWS
========================================================= */

function renderReviews(reviews) {

    /*
     * Google may return no reviews.
     */

    if (!reviews || reviews.length === 0) {

        reviewsContainer.innerHTML = `

            <div class="error-state">

                <i class="bi bi-chat-square-text"></i>

                <h3>
                    No reviews available
                </h3>

                <p>
                    Google did not return reviews
                    for this place right now.
                </p>

            </div>

        `;

        return;

    }


    /*
     * Clear loading state.
     */

    reviewsContainer.innerHTML = "";


    /*
     * Google Places API returns up to five
     * reviews for a Place object.
     */

    reviews.forEach((review) => {

        const card =
            createReviewCard(review);

        reviewsContainer.appendChild(card);

    });

}


/* =========================================================
   CREATE REVIEW CARD
========================================================= */

function createReviewCard(review) {

    const card =
        document.createElement("article");

    card.className =
        "review-card";


    /*
     * Author information
     */

    const author =
        review.authorAttribution;


    const authorName =
        author?.displayName ||
        "Google User";


    const authorUri =
        author?.uri || "#";


    const authorPhoto =
        author?.photoURI || "";


    /*
     * Review text
     */

    const reviewText =
        review.text || "";


    /*
     * Rating
     */

    const rating =
        review.rating || 0;


    /*
     * Relative publish time
     */

    const publishTime =
        review.relativePublishTimeDescription ||
        "";


    /*
     * Safely create HTML.
     *
     * User-generated review text is inserted
     * using textContent below rather than trusting
     * raw HTML.
     */

    card.innerHTML = `

        <div class="review-header">

            ${
                authorPhoto
                    ? `
                        <img
                            class="author-photo"
                            src="${escapeAttribute(authorPhoto)}"
                            alt="${escapeAttribute(authorName)}"
                        >
                    `
                    : `
                        <div
                            class="author-photo
                                   d-flex
                                   align-items-center
                                   justify-content-center"
                        >
                            <i class="bi bi-person"></i>
                        </div>
                    `
            }


            <div class="author-details">

                <a
                    class="author-name"
                    href="${escapeAttribute(authorUri)}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    ${escapeHTML(authorName)}
                </a>

                <span class="review-time">
                    ${escapeHTML(publishTime)}
                </span>

            </div>

        </div>


        <div class="review-rating">

            ${createStars(rating)}

        </div>


        <p class="review-text">

            ${escapeHTML(reviewText)}

        </p>


        <div class="review-source">

            <span class="review-source-icon">
                G
            </span>

            <span>
                Google Review
            </span>

        </div>

    `;


    return card;

}


/* =========================================================
   CREATE STARS
========================================================= */

function createStars(rating) {

    const rounded =
        Math.round(rating);


    return "★".repeat(rounded) +
           "☆".repeat(5 - rounded);

}


/* =========================================================
   LOADING STATE
========================================================= */

function showLoading() {

    reviewsContainer.innerHTML = `

        <div class="loading-state">

            <div
                class="spinner-border"
                role="status"
            ></div>

            <p>
                Loading real Google reviews...
            </p>

        </div>

    `;

}


/* =========================================================
   ERROR STATE
========================================================= */

function showError(error) {

    reviewsContainer.innerHTML = `

        <div class="error-state">

            <i class="bi bi-exclamation-circle"></i>

            <h3>
                Unable to load Google reviews
            </h3>

            <p>
                Check your Google Maps API key,
                Places API configuration,
                billing and website restrictions.
            </p>

        </div>

    `;

}


/* =========================================================
   SECURITY HELPERS
========================================================= */

/*
 * Escape HTML text before inserting it into
 * dynamically generated markup.
 */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/*
 * Escape attribute values.
 */

function escapeAttribute(value) {

    return escapeHTML(value);

}
