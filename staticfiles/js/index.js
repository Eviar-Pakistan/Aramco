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
OpenTerms.addEventListener('click', () => { 
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
        alert("Name must contain only alphabets and spaces.");
        return;
    }

    // Validation for Contact: should start with '03' and contain exactly 11 digits
    const contactRegex = /^03\d{9}$/;
    if (!contactRegex.test(contact)) {
        alert("Contact number must start with '03' and be 11 digits long.");
        return;
    }

    console.log("Form Data:", { name, contact, email, fuel, vehicle, receipt });

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
    console.log(randomId); // Outputs a 36-character random ID

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
                console.log("Response==>", response);
            })
            .then(data => {
                console.log("Data==>", data);
                if (data.success) {
                    console.log("Successfully sent the message.", data);
                }
            })
            .catch(error => {
                console.log("Error while sending message", error);
            });
    } catch (error) {
        console.log("Error while sending message", error);
    }

    try {
        // Send form data to the backend using fetch
        const response = await fetch("/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json", // Sending JSON data
                "X-CSRFToken": document.querySelector('[name=csrfmiddlewaretoken]').value, // CSRF token for Django
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

            popup.classList.remove("hidden");
            main.classList.add("hidden");
            main_bg.classList.add("hidden");

            console.log("Server Response:", data);
            form.reset(); // Clear the form fields
        } else {
            throw new Error("Failed to submit the form");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while submitting the form. Please try again.");
    }
});
