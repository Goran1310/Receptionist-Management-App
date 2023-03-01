
 // Define arrays for staff members and delivery drivers
const staffList = [];
const deliveryDrivers = [];
const numberOfEmployees = 5;
// Define a class for employees. 
class Employee {
  constructor(name, surname) {
      this.name = name;
      this.surname = surname;
  }
}
// Define a class for the staff members. 
class StaffMember extends Employee {
  constructor(name, surname, picture, email) {
      super(name, surname);
      this.picture = picture;
      this.email = email;
      this.status = "";
      this.outTime = "";
      this.duration = "";
      this.expectedReturnTime = "";
  }
  // Toast with the correct information, when a staff member has not returned by the expected return time.
  staffMemberIsLate() {
      $("#toastInfo").append(
        `<p><img src='${this.picture}' height='50px' width='50px' alt='staff picture'></p>
        <p><strong>Staff Member:</strong> ${this.name} ${this.surname}</p>
        <p<strong>Duration Out:</strong> ${this.duration}</p><br>`
      )
      $("#liveToast").toast("show")
      }
}
// staffUserGet function that makes API calls and processes the response
function staffUserGet() {
  // Use jQuery's ajax function to make an API call
  $.ajax({
    url: 'https://randomuser.me/api/?results=5&nat=gb,dk,fr',
    dataType: 'json',
    success: function(data) {
      console.log(data);
            // Loop through the number of employees
      for (let i = 0; i < numberOfEmployees; i++) {
        // Push new StaffMember objects into the staffList array
        staffList.push(new StaffMember(
          data.results[i].name.first,
          data.results[i].name.last,
          data.results[i].picture.large,
          data.results[i].email
          ));
        }
        // Loop through the number of employees
        for (let i = 0; i < numberOfEmployees; i++) {
        // Append the staff information to the staffTable
          $("#staffTable").append(
          `<tr><td class="col-2"><img src='${staffList[i].picture}' height='70px' width='70px' alt='staff picture'></td><td>${staffList[i].name}</td><td>${staffList[i].surname}</td><td>${staffList[i].email}</td><td>In</td><td class='time'></td><td></td><td class="col-2"></td></tr>`
          );
        }
    }
  });
}  

