const URL =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
const margin = { top: 30, right: 30, bottom: 35, left: 60 };
const h = 500 - (margin.top + margin.bottom);
const w = 800 - (margin.left + margin.right);
const formatTimeToYear = d3.timeFormat("%Y");
const formatTimeToQuarter = d3.timeFormat("%q");
const formatGDP = d3.format("$,.5r");
const svg = d3
  .select("svg")
  .attr("height", h + margin.top + margin.bottom)
  .attr("width", w + margin.left + margin.right)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

fetch(URL)
  .then((response) => response.json())
  .then(({ data }) => {
    parseData(data);
  });

const parseData = (data) => {
  // data array with objects for convenience
  data = data.map((d) => ({
    GDP: d[1],
    dataDate: d[0],
    fullDate: new Date(d[0]),
    year: formatTimeToYear(new Date(d[0])),
    q: formatTimeToQuarter(new Date(d[0])),
  }));

  const maxGDP = d3.max(data, (d) => d.GDP);
  const scaleY = d3.scaleLinear().domain([0, maxGDP]).range([h, 0]);
  const domainX = d3.extent(data, (d) => d.fullDate);
  const scaleX = d3.scaleTime().domain(domainX).range([0, w]);
  const xAxis = svg
    .append("g")
    .call(d3.axisBottom(scaleX))
    .attr("id", "x-axis")
    .attr("transform", `translate (0, ${h})`);
  const yAxis = svg
    .append("g")
    .call(d3.axisLeft(scaleY))
    .attr("id", "y-axis")
    .attr("transform", `translate (-1, 0)`);
  //a little bit of styling for our axes

  yAxis
    .selectAll("text")
    .style("fill", "var(--secondary)")
    .style("font-size", "0.9rem")
    .style("font-weight", "bold");
  yAxis.selectAll("line").style("stroke", "var(--secondary)");
  yAxis.select("path").style("stroke", "var(--secondary)");
  xAxis
    .selectAll("text")
    .style("fill", "var(--secondary)")
    .style("font-size", "0.9rem")
    .style("font-weight", "bold");
  xAxis.selectAll("line").style("stroke", "var(--secondary)");
  xAxis.select("path").style("stroke", "var(--secondary)");

  //adding text label for the y axis
  svg
    .append("text")
    .text("Gross Domestic Product")
    .attr("class", "yaxis-label")
    .attr("text-anchor", "middle")
    .attr("transform", `translate(50, ${h / 2}) rotate(-90)`);

  const div = d3
    .select("body")
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", 0);
  //selecting the svg and appending svg's rect elements with data mapping
  svg
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("data-date", (d) => d.dataDate)
    .attr("data-gdp", (d) => d.GDP)
    .attr("x", (d) => scaleX(d.fullDate))
    .attr("y", (d) => scaleY(d.GDP))
    .attr("width", 2.5)
    .attr("height", (d) => h - scaleY(d.GDP))
    //tooltip
    .on("mouseover", (d) => {
      div.attr("data-date", d.dataDate).style("opacity", 0.9);
      div
        .html(`${formatGDP(d.GDP)} Billion<br> ${d.year} Q${d.q}`)
        .style("left", `${d3.event.pageX}px`)
        .style("top", `${d3.event.pageY}px`);
    })
    .on("mouseout", (d) => {
      div.style("opacity", 0);
    });
};
