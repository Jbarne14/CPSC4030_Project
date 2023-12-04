// Vis3.js - Genre Distribution Pie Chart with Labels

// Load the necessary data
d3.csv("IMDB Movies 2000 - 2020.csv").then(data => {
    let genreCounts = {};
    data.forEach(d => {
        let genres = d.genre.split(", ");
        genres.forEach(genre => {
            genreCounts[genre] = (genreCounts[genre] || 0) + 1;
        });
    });

    // Convert to array for D3
    let genreData = Object.entries(genreCounts).map(([genre, count]) => ({ genre, count }));

    // Set up SVG
    const width = 450;
    const height = 450;
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

    // Label arc (for positioning the labels)
    const labelArc = d3.arc()
        .innerRadius(radius - 40)
        .outerRadius(radius - 40);

    // Create arcs
    const arcs = svg.selectAll('.arc')
        .data(pie(genreData))
        .enter()
        .append('g')
        .attr('class', 'arc');

    // Draw paths (slices) and labels
    arcs.each(function(d) {
        const arcGroup = d3.select(this);
        arcGroup.append('path')
            .attr('d', arc)
            .attr('fill', () => color(d.data.genre));

        arcGroup.append('text')
            .attr("transform", () => `translate(${labelArc.centroid(d)})`)
            .attr("dy", ".35em")
            .text(() => `${d.data.genre}: ${d.data.count}`)
            .style("text-anchor", "middle")
            .style("font-size", "12px")
            .style("fill", "#ffffff");
    });


    // Add click event listener for filtering movies by genre
    arcs.on('click', (event, d) => {
        filterTopMoviesByGenre(d.data.genre);
    });

    // Function to filter top movies by genre
    function filterTopMoviesByGenre(genre) {
        // Assuming you have a function to update the chart with filtered data
        filterMoviesByGenre(genre); // Call the function from vis1.js
    }


    // Placeholder function - Replace with actual implementation
    function updateTopMoviesChart(filteredData) {
        // Implement the logic to update the chart or list with filtered data
        // This part of the code depends on your application's structure
        console.log('Top movies for genre:', genre, filteredData);
    }
});