function digitalClock(type) {
  const clock = document.getElementById('clock');
  const date = new Date();
  const formattedDate = formatDate(date);

  clock.children[0].innerHTML = formattedDate.day;
  clock.children[1].innerHTML = formattedDate.month;
  clock.children[2].innerHTML = date.getFullYear();
  clock.children[3].innerHTML = formattedDate.hours;
  clock.children[4].innerHTML = formattedDate.minutes;
  clock.children[5].innerHTML = formattedDate.seconds;

  if (type === "currentTime") {
    return formattedDate.hours + ":" + formattedDate.minutes;
  }
  if (type === "time") {
    return `${formattedDate.day}-${formattedDate.month}-${date.getFullYear()} ${formattedDate.hours}:${formattedDate.minutes} ${formattedDate.seconds}`;
  }

  return;

  function formatDate(date) {
    const day = (date.getDate() < 10) ? `0${date.getDate()}` : date.getDate();
    const month = (date.getMonth() + 1 < 10) ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    const hours = (date.getHours() < 10) ? `0${date.getHours()}` : date.getHours();
    const minutes = (date.getMinutes() < 10) ? `0${date.getMinutes()}` : date.getMinutes();
    const seconds = (date.getSeconds() < 10) ? `0${date.getSeconds()}` : date.getSeconds();
    
    return { day, month, hours, minutes, seconds };
  }
}
// ---------
function staffOut() {
  let selectedRow = $("#staffTable tbody tr.selected");
  let staffMember = staffList[selectedRow.index()];
  staffMember.status = "Out";
  staffMember.outTime = digitalClock("currentTime");
  // clicking ‘ Out’ prompts the user for data, updates the relevant staff member’s object, and then updates the Staff table.
  staffMember.duration = parseInt(prompt(`Length of the ${staffMember.name} absence in minutes?`));
  // Expected Return Time
  staffMember.expectedReturnTime = (new Date(new Date().getTime() + staffMember.duration * 60000).toLocaleTimeString()).slice(0, -3);
  // Update the table with the new information
  selectedRow.children().eq(4).text(staffMember.status);
  selectedRow.children().eq(5).text(staffMember.outTime);
  selectedRow.children().eq(7).text(staffMember.expectedReturnTime);
  //In hours and minutes if equal or greater than 60minutes
  if (staffMember.duration >= 60) {
    let hours = Math.floor(staffMember.duration / 60);
    let minutes = staffMember.duration % 60;
    staffMember.duration = hours + "h " + minutes + "m";
  } else {
    staffMember.duration = staffMember.duration + "m";
  }
  // Expected Return Time need to be in regular expression e.g. 12:00
  selectedRow.children().eq(6).text(staffMember.duration);
  // Toast for late return bydefault false
  var toastShown = false;  
  function showReturnToast() {

    if (staffMember.status === "Out" && staffMember.expectedReturnTime === digitalClock("currentTime") && toastShown === false) {
      staffMember.staffMemberIsLate();
      toastShown = true;
      setTimeout(function() {
        $("#liveToast").toast("hide");
        $("#toastInfo").empty();
      }, 5000);
    }
  }
  selectedRow.removeClass("selected");
  setInterval(showReturnToast, 1000);
}
// clicking ‘ In’ updates the relevant staff member’s object and updates the Staff table.
function staffIn() {
  let selectedRow = $("#staffTable tbody tr.selected");
  let staffMember = staffList[selectedRow.index()];
  staffMember.status = "In";
  console.log(staffMember)
  // staffMember.inTime = digitalClock("currentTime");
  staffMember.expectedReturnTime = "";
  selectedRow.children().eq(4).text(staffMember.status);
  selectedRow.children().eq(5).text("");
  selectedRow.children().eq(6).text("");
  selectedRow.children().eq(7).text("");
  selectedRow.removeClass("selected");
}
// Define a class for the delivery drivers. 
class DeliveryDriver extends Employee {
  constructor(name, surname, vehicle, telephone, deliveryAddres, returnTime) {
    super(name, surname);
    this.vehicle = vehicle;
    this.telephone = telephone;
    this.deliveryAddres = deliveryAddres;
    this.returnTime = returnTime;
  }
  // A deliveryDriverIsLate function that will display a toast message when the delivery driver is late.
  deliveryDriverIsLate() {
      $("#toastDriverInfo").append(
        `<p><strong>Vehicle:</strong> ${this.vehicle}</p>
        <p><strong>Name and surname:</strong> ${this.name} ${this.surname}</p>
         <p><strong>Telephone:</strong>${this.telephone}</p>
         <p><strong>Delivery Addresst:</strong> ${this.deliverAddress}</p>
         <p><strong>Expected Return Time:</strong> ${this.returnTime}</p>
         <br>`
         )
         $("#liveToastDriver").toast("show")
         setTimeout(function() {
          $("#liveToastDriver").toast("hide");
          $("#toastDriverInfo").empty();
        }, 5000);
  }
}

function validateDelivery() {
  const vehicle = $("#vehicle").val();
  const name = $("#name").val();
  const surname = $("#surname").val();
  const telephone = $("#telephone").val();
  const deliveryAddress = $("#address").val();
  const returnTime = $("#returnTime").val();

  const regVehicle = /^(motorcycle|car)$/;
  const regName = /^[a-zA-Z]+$/;
  const regTelephone = /^[0-9]+$/;
  const regTime = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

  if (!regVehicle.test(vehicle)) {
    alert('Please enter "motorcycle" or "car".');
    return false;
  }
  if (!regName.test(name)) {
    alert('Please enter a valid name.');
    return false;
  }
  if (!regName.test(surname)) {
    alert('Please enter a valid surname.');
    return false;
  }
  if (!regTelephone.test(telephone)) {
    alert('Please enter a valid telephone number.');
    return false;
  }
  if (deliveryAddress === "") {
    alert('Please enter a valid delivery address.');
    return false;
  }
  if (!regTime.test(returnTime)) {
    alert('Please enter a valid return time in the format hh:mm.');
    return false;
  }

  return true;
}
// Call validateDelivery() function before adding a new delivery driver to validate the input fields. The function will return true if all fields are filled in with the correct data type and time format, and false otherwise. 

