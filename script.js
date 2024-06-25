//Anjali Krishna (U35346496)
// script.js
d3.csv("mock_stock_data.csv").then(data => {
    // Convert the date and price fields to appropriate formats
    data.forEach(d => {
        d.date = d3.timeParse("%m/%d/%Y")(d.Date);
        d.value = +d.Price;
    });

    // Get unique stock names for the dropdown menu
    const stockNames = [...new Set(data.map(d => d.Stock))];
    const stockSelect = d3.select("#stockName");
    stockNames.forEach(name => {
        stockSelect.append("option").text(name).attr("value", name);
    });

    // Function to filter data based on selected stock name and date range
    function filterData(stockName, dateRange) {
        return data.filter(d => (!stockName || d.Stock === stockName) &&
                                (!dateRange || (d.date >= dateRange[0] && d.date <= dateRange[1])));
    }

    // Function to update the visualization based on filtered data
    function updateFilteredVisualization() {
        const stockName = stockSelect.property("value");
        const startDate = d3.select("#startDate").property("value");
        const endDate = d3.select("#endDate").property("value");
        const filteredData = filterData(stockName, [
            startDate ? new Date(startDate) : new Date("01/01/2023"),
            endDate ? new Date(endDate) : new Date("12/31/2023")
        ]);
        // Clear previous visualization
        d3.select("svg").selectAll("*").remove();
        // Update visualization with filtered data
        updateVisualization(filteredData);
    }

    // Initial visualization with full dataset
    updateVisualization(data);

    // Add event listeners to update the visualization when filters change
    stockSelect.on("change", updateFilteredVisualization);
    d3.select("#startDate").on("change", updateFilteredVisualization);
    d3.select("#endDate").on("change", updateFilteredVisualization);
});

// Function to create and update the visualization
function updateVisualization(data) {
    const svgWidth = 600;
    const svgHeight = 600;
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    // Create SVG element
    const svg = d3.select("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    // Create a group element for margins
    const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Define scales for x and y axes
    const x = d3.scaleTime()
        .range([0, width])
        .domain(d3.extent(data, d => d.date));

    const y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(data, d => d.value)]);

    // Define the line generator
    const line = d3.line()
        .x(d => x(d.date))
        .y(d => y(d.value));

    // Add x-axis to the group
    g.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    // Add y-axis to the group
    g.append("g")
        .call(d3.axisLeft(y));

    // Add the line path to the group
    g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", line);

    
