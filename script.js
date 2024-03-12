const btn  = document.getElementById('btn');
const input = document.getElementById('input');
const output = document.querySelector('.output')
const container = document.querySelector('.container-style')
const forcastDisplayer = document.querySelector('#forcastDisplayer'); 


btn.addEventListener('click', function(e) {
e.preventDefault()
if(input.value == ''){
    return 
}
fetch('https://api.weatherapi.com/v1/current.json?key=b83d999ff3eb430ca00160502230302&q=' + input.value+'&aqi=no')
.then((res) => res.json())    
.then((data) => {
    const wrapper = document.createElement('div');
    const temp = document.createElement('p');
    const local = document.createElement('p');

    const {
        location: {name,localtime}, 
        current:{
            temp_c,
            condition:{text, code}
        }
    } = data


    wrapper.classList.add('dis'); 

    temp.append(temp_c + '°C    ' + name);
    local.append(localtime + '  ' + text);
 
    wrapper.append(temp);
    wrapper.append(local); 

    if(output.hasChildNodes){
        output.innerHTML = ''; 
    }

    output.append(wrapper);
    
    // Display weather image
    checkWeather(data.current.is_day, code)

    // Forecast
    getForcast(name); 
})

.catch(err =>{
    console.log(err);
})

input.value = '';
document.body.classList.toggle('open'); 
})

window.onload = () =>{
        navigator.geolocation.getCurrentPosition(function(position){
        fetch('https://api.weatherapi.com/v1/current.json?key=b83d999ff3eb430ca00160502230302&q=' +`${position.coords.latitude} + ${position.coords.longitude}`)
        .then((res) => res.json())    
        .then((data) => {
            const wrapper = document.createElement('div');
            const temp = document.createElement('p');
            const local = document.createElement('p');
        
            const {
                location: {name,localtime}, 
                current:{
                    temp_c,
                    condition:{text, code}
                }
            } = data
        
            wrapper.classList.add('dis'); 

            temp.append(`${temp_c}°C ${name}`);
            local.append(`${localtime} ${text}`);

            wrapper.append(temp);
            wrapper.append(local); 
        
            if(output.hasChildNodes){
                output.innerHTML = ''; 
            }

            output.append(wrapper);

             // Display weather image
            checkWeather(data.current.is_day, code); 
            
              // Forecast
            getForcast(name); 
        })
    }); 
}

function checkWeather(is_day, code){
    if(!is_day){

        // Clear weather
        container.style.color = 'aliceblue'
        if(code == 1000){
            container.style.backgroundImage = 'url(./weather-condition-images/night/Clear.jpg)'
        }
        
        // cloudy
        else if(
            code == 1003 || 
            code == 1006 ||
            code == 1009 ||
            code == 1030 ||
            code == 1069 ||
            code == 1087 ||
            code == 1135 ||
            code == 1273 ||
            code == 1276 ||
            code == 1279 ||
            code == 1282
        ){
            container.style.backgroundImage = `url(./weather-condition-images/night/Cloudy.jpg)`
        }
        
        // //Rain
        else if(
            code == 1063 ||
            code == 1069 ||
            code == 1072 ||
            code == 1150 ||
            code == 1180 ||
            code == 1183 ||
            code == 1186 ||
            code == 1189 ||
            code == 1192 ||
            code == 1204 ||
            code == 1207 ||
            code == 1240 ||
            code == 1243 ||
            code == 1246 ||
            code == 1249 ||
            code == 1252 
        ){
            container.style.backgroundImage = `url(./weather-condition-images/night/Rainy.jpg)`
        }
        else{
            container.style.backgroundImage = `url(./weather-condition-images/night/Snowy.jpg)`
        }

    }

    if(is_day){

        // Clear weather
        container.style.color = 'black'
        if(code == 1000){
            container.style.backgroundImage = 'url(./weather-condition-images/day/Clear.jpg)'
        }
        
        // cloudy
        else if(
            code == 1003 || 
            code == 1006 ||
            code == 1009 ||
            code == 1030 ||
            code == 1069 ||
            code == 1087 ||
            code == 1135 ||
            code == 1273 ||
            code == 1276 ||
            code == 1279 ||
            code == 1282
        ){
            container.style.backgroundImage = `url(./weather-condition-images/day/Cloudy.jpg)`
        }
        
        // //Rain
        else if(
            code == 1063 ||
            code == 1069 ||
            code == 1072 ||
            code == 1150 ||
            code == 1180 ||
            code == 1183 ||
            code == 1186 ||
            code == 1189 ||
            code == 1192 ||
            code == 1204 ||
            code == 1207 ||
            code == 1240 ||
            code == 1243 ||
            code == 1246 ||
            code == 1249 ||
            code == 1252 
        ){
            container.style.backgroundImage = `url(./weather-condition-images/day/Rainy.jpg)`
        }
        else{
            container.style.backgroundImage = `url(./weather-condition-images/day/Snowy.jpg)`
        }
    }
}


function getForcast(name) {
    forcastDisplayer.innerHTML = ''
    fetch(`http://api.weatherapi.com/v1/forecast.json?key=b83d999ff3eb430ca00160502230302&q=${name}&days=3&aqi=no&alerts=no`)
        .then(resp => resp.json())
        .then(data => {
            const forecast = data.forecast.forecastday[0];
            const localtime = data.location.localtime.split(' ')[1]; // extract time portion only
      
            for (let i = 0; i <= 12; i++) {
              const temp_c = forecast.hour[i].temp_c;
              const icon = forecast.hour[i].condition.icon;
      
              const wrapper = document.createElement('div');
              wrapper.classList.add('forecast-item');
      
              const temp = document.createElement('p');
              temp.innerText = temp_c;
      
              const time = document.createElement('p');
              time.innerText = formatTime(localtime, i);
      
              const iconElement = document.createElement('img');
              iconElement.src = icon;
      
              wrapper.append(iconElement);
              wrapper.append(time);
              wrapper.append(temp);
      
              forcastDisplayer.append(wrapper);
            }
            
        });

     
}

function formatTime(localtime, increment) {
    let [hours, minutes] = localtime.split(':').map(Number);
    hours = (hours + increment) % 24;

  if (hours < 10) {
    hours = '0' + hours;
  }

  return `${hours}:${minutes.toString().padStart(2, '0')}`;

}