// addDelivery function with validation using Bootstrap and the validateDelivery function to check for valid inputs.
function addDelivery() {
  if (!validateDelivery()) {
    return;
  }
  const vehicle = $("#vehicle").val().toLowerCase();
  const name = $("#name").val().trim();
  const surname = $("#surname").val().trim();
  const telephone = $("#telephone").val().trim();
  const deliveryAddress = $("#address").val().trim();
  const returnTime = $("#returnTime").val().trim();

  // Validate inputs
  const validationErrors = validateDelivery(vehicle, name, surname, telephone, deliveryAddress, returnTime);

  if (validationErrors.length > 0) {
    // Show validation errors in Bootstrap alerts
    const $alertsContainer = $("#alertsContainer");
    $alertsContainer.empty();
    validationErrors.forEach((error) => {
      $alertsContainer.append(`
        <div class="alert alert-danger" role="alert">
          ${error}
        </div>
      `);
    });
    return;
  }

  const vehicleIcon = vehicle === "car" ? '<i class="bi bi-car-front"></i>' : '<i class="bi bi-bicycle"></i>';
  const newDeliveryDriver = new DeliveryDriver(name, surname, vehicle, telephone, deliveryAddress, returnTime);
  deliveryDrivers.push(newDeliveryDriver);

  $("#deliveryT").append(`
    <tr>
      <td>${vehicleIcon}</td>
      <td>${name}</td>
      <td>${surname}</td>
      <td>${telephone}</td>
      <td>${deliveryAddress}</td>
      <td>${returnTime}</td>
    </tr>
  `);

  let driverToast = false;

  function showLateDriver() {
    if (newDeliveryDriver.returnTime === digitalClock("currentTime") && driverToast === false) {
      newDeliveryDriver.deliveryDriverIsLate();
      driverToast = true;
    }
  }
  setInterval(showLateDriver, 1000);

  // Clear input fields
  $("#vehicle").val("");
  $("#name").val("");
  $("#surname").val("");
  $("#telephone").val("");
  $("#address").val("");
  $("#returnTime").val("");

  // Hide validation errors if any
  $("#alertsContainer").empty();
}
// function clearDelivery()
function clearDelivery() {
  $("#deliveryTable .selected").each(function () {
    let telephone = $(this).find("td:eq(3)").text();
    const deliveryDriver = deliveryDrivers.find((deliveryDriver) => deliveryDriver.telephone === telephone);
    //Remove row from users view
    if (confirm(`Are you sure you want to remove ${deliveryDriver.name} ${deliveryDriver.surname} from Delivery Board?`)) {
      $("tr").filter(".selected").remove();                             
    //Remove row from object
      var indexSelected = deliveryDrivers.indexOf(deliveryDriver);      
      deliveryDrivers.splice(indexSelected, 1);
      console.log(deliveryDrivers);
    } else {
      $(this).removeClass("selected");
      }
    });
  }
  $("document").ready(function () {
  if (typeof process !== 'undefined' && process.release.name === 'node') {
    console.log('Running in Node.js');
  } else {
    console.log('Not running in Node.js');
  }
  staffUserGet();
  setInterval(function () {
    $("#date").text(digitalClock("time"));
}, 1000);
// Select a row in the table .toggleClass() method toggles between adding and removing one or more classes from the selected elements.
$("#staffTable tbody").on("click", "tr", function () {
  $(this).toggleClass("selected");
  $(this).css("font-weight", "bold");
  if ($(this).hasClass("selected")) {
    $(this).css("font-weight", "bold");
  } else {
    $(this).css("font-weight", "");
  }
});
$("#staffOut").click(function () {
  staffOut();
});
$("#staffIn").click(function () {
  staffIn();
});

$("#addDelivery").click(function () {
  addDelivery();
});
$("#clearDelivery").click(function () {
  clearDelivery();
});
$("#deliveryTable tbody").on("click", "tr", function () {
  $(this).toggleClass("selected");
  $(this).css("font-weight", "bold");
});
$("#showLateDrivers").click(function () {
  showLateDriver();
})
// Add hover animation on buttons in the Dashboard
$(".btn").hover(function() {
  $(this).css("background-color", "#6c757d");
  }, function() {
  $(this).css("background-color", "");
  });
});
