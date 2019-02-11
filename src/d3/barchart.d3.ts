import { select } from "d3-selection";
import { scaleLinear, scaleBand, scaleOrdinal } from "d3-scale";
import { schemeSet1 } from "d3-scale-chromatic";
import { line } from "d3-shape";
import { monthNames, malagaStats } from "./barchart.data";
import { axisBottom, axisLeft } from "d3-axis";
import { max } from "d3-array";

const d3 = {
  select,
  scaleLinear,
  scaleBand,
  scaleOrdinal,
  max,
  line,
  axisBottom,
  axisLeft,
  schemeSet1,
}

const width = 500;
const height = 300;
const padding = 50;
const marginLeft = 30;
const marginBottom = 40;

const keys = malagaStats.reduce((acc, s) => acc.concat(s.id), []);

// Se crea la tarjeta
const card = d3
  .select("#root")
  .append("div")
  .attr("class", "card");

// Se crea el lienzo svg
const svg = card
  .append("svg")
  .attr("width", "100%")
  .attr("height", "100%")
  .attr("viewBox", `${-padding} ${-padding} ${width + 2 * padding} ${height + 2 * padding}`);

// Eje y: escala lineal para los valores de temperaturas
const yScale = d3
  .scaleLinear()
  .domain([0, d3.max(malagaStats.reduce((acc, s) => acc.concat(s.values), []))])
  .range([height, 0]);

// Eje x: escala de bandas para la agrupación de bandas por cada mes
const xScaleMonth = d3
  .scaleBand()
  .domain(monthNames)
  .rangeRound([0, width])
  .paddingInner(0.2);

const xScaleTemp = d3
  .scaleBand()
  .domain(keys)
  .rangeRound([0, xScaleMonth.bandwidth()])
  .padding(0.1);

const colorScale = d3
  .scaleOrdinal(d3.schemeSet1)
  .domain(["max", "min", "avg"]);

// Grupo para las barras
const barGroup = svg
  .append("g");

barGroup
  .append("g")
  .selectAll("g")
  .data(malagaStats)
  .enter()
  .append("g")
    .attr("transform", function(d) { return `translate(${xScaleTemp(d.id)}, 0)`})
    .attr("fill", d => colorScale(d.id))
  .selectAll("rect")
  .data(function(d) { return d.values })
  .enter()
  .append("rect")
    .attr("x", (d,i) => xScaleMonth(monthNames[i]))
    .attr("y", d => yScale(d))
    .attr("width", xScaleTemp.bandwidth())
    .attr("height", d => height - yScale(d));

// Grupo para los ejes
const axisGroup = svg
  .append("g");

// Grupo para el eje y dentro del grupo de ejes
axisGroup
  .append("g")
  .call(d3.axisLeft(yScale));

// Grupo para el eje x dentro del grupo de ejes
axisGroup
  .append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(d3.axisBottom(xScaleMonth));

// Título para el eje x
svg
  .append("text")             
    .attr("transform", `translate(${width/2}, ${height + marginBottom})`)
    .style("text-anchor", "middle")
    .text("Month");

// Título para el eje y
svg
  .append("text")             
    .attr("transform", `rotate(-90)`)
    .attr("y", -marginLeft)
    .attr("x", -(height / 2))
    .style("text-anchor", "middle")
    .text("Temperature (℃)");

// Leyenda
var legend = svg
  .append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .attr("text-anchor", "end")
  .selectAll("g")
  .data(keys)
  .enter()
  .append("g")
    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

legend.append("rect")
    .attr("x", width - 19)
    .attr("width", 19)
    .attr("height", 19)
    .attr("fill", colorScale);

legend.append("text")
    .attr("x", width - 24)
    .attr("y", 9.5)
    .attr("dy", "0.32em")
    .text(function(d) { return d; });