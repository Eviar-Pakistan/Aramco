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

    console.log("Form Data:", { name, contact, email, fuel, vehicle, receipt });
    
    let contactNo = Number(contact)
    
    function generateRandomId() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let randomId = '';
        
        for (let i = 0; i < 36; i++) {
          randomId += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        return randomId;
      }
      
      // Example usage:
      const randomId = generateRandomId();
      console.log(randomId); // Outputs a 36-character random ID
      
    


    try {
        fetch('send_sms', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify({ contactNo: contactNo, randomId: randomId})
        })  
            .then(response => {
                response.json()
                console.log("Response==>", response)
            })
            .then(data => {
                console.log("Data==>",data)
                if (data.success) {
                    console.log("Successfully sent the message.",data)
                }
            })
            .catch(error=> {
            console.log("Error while sending message", error)
            })
        
    }

    catch (error) {
        console.log("Error while sending message",error)
        
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