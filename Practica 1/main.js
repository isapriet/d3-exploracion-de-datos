// CHART START
// 1. aquí hay que poner el código que genera la gráfica

//Constantes
const width = 800
const height = 600
const margin = {
   top: 40,
   right: 40,
   bottom: 60,
   left: 50
}

//svg
const svg = d3.select("div#chart")
   .append("svg")
   .attr("width", width)
   .attr("height", height)
   
//Grupo
const elementGroup = svg.append("g")
    .attr("class", "elementGroup")
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

// Escala
const x = d3.scaleBand()
    .range([0, width-margin.left- margin.right]).padding(0.8)
const y = d3.scaleLinear()
    .range([height-margin.bottom-margin.top, 0])

// Ejes
const xAxis = d3.axisBottom().scale(x)
const yAxis = d3.axisLeft().scale(y)
const axisGroup = svg
    .append("g")
    .attr("class", "axisGroup")
const xAxisGroup = axisGroup
   .append("g")
   .attr("class", "xAxisGroup")
   .attr('transform', `translate(${margin.left},${height - margin.bottom})`)
const yAxisGroup = axisGroup
   .append("g")
   .attr("class", "yAxisGroup")
   .attr('transform', `translate(${margin.left},${margin.top})`)


// 2. aquí hay que poner el código que requiere datos para generar la gráfica
// Constantes:
let years;
let winners;
let originalData;

// data:
d3.csv("WorldCup.csv").then(data => {
    winners = data.map(d => d.Winner)
    years = data.map(d => d.Year)
    originalData = data
    update(data)
    slider()
})


// 3. función que actualiza el gráfico
// update: 
function update(data) {
    winners = data.map(d => d.Winner)
    x.domain(winners)
    y.domain([0, 5])
    yAxis.ticks(5)
    xAxisGroup.call(xAxis)
    yAxisGroup.call(yAxis)
    const elements = elementGroup.selectAll("rect").data(winners)
    elements.enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d))
        .attr("y", d => y(winners.filter(f => f === d).length))
        .attr("width", x.bandwidth())
        .attr("height", d => height-margin.top-margin.bottom - y(winners.filter(f => f === d).length))
    elements
        .attr("x", d => x(d))
        .attr("y", d => y(winners.filter(f => f === d).length))
        .attr("width", x.bandwidth())
        .attr("height", d => height-margin.top-margin.bottom - y(winners.filter(f => f === d).length))
    elements.exit()
        .remove()
}

// 4. función que filtra los datos dependiendo del año que le pasemos (year)
// treat data:
function filterDataByYear(year) { 
    data = originalData
    data = data.filter(d => d.Year <= year)
    update(data)
    d3.select("p#anyo").text("Año "+year);
}

// CHART END

// slider:
function slider() {    
    // esta función genera un slider:
    var formatYear = d3.format("d");
    var sliderTime = d3
        .sliderBottom()
        .min(d3.min(years))  // rango años
        .max(d3.max(years))
        .step(4)  // cada cuánto aumenta el slider (4 años)
        .width(580)  // ancho de nuestro slider en px
        .ticks(years.length)  
        .tickFormat(formatYear) 
        .default(years[years.length -1])  // punto inicio del marcador
        .on('onchange', val => {
            // 5. AQUÍ SÓLO HAY QUE CAMBIAR ESTO:
            filterDataByYear(val)
            // hay que filtrar los datos según el valor que marquemos en el slider y luego actualizar la gráfica con update
        });

        // contenedor del slider
        var gTime = d3 
            .select('div#slider-time')  // div donde lo insertamos
            .append('svg')
            .attr('class', 'slider')
            .attr('width', width * 0.8)
            .attr('height', 100)
            .append('g')
            .attr('transform', 'translate(15,30)');

        gTime.call(sliderTime);  // invocamos el slider en el contenedor

        d3.select('p#value-time').text(sliderTime.value());  // actualiza el año que se representa
}