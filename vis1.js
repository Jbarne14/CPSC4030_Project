d3.csv("IMDB Movies 2000 - 2020.csv").then(data => {
    data.forEach(d => {
        d.worlwide_gross_income = +d.worlwide_gross_income; // Convert string to number
    });

    // Sort data by worldwide gross income and get top 10
    let topMovies = data.sort((a, b) => b.worlwide_gross_income - a.worlwide_gross_income).slice(0, 10);

    // Set up SVG canvas dimensions
    const width = 500;
    const height = 250;
    const margin = { top: 50, right: 20, bottom: 150, left: 250 }; // Adjusted top margin for chart title

    const svg = d3.select("#barChart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .style("display", "block")
        .style("margin", "auto")
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add chart title
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text("Top 10 Movies by Worldwide Gross Income");

    // Set up scales
    const x = d3.scaleBand()
        .domain(topMovies.map(d => d.title))
        .range([0, width])
        .padding(0.1);
    const y = d3.scaleLinear()
        .domain([0, d3.max(topMovies, d => d.worlwide_gross_income)])
        .range([height, 0]);

        // Add bars
    svg.selectAll(".bar")
        .data(topMovies)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.title))
        .attr("y", d => y(d.worlwide_gross_income))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.worlwide_gross_income))
        .on("click", function(d) {
            const currentBar = d3.select(this);
            
            // If the bar is already active, reset it
            if (currentBar.classed("active")) {
                currentBar.style("fill", "steelblue").classed("active", false);
                svg.select(".tooltip").remove();
            } else {
                // Reset all bars
                d3.selectAll(".bar").style("fill", "steelblue").classed("active", false);
                svg.select(".tooltip").remove();

                // Activate the clicked bar
                currentBar.style("fill", "orange").classed("active", true);
                
                if (d.title && d.worlwide_gross_income) {
                    // Show movie details on click
                    svg.append("text")
                        .attr("class", "tooltip")
                        .attr("x", x(d.title) + x.bandwidth() / 2)
                        .attr("y", Math.max(y(d.worlwide_gross_income) - 10, 15))
                        .attr("text-anchor", "middle")
                        .style("fill", "black")
                        .text(`${d.title}: $${d.worlwide_gross_income.toLocaleString()}`);
                }
            }
        });

    // Add x-axis and its title
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-60)")
        .attr("dx", "-.8em")
        .attr("dy", ".25em")
        .style("text-anchor", "end");

    svg.append("text")
        .attr("transform", `translate(${width / 2},${height + margin.bottom - 50})`)
        .style("text-anchor", "middle")
        .text("Movie Title");

    // Add y-axis and its title
    svg.append("g").call(d3.axisLeft(y));

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 125)
        .attr("x", -height / 2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Worldwide Gross Income ($)");
});
