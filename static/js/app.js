const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
let dataset;

function fetchData() {
  return d3.json(url).then(data => {
    dataset = data;
    return data;
  });
}

function populateDropdown() {
  const dropdownMenu = d3.select("#selDataset");
  const names = dataset.names;

  names.forEach(function (id) {
    dropdownMenu.append("option").text(id).property("value", id);
  });

  // Add event listener for dropdown change
  dropdownMenu.on("change", function() {
    const selectedValue = dropdownMenu.property("value");
    chartvalues(selectedValue);
    metadata(selectedValue);
  });
}

function chartvalues(passedvalue) {
  const samples = dataset.samples;
  const id = samples.find(entry => entry.id == passedvalue);

  const sample_values = id.sample_values;
  const otu_ids = id.otu_ids;
  const otu_labels = id.otu_labels;

  charts(sample_values, otu_ids, otu_labels);
}

function charts(sample_values, otu_ids, otu_labels) {
  const barChartData = [{
    type: "bar",
    x: sample_values.slice(0, 10).reverse(),
    y: otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(),
    text: otu_labels,
    orientation: 'h',
  
    
  }];
  
  const barChartLayout = {
    title: 'Bar Chart',
    height: 500,
    width: 400    
  };

  const bubbleChartData = [{
    x: otu_ids,
    y: sample_values,
    text: otu_labels,
    mode: 'markers',
    marker:{
        color: otu_ids,
        colorscale: 'Earth',
        size: sample_values
    }
  }];

  const bubbleChartLayout = {
    title: 'Bubble Chart',
    height: 550,
    width: 1000 
  };

  Plotly.newPlot('bar', barChartData, barChartLayout);
  Plotly.newPlot('bubble', bubbleChartData, bubbleChartLayout);
}

function metadata(passedvalue) {
  const samples = dataset.metadata;
  const id = samples.find(entry => entry.id == passedvalue);
  const sample_metadata = d3.select('#sample-metadata').html('');

  Object.entries(id).forEach(([key, value]) => {
    sample_metadata.append("h5").text(`${key}: ${value}`);
  });
}

function init() {
  fetchData().then(() => {
    populateDropdown();
    const initialSubject = dataset.names[0];
    chartvalues(initialSubject);
    metadata(initialSubject);
  });
}

// Initialize the whole process when the page loads
init();