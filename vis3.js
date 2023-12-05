// Vis3.js - Genre Distribution Pie Chart with Interactive Tooltips

// Load the necessary data
d3.csv("IMDB Movies 2000 - 2020.csv").then(data => {
    let genreCounts = {};
    data.forEach(d => {
        let genres = d.genre.split(", ");
        genres.forEach(genre => {
            genreCounts[genre] = (genreCounts[genre] || 0) + 1;
        });
    });

    // Filter out genres with counts less than or equal to 300
    let filteredGenreCounts = {};
    for (const genre in genreCounts) {
        if (genreCounts[genre] > 300) {
            filteredGenreCounts[genre] = genreCounts[genre];
        }
    }

    // Convert to array for D3
    let genreData = Object.entries(filteredGenreCounts).map(([genre, count]) => ({ genre, count }));

    // Set up SVG
    const width = 300; 
    const height = 300;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select("#pieChart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // Set up color scale
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Pie generator
    const pie = d3.pie()
        .value(d => d.count);

    // Path generator
    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

    // Create arcs
    const arcs = svg.selectAll('.arc')
        .data(pie(genreData))
        .enter()
        .append('g')
        .attr('class', 'arc');

    // Tooltip for the pie chart
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("text-align", "center")
        .style("background", "#fff")
        .style("border", "1px solid #ddd")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("pointer-events", "none");

    // Draw paths (slices)
    arcs.append('path')
        .attr('d', arc)
        .attr('fill', d => color(d.data.genre))
        .on('mouseover', (event, d) => {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(`${d.data.genre}: ${d.data.count}`)
                .style("left", (event.pageX) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on('mouseout', (event, d) => {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

    // Add click event listener for filtering movies by genre
    arcs.on('click', (event, d) => {
        filterTopMoviesByGenre(d.data.genre);
    });

    // Function to filter top movies by genre
    function filterTopMoviesByGenre(genre) {
        filterMoviesByGenre(genre); // Call the function from vis1.js
    }

});
