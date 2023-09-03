const diCaprioBirthYear = 1974;
const age = function(year) { return year - diCaprioBirthYear}
const today = new Date().getFullYear()
const ageToday = age(today)
const coloresModelos = d3.scaleOrdinal(d3.schemeCategory10);

//Constantes
const width = 800
const height = 600
const margin = {
    top: 40,
    bottom: 80,
    left: 30,
    right: 2
}

//svg
const svg = d3.select("#chart")
    .append("svg")
    .attr("id", "svg")
    .attr("width", width)
    .attr("height", height)

//Grupos
const elementGroup = svg.append("g")
    .attr("class", "elementGroup")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)
const axisGroup = svg.append("g").attr("class", "axisGroup")
const xAxisGroup = axisGroup.append("g")
    .attr("class", "xAxisGroup")
    .attr("transform", `translate(${margin.left}, ${height-margin.bottom})`)
const yAxisGroup = axisGroup.append("g")
    .attr("class", "yAxisGroup")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)

//Escala
const x = d3.scaleBand().range([0, width-margin.left-margin.right]).padding(0.2)
const y = d3.scaleLinear().range([height-margin.bottom-margin.top, 0])

//Ejes
const xAxis = d3.axisBottom().scale(x)
const yAxis = d3.axisLeft().scale(y)

//Datos
d3.csv("data.csv").then(data => {
    data.map(d => {
        d.year = +d.year;
        d.age = +d.age;
        d.leoAge = age(d.year);
    });

    const nombresUnicos = [...new Set(data.map(d => d.name))];

    x.domain(data.map(d => d.year));
    y.domain([0, d3.max(data, d => Math.max(d.age, d.leoAge))]);

    elementGroup.append("path")
        .datum(data)
        .attr("class", "linea DiCaprio")
        .attr("fill", "none")
        .attr("d", d3.line()
            .x(d => x(d.year) + x.bandwidth() / 2)
            .y(d => y(d.leoAge))
            );

    elementGroup.append("text")
        .attr("class", "leyenda")
        .attr("x", width - 250) 
        .attr("y", margin.top - 40) 
        .text("Edad DiCaprio"); 

    elementGroup.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "rect")
        .attr("x", d => x(d.year))
        .attr("y", d => y(d.age))
        .attr("width", x.bandwidth())
        .attr("height", d => height - margin.top - margin.bottom - y(d.age))
        .attr("fill", d => coloresModelos(d.name));

    let thresholdLine = y(25);

    elementGroup.append("line")
        .attr("x1", 0)
        .attr("y1", thresholdLine)
        .attr("x2", width)
        .attr("y2", thresholdLine)
        .attr("class", "limite")

    elementGroup.append("text")
        .attr("class", "leyenda-limite")
        .attr("x", width - 100) 
        .attr("y", thresholdLine - 15) 
        .text("25 años"); 

    const leyenda = svg.append("g")
        .attr("class", "leyenda")
        .attr("transform", `translate(${margin.left}, ${height - margin.bottom + 30})`);

    const leyendaItems = leyenda.selectAll(".leyenda-item")
        .data(nombresUnicos)
        .enter()
        .append("g")
        .attr("class", "leyenda-item")
        .attr("transform", (d, i) => `translate(${i * 100}, 10)`);

    leyendaItems.append("rect")
        .attr("x", 0)
        .attr("y", 15)
        .attr("width", 10)
        .attr("height", 12)
        .attr("fill", coloresModelos);

    leyendaItems.append("text")
        .attr("x", 20)
        .attr("y", 20)
        .attr("dy", "0.60em")
        .style("font-size", "7px")
        .text(d => d);
    
    // Transicion color al pasar el cursor
    const rect = elementGroup.selectAll(".rect");
    
    rect.on("mouseover", function(d) {
        const isModeloSeleccionada = d.name === "NombreDeLaModeloSeleccionada";
        d3.selectAll(".rect")
        .transition()
        .duration(200)
        .attr("fill", otherD => (otherD.name === d.name) ? coloresModelos(d.name) : "black");
    }) 
   
    .on("mouseout", function(d) {
        d3.selectAll(".rect")
            .transition()
            .duration(200)
            .attr("fill", d => coloresModelos(d.name)); 
    });

    xAxisGroup.call(xAxis);
    yAxisGroup.call(yAxis);

    console.log(data)
 
})


