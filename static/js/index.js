const submitButton = document.getElementById('submitBtn');

submitButton && submitButton.addEventListener('click', async (e) => {
    e.preventDefault();
    const form = document.querySelector("form");
    const name = document.getElementById("name").value;
    const contact = document.getElementById("contact").value;
    const email = document.getElementById("email").value;
    const fuel = document.getElementById("fuel").value;
    const vehicle = document.getElementById("vehicle").value;
    const receipt = document.getElementById("receipt").value;

    const popup = document.getElementById("popup");
    const main = document.getElementById("main");

    console.log("Form Data:", { name, contact, email, fuel, vehicle,receipt });

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
            // setTimeout(() => { 
            //     popup.classList.add("hidden");
            //     main.classList.remove("hidden");
            // }, 3000);

            // alert("Registration successful!");

            console.log("Server Response:", data);
            form.reset(); // Clear the form fields
        } else {
            throw new Error("Failed to submit the form");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while submitting the form. Please try again.");
    }

})