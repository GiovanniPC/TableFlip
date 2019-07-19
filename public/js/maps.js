function startMap() {

  const geocoder = new google.maps.Geocoder();
  const infowindow = new google.maps.InfoWindow();

  // Store Ironhack's coordinates
  const Brazil = { lat: -11.409874,  lng: -41.280857 };

  // Initialize the map
  const map = new google.maps.Map(document.getElementById('map'), 
    {
      zoom: 12,
      center: Brazil
    }
  );

  function geocodeAddress(geocoder, resultsMap, user) {
          
    geocoder.geocode({ 'address': user.address }, function (results, status) {
    
        if (status === 'OK') {
            let marker = new google.maps.Marker({
                map: resultsMap,
                position: results[0].geometry.location
            });

            const fullName = `${user.firstName} ${user.lastName} <br> ${user.email}`;

            google.maps.event.addListener(marker, "click", function() {
                infowindow.setContent(fullName);
                infowindow.open(map, this);
            });
        } else {
        alert('Geocode was not successful for the following reason: ' + status);
        }
    });
  };

  const peopleList = document.getElementById('people-list');
  let people =``;

  axios.get('http://localhost:3000/get-address')
  .then(response => {
      response.data.forEach(element => {
        people += `<h4> ${element.firstName} ${element.lastName} </h4>`;
          if(element.address){
            geocodeAddress(geocoder, map, element);
            peopleList.innerHTML = people;
          }
      });
  });



  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      const user_location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      // Center map with user location
      map.setCenter(user_location);

      // Add a marker for your user location
      const userLocation = new google.maps.Marker({
        position: {
          lat: user_location.lat,
          lng: user_location.lng
        },
        map: map,
        title: "You are here."
      });


    });
  } else {
    console.log('Browser does not support geolocation.');
  }

}

startMap();