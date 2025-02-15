
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
const vehicleTypeEncoded = new URLSearchParams(window.location.search).get('vehicle');
const cityEncoded = new URLSearchParams(window.location.search).get('station');
const companyEncoded = new URLSearchParams(window.location.search).get('company');
if (companyEncoded) {
  try {
    const decodedCompany = atob(companyEncoded); 
    console.log("Decoded Company:", decodedCompany);
        localStorage.setItem("company", decodedCompany);
    if (decodedCompany === "Aramcocooperator" && window.location.pathname !== '/operator_login/') {
      window.location.href = `/operator_login/?vehicle=${vehicleTypeEncoded}&station=${cityEncoded}`;
      localStorage.removeItem('submittedEntries'); 
    }
  } catch (error) {
    console.error("Error decoding company parameter:", error);
  }
}

const isLoggedIn = localStorage.getItem('isLoggedIn')
if (isLoggedIn && !['/submit_bonus_entry/', '/'].includes(window.location.pathname)) {
  window.location.href = `/?vehicle=${vehicleTypeEncoded}&station=${cityEncoded}` ;
}

const savedCompany = localStorage.getItem("company")
document.addEventListener('DOMContentLoaded', () => {


console.log(vehicleTypeEncoded , cityEncoded)

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
closeTerms && closeTerms.addEventListener('click', () => {
    termsModal.classList.add("hidden");
    main.classList.remove("hidden");
    main_bg.classList.remove("hidden");
 })


submitButton && submitButton.addEventListener('click', async (e) => {
  e.preventDefault();

  // Get the form and its values
  const form = document.querySelector("form");
  const name = document.getElementById("name").value.trim();
  const contact = document.getElementById("contact").value.trim();
  const email = document.getElementById("email").value.trim();
  const cnic = document.getElementById("cnicNo").value.trim()
  const fuel = document.getElementById("fuel").value.trim();
  const vehicle = document.getElementById("vehicle").value.trim();
  const receipt = document.getElementById("receipt").value.trim();
  const checkbox = document.getElementById("checkbox2").checked
  const vehicleTypeEncoded = new URLSearchParams(window.location.search).get('vehicle');
  const cityEncoded = new URLSearchParams(window.location.search).get('station');
  const operator = localStorage.getItem("company")
  let vehicleType = null;
  let city = null;

  if (vehicleTypeEncoded) {
      try {
          vehicleType = atob(vehicleTypeEncoded);
      } catch (error) {
          console.error("Error decoding vehicle type:", error);
          vehicleType = null;
      }
  }

  if (cityEncoded) {
      try {
          city = atob(cityEncoded);
      } catch (error) {
          console.error("Error decoding city:", error);
          city = null;
      }
  }
  if (companyEncoded) {
    try {
      const company = atob(companyEncoded);
        if (company === "Aramcocooperator"){
            if (localStorage.getItem('company') !== companyEncoded) {
                localStorage.setItem('company', companyEncoded);
                window.location.href = `/operator_login/?vehicle=${vehicleTypeEncoded}&station=${cityEncoded}`;
                localStorage.removeItem('submittedEntries');
            }
        }
    } catch (error) {
        console.error("Error decoding company parameter:", error);
    }
  }

  // Rest of the code for form submission remains the same...
  const popup = document.getElementById("popup");
  if (!name || !contact || !cnic || !fuel || !vehicle ) {
      Swal.fire({
          title: "Failed to Submit",
          text: "Please fill in all required fields: Name, CNIC, Phone number and Vehicle number",
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

  // Validate name, contact, and other form fields
  const nameRegex = /^[A-Za-z\s]+$/;
  if (!nameRegex.test(name)) {
      Swal.fire({
          title: "Failed to Submit",
          text: "Name must contain only alphabets and spaces.",
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

  const cnicRegex = /^\d{5}-\d{7}-\d{1}$/; 
  if (!cnicRegex.test(cnic)) {
      Swal.fire({
          title: "Failed to Submit",
          text: "CNIC must be in the format XXXXX-XXXXXXX-X.",
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

  const contactRegex = /^03\d{9}$/;
  if (!contactRegex.test(contact)) {
      Swal.fire({
          title: "Failed to Submit",
          text: "Contact number must start with '03' and be 11 digits long.",
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

  if (!checkbox) {
    Swal.fire({
        title: "Failed to Submit",
        text: "Terms & conditions are required",
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

  // Function to handle the submission once location is successfully retrieved
  const submitFormWithLocation = async (locationData) => {
    try {
        let submittedEntries = JSON.parse(localStorage.getItem('submittedEntries')) || 0;

        if (!isLoggedIn && submittedEntries >= 4) {
            Swal.fire({
                title: "Submission Limit Reached",
                text: "Your device has exceeded the limit of 4 submissions.",
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

        const response = await fetch("/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrftoken,
            },
            body: JSON.stringify({
                name: name,
                contact: contact,
                email: email,
                fuel_type: fuel,
                vehicle_number: vehicle,
                cnic: cnic,
                receipt_number: receipt,
                location: locationData,
                vehicle: vehicleType,
                city: city,
                operator: operator
            }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Server Response:", data);

            // Check if operator is "Aramcooperator"
            if (operator === "Aramcocooperator") {
                fetch('send_sms', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrftoken,
                    },
                    body: JSON.stringify({ contactNo: contactNo, randomId: randomId })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        popup.classList.remove("hidden");
                        main.classList.add("hidden");
                        main_bg.classList.add("hidden");
                        form.reset();
                    }
                })
                .catch(error => {
                    console.error("Error sending SMS:", error);
                });
            } else {
                // Handle successful submission without sending SMS
                popup.classList.remove("hidden");
                main.classList.add("hidden");
                main_bg.classList.add("hidden");
                form.reset();
            }

            if (!isLoggedIn) {
                submittedEntries += 1;
                localStorage.setItem('submittedEntries', JSON.stringify(submittedEntries));
            }

        } else {
            const errorData = await response.json();
            Swal.fire({
                title: "Failed to Submit",
                text: errorData.error || "An error occurred. Please try again.",
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
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while submitting the form. Please try again.");
    }
};

 if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
          (position) => {
              const locationData = {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
              };

              submitFormWithLocation(locationData);
          },
          (error) => {
              console.error("Error obtaining location:", error);
              Swal.fire({
                  title: "Location Access Required",
                  text: "You must grant location access to submit the form.",
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
      );
  } else {
      Swal.fire({
          title: "Location Access Required",
          text: "Geolocation is not supported by your browser. You must grant location access to submit the form.",
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

});



const loginForm = document.getElementById("loginForm");

loginForm && loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  

  if (!username || !password) {
    Swal.fire({
      title: "Failed to Login",
      text: "Username & password are required!",
      icon: 'error',
    });
    return;
  }

  // Get CSRF token from the cookie
  const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

  try {
    const response = await fetch('/operator_login/', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,  // Send CSRF token in the header
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      Swal.fire({ 
        title: "Success",
        text: data.success,
        icon: 'success',
      });
      // Redirect to the bonus entry page or any other page after successful login
      window.location.href = `/?vehicle=${vehicleTypeEncoded}&station=${cityEncoded}`; // Example: redirect to another page after success
      localStorage.setItem("isLoggedIn",true)
    } else {
      Swal.fire({
        title: "Error",
        text: data.error,
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
  } catch (error) {
    console.log(error)
    Swal.fire({
      title: "Error",
      text: "Something went wrong. Please try again.",
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
});



const bonusEntriesForm = document.getElementById("bonusEntriesForm");


  bonusEntriesForm && bonusEntriesForm.addEventListener("submit", async (e) => {
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



});
