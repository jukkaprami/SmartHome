const getData = async () => {
    let city = document.getElementById("Turku").value; //input from user.
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api}`;
    try {
      let res = await fetch(url);
      let data = await res.json();
      let lat = data.coord.lat;
      let lon = data.coord.lon;
      getDatafor7days(lat, lon);
    } catch (error) {
      console.log(error);
    }
  };