function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');

const main = document.getElementById("main");
const main_bg = document.getElementById("main_bg");

const submitButton = document.getElementById('submitBtn');
// Terms and conditions Opener
const OpenTerms = document.getElementById('open-terms');
const termsModal = document.getElementById('terms-modal');
const closeTerms = document.getElementById('close-terms-modal');


// Open
 OpenTerms && OpenTerms.addEventListener('click', () => { 
    termsModal.classList.remove("hidden");
    main.classList.add("hidden");
    main_bg.classList.add("hidden");
})

// close
closeTerms.addEventListener('click', () => {
    termsModal.classList.add("hidden");
    main.classList.remove("hidden");
    main_bg.classList.remove("hidden");
 })





 submitButton && submitButton.addEventListener('click', async (e) => {
    e.preventDefault();
    
    const form = document.querySelector("form");
    const name = document.getElementById("name").value.trim(); // Remove leading/trailing spaces
    const contact = document.getElementById("contact").value.trim();
    const email = document.getElementById("email").value.trim();
    const fuel = document.getElementById("fuel").value.trim();
    const vehicle = document.getElementById("vehicle").value.trim();
    const receipt = document.getElementById("receipt").value.trim();

    const popup = document.getElementById("popup");

    if (!name || !contact || !email || !fuel || !vehicle || !receipt) {
        Swal.fire({
            title: "Failed to Submit",
            text:"All fields are required. Please fill in all the fields.",
            icon: 'error',
            customClass: {
                popup: 'custom-swal-popup',
                title: 'custom-swal-title',
                confirmButton: 'custom-swal-confirm-button',
            },
            width: '350px',
            padding: '15px',
        });
        return;
    }

    // Validation for Name: should only contain alphabets
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(name)) {
        Swal.fire({
            title: "Failed to Submit",
            text:"Name must contain only alphabets and spaces.",
            icon: 'error',
            customClass: {
                popup: 'custom-swal-popup',
                title: 'custom-swal-title',
                confirmButton: 'custom-swal-confirm-button',
            },
            width: '350px',
            padding: '15px',
        });
        return;
    }

    // Validation for Contact: should start with '03' and contain exactly 11 digits
    const contactRegex = /^03\d{9}$/;
    if (!contactRegex.test(contact)) {
        Swal.fire({
            title: "Failed to Submit",
            text:"Contact number must start with '03' and be 11 digits long.",
            icon: 'error',
            customClass: {
                popup: 'custom-swal-popup',
                title: 'custom-swal-title',
                confirmButton: 'custom-swal-confirm-button',
            },
            width: '350px',
            padding: '15px',
        });
        return;
    }


    let contactNo = Number(contact);

    function generateRandomId() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let randomId = '';

        for (let i = 0; i < 36; i++) {
            randomId += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return randomId;
    }

    const randomId = generateRandomId();

   

    try {
        // Send form data to the backend using fetch
        const response = await fetch("/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json", // Sending JSON data
                "X-CSRFToken": csrftoken, // CSRF token for Django
            },
            body: JSON.stringify({
                name: name,
                contact: contact,
                email: email,
                fuel_type: fuel, // Matches the field name in the model
                vehicle_number: vehicle,
                receipt_number: receipt,
            }),
        });

        if (response.ok) {
            const data = await response.json();

            try {
                // Send SMS with contact number and random ID
                fetch('send_sms', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrftoken,
                    },
                    body: JSON.stringify({ contactNo: contactNo, randomId: randomId })
                })
                    .then(response => {
                        response.json();
                    })
                    .then(data => {
                        console.log("Data==>", data);
                        if (data.success) {
                        }
                    })
                    .catch(error => {
                    });
            } catch (error) {
            }

            popup.classList.remove("hidden");
            main.classList.add("hidden");
            main_bg.classList.add("hidden");

            console.log("Server Response:", data);
            form.reset(); // Clear the form fields
        } else {
            const errorData = await response.json();
            if (errorData.error && errorData.error.includes("reached the maximum of 4 entries")) {
                Swal.fire({
                    title: "Entry Limit Reached",
                    text: errorData.error,
                    icon: 'error',
                    customClass: {
                        popup: 'custom-swal-popup',
                        title: 'custom-swal-title',
                        confirmButton: 'custom-swal-confirm-button',
                    },
                    width: '350px',
                    padding: '15px',
                });
            } else {
                Swal.fire({
                    title: "Failed to Submit",
                    text: "An error occurred. Please try again.",
                    icon: 'error',
                    customClass: {
                        popup: 'custom-swal-popup',
                        title: 'custom-swal-title',
                        confirmButton: 'custom-swal-confirm-button',
                    },
                    width: '350px',
                    padding: '15px',
                });
            }
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while submitting the form. Please try again.");
    }
});


const bonusEntriesForm = document.getElementById("bonusEntriesForm");

if (bonusEntriesForm) {
  bonusEntriesForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent the default form submission

    const contact = document.getElementById("contact").value;
    const entries = document.getElementById("entries").value;

    // Function to submit the bonus entry data along with location
    const submitData = async (locationData) => {
      try {
        // Send a POST request with the bonus entry data and location data.
        const response = await fetch("/submit_bonus_entry/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken,
          },
          body: JSON.stringify({
            contact: contact,
            entries: entries,
            location: locationData, // locationData should contain latitude and longitude
          }),
        });

        // Attempt to parse JSON from the response
        const data = await response.json();
        console.log(data);

        if (data.success) {
          Swal.fire({
            icon: "success",
            title: "Submitted",
            text: data.success,
            customClass: {
              popup: "custom-swal-popup",
              title: "custom-swal-title",
              confirmButton: "custom-swal-confirm-button",
            },
            width: "350px",
            padding: "15px",
          });
          bonusEntriesForm.reset(); // Reset form fields
        } else {
          Swal.fire({
            icon: "error",
            title: "Submission Error",
            text: data.error,
            customClass: {
              popup: "custom-swal-popup",
              title: "custom-swal-title",
              confirmButton: "custom-swal-confirm-button",
            },
            width: "350px",
            padding: "15px",
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Submission Error",
          text: "There was an error while submitting your entry. Please try again later.",
          customClass: {
            popup: "custom-swal-popup",
            title: "custom-swal-title",
            confirmButton: "custom-swal-confirm-button",
          },
          width: "350px",
          padding: "15px",
        });
      }
    };

    // Check if the browser supports Geolocation
    if (navigator.geolocation) {
      // Ask the user for their location
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          // Submit the form data along with the location data
          submitData(locationData);
        },
        (error) => {
          console.error("Error obtaining location:", error);
          // Show an error message if the user denies location access
          Swal.fire({
            icon: "error",
            title: "Location Access Required",
            text: "You must grant location access to submit the form.",
            customClass: {
              popup: "custom-swal-popup",
              title: "custom-swal-title",
              confirmButton: "custom-swal-confirm-button",
            },
            width: "350px",
            padding: "15px",
          });
        }
      );
    } else {
      // Show an error message if geolocation is not supported by the browser.
      console.error("Geolocation is not supported by this browser.");
      Swal.fire({
        icon: "error",
        title: "Location Access Required",
        text: "Geolocation is not supported by your browser. You must grant location access to submit the form.",
        customClass: {
          popup: "custom-swal-popup",
          title: "custom-swal-title",
          confirmButton: "custom-swal-confirm-button",
        },
        width: "350px",
        padding: "15px",
      });
    }
  });
}


